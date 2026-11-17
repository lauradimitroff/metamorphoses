import type { Appellation, Catalogue, Composition, ElementId } from './types'

/*
 * Décrit la composition en une phrase, pour les lecteurs d'écran (zone aria-live)
 * et pour les tests de bout en bout, qui vérifient ainsi la scène sans comparer d'images.
 *
 * Repère : le visiteur regarde le bocal depuis l'avant. L'axe z positif vient vers
 * lui (« l'avant »), l'axe x positif part vers sa droite.
 */

export type Zone =
  | 'centre'
  | 'avant'
  | 'avant-droit'
  | 'droite'
  | 'arriere-droit'
  | 'arriere'
  | 'arriere-gauche'
  | 'gauche'
  | 'avant-gauche'

/**
 * Ordre de lecture : le centre, puis la scène comme on la regarde,
 * de l'avant vers l'arrière et de gauche à droite (comme on lit une page).
 */
const ORDRE_DES_ZONES: readonly Zone[] = [
  'centre',
  'avant-gauche',
  'avant',
  'avant-droit',
  'gauche',
  'droite',
  'arriere-gauche',
  'arriere',
  'arriere-droit',
]

const EXPRESSIONS: Readonly<Record<Zone, string>> = {
  centre: 'au centre',
  avant: 'à l’avant',
  'avant-droit': 'à l’avant droit',
  droite: 'à droite',
  'arriere-droit': 'à l’arrière droit',
  arriere: 'à l’arrière',
  'arriere-gauche': 'à l’arrière gauche',
  gauche: 'à gauche',
  'avant-gauche': 'à l’avant gauche',
}

/** Zones des huit secteurs de 45°, en partant de l'avant et en tournant vers la droite. */
const SECTEURS: readonly Zone[] = [
  'avant',
  'avant-droit',
  'droite',
  'arriere-droit',
  'arriere',
  'arriere-gauche',
  'gauche',
  'avant-gauche',
]

/** En deçà de cette part du rayon du sol, un élément est « au centre ». */
const RAYON_DU_CENTRE = 0.3

export function zoneDe(x: number, z: number, rayonSol: number): Zone {
  const xUnites = x / 1000
  const zUnites = z / 1000
  if (Math.hypot(xUnites, zUnites) < RAYON_DU_CENTRE * rayonSol) return 'centre'

  // Angle mesuré depuis l'avant (+z), en tournant vers la droite (+x).
  const angle = Math.atan2(xUnites, zUnites)
  const secteur = Math.round(angle / (Math.PI / 4))
  return SECTEURS[(secteur + 8) % 8] ?? 'avant'
}

const NOMBRES = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix'] as const

/** « une fougère », « trois touffes de mousse », « 12 poignées de galets ». */
export function compter(quantite: number, appellation: Appellation): string {
  if (quantite === 1) return `${appellation.genre === 'feminin' ? 'une' : 'un'} ${appellation.singulier}`
  return `${NOMBRES[quantite] ?? quantite} ${appellation.pluriel}`
}

/** « a », « a et b », « a, b et c ». */
export function enumerer(parties: readonly string[]): string {
  if (parties.length <= 1) return parties.join('')
  return `${parties.slice(0, -1).join(', ')} et ${parties.at(-1)}`
}

const majuscule = (texte: string) => texte.charAt(0).toUpperCase() + texte.slice(1)

export function decrireComposition(composition: Composition, catalogue: Catalogue): string {
  const matiere = catalogue.bocal.matieres[composition.matiere].nom.toLowerCase()
  if (composition.elements.length === 0) return `Bocal en ${matiere}, encore vide.`

  // Pour chaque zone, le nombre de chaque élément qui s'y trouve.
  const parZone = new Map<Zone, Map<ElementId, number>>()
  for (const { elementId, x, z } of composition.elements) {
    const zone = zoneDe(x, z, catalogue.bocal.rayonSol)
    const quantites = parZone.get(zone) ?? new Map<ElementId, number>()
    quantites.set(elementId, (quantites.get(elementId) ?? 0) + 1)
    parZone.set(zone, quantites)
  }

  const phrases = ORDRE_DES_ZONES.flatMap((zone) => {
    const quantites = parZone.get(zone)
    if (!quantites) return []
    // Dans une zone, les éléments suivent l'ordre du catalogue.
    const parties = Object.values(catalogue.elements)
      .filter((element) => quantites.has(element.id))
      .map((element) => compter(quantites.get(element.id) ?? 0, element.appellation))
    return [`${majuscule(EXPRESSIONS[zone])}, ${enumerer(parties)}.`]
  })

  return [`Bocal en ${matiere}.`, ...phrases].join(' ')
}

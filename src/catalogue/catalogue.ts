import type { Catalogue, DefinitionBocal, DefinitionElement, ElementId, FamilleId } from '../domaine/types'

/*
 * Les données du catalogue. Ajouter un élément revient à ajouter une entrée ici,
 * puis son générateur 3D. Deux rayons par élément : l'emprise de son pied au sol, et
 * sa forme vue de dessus. Un feuillage peut ainsi passer au-dessus d'un voisin (D12).
 */

export const BOCAL: DefinitionBocal = {
  // Limite utile : juste avant la paroi intérieure du verre (rayon 0,609).
  rayonSol: 0.6,
  // Au-dessus des couches de drainage et de terre, visibles à travers le verre.
  hauteurSol: 0.36,
  matieres: {
    'verre-clair': { nom: 'Verre clair', prixCentimes: 5400 },
    'verre-ambre': { nom: 'Verre ambré', prixCentimes: 6400 },
  },
}

export const FAMILLES: ReadonlyArray<{ id: FamilleId; nom: string }> = [
  { id: 'vegetal', nom: 'Végétal' },
  { id: 'mineral', nom: 'Minéral' },
  { id: 'champignons', nom: 'Champignons' },
]

export const ELEMENTS: Readonly<Record<ElementId, DefinitionElement>> = {
  mousse: {
    id: 'mousse',
    nom: 'Touffe de mousse',
    appellation: { singulier: 'touffe de mousse', pluriel: 'touffes de mousse', genre: 'feminin' },
    description: 'Un coussin vert et dense, qui garde l’humidité du sol.',
    famille: 'vegetal',
    prixCentimes: 300,
    rayonEncombrement: 0.1,
    rayonVisuel: 0.13,
    creditIds: [],
  },
  fougere: {
    id: 'fougere',
    nom: 'Petite fougère',
    appellation: { singulier: 'fougère', pluriel: 'fougères', genre: 'feminin' },
    description: 'Ses frondes se déploient en éventail au-dessus de la mousse.',
    famille: 'vegetal',
    prixCentimes: 800,
    rayonEncombrement: 0.14,
    rayonVisuel: 0.3,
    creditIds: ['modele-fougere'],
  },
  galets: {
    id: 'galets',
    nom: 'Galets de rivière',
    appellation: { singulier: 'poignée de galets', pluriel: 'poignées de galets', genre: 'feminin' },
    description: 'Trois pierres polies par l’eau, aux teintes de schiste.',
    famille: 'mineral',
    prixCentimes: 200,
    rayonEncombrement: 0.09,
    rayonVisuel: 0.12,
    creditIds: [],
  },
  amethyste: {
    id: 'amethyste',
    nom: 'Améthyste',
    appellation: { singulier: 'améthyste', pluriel: 'améthystes', genre: 'feminin' },
    description: 'Une pointe de quartz violet, qui retient la lumière de la bougie.',
    famille: 'mineral',
    prixCentimes: 1200,
    rayonEncombrement: 0.1,
    rayonVisuel: 0.14,
    creditIds: [],
  },
  'champignons-luminescents': {
    id: 'champignons-luminescents',
    nom: 'Champignons luminescents',
    appellation: {
      singulier: 'groupe de champignons luminescents',
      pluriel: 'groupes de champignons luminescents',
      genre: 'masculin',
    },
    description: 'Trois chapeaux pâles le jour, qui s’éveillent d’une lueur verte à la nuit tombée.',
    famille: 'champignons',
    prixCentimes: 700,
    rayonEncombrement: 0.1,
    rayonVisuel: 0.18,
    creditIds: [],
  },
}

/** Les éléments dans l'ordre d'affichage du catalogue. */
export const LISTE_ELEMENTS: readonly DefinitionElement[] = Object.values(ELEMENTS)

export const CATALOGUE: Catalogue = { bocal: BOCAL, elements: ELEMENTS }

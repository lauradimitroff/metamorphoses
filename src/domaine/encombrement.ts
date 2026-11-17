import type { Catalogue, Composition, ElementId } from './types'

/*
 * Les règles de place (D1, D4). Chaque élément occupe au sol un cercle de rayon
 * `rayonEncombrement`. Les positions des compositions sont en millièmes d'unité
 * (des entiers) ; les calculs se font en unités de scène.
 */

/** Part maximale du sol que les éléments peuvent couvrir. */
export const OCCUPATION_MAXIMALE = 0.7

/** Tolérance pour les comparaisons : deux cercles qui se touchent tout juste ne se chevauchent pas. */
const EPSILON = 1e-9

/** L'angle d'or, en radians (environ 137,5°) : celui des graines d'un tournesol. */
const ANGLE_D_OR = Math.PI * (3 - Math.sqrt(5))

/** Nombre de points essayés sur la spirale pour trouver une place libre. */
const POINTS_DE_SPIRALE = 240

export interface Emplacement {
  /** En millièmes d'unité de scène (entiers). */
  x: number
  z: number
}

const enUnites = (milliemes: number) => milliemes / 1000

/** Le cercle entier de l'élément reste-t-il sur le sol du bocal ? */
export function estDansLeBocal(emplacement: Emplacement, rayon: number, rayonSol: number): boolean {
  const distanceAuCentre = Math.hypot(enUnites(emplacement.x), enUnites(emplacement.z))
  return distanceAuCentre + rayon <= rayonSol + EPSILON
}

export function seChevauchent(a: Emplacement, rayonA: number, b: Emplacement, rayonB: number): boolean {
  const distance = Math.hypot(enUnites(a.x - b.x), enUnites(a.z - b.z))
  return distance < rayonA + rayonB - EPSILON
}

/**
 * Un élément peut-il se tenir à cet emplacement ?
 * `uidIgnore` exclut l'élément lui-même quand on le déplace.
 */
export function emplacementValide(
  composition: Composition,
  elementId: ElementId,
  emplacement: Emplacement,
  catalogue: Catalogue,
  uidIgnore?: string,
): boolean {
  const rayon = catalogue.elements[elementId].rayonEncombrement
  if (!estDansLeBocal(emplacement, rayon, catalogue.bocal.rayonSol)) return false

  return composition.elements.every(
    (voisin) =>
      voisin.uid === uidIgnore ||
      !seChevauchent(emplacement, rayon, voisin, catalogue.elements[voisin.elementId].rayonEncombrement),
  )
}

/**
 * Part du sol couverte, de 0 à 1. C'est un rapport de surfaces :
 * Σ π r² / π R², où les π se simplifient.
 */
export function tauxOccupation(composition: Composition, catalogue: Catalogue): number {
  const rayonSol = catalogue.bocal.rayonSol
  const surfaces = composition.elements.reduce(
    (somme, { elementId }) => somme + catalogue.elements[elementId].rayonEncombrement ** 2,
    0,
  )
  return surfaces / rayonSol ** 2
}

/** Ajouter cet élément dépasserait-il la jauge ? */
export function resteDeLaPlace(composition: Composition, elementId: ElementId, catalogue: Catalogue): boolean {
  const ajout = (catalogue.elements[elementId].rayonEncombrement / catalogue.bocal.rayonSol) ** 2
  return tauxOccupation(composition, catalogue) + ajout <= OCCUPATION_MAXIMALE + EPSILON
}

/**
 * Trouve où déposer un nouvel élément, ou null s'il n'y a plus de place.
 *
 * On parcourt une spirale de Vogel : le point n° i est à la distance √(i / n) du centre,
 * tourné de i fois l'angle d'or. Les points couvrent ainsi le disque de façon régulière,
 * du centre vers le bord. On garde le premier emplacement valide : le résultat est
 * toujours le même pour une même composition (déterministe).
 */
export function trouverPlaceLibre(
  composition: Composition,
  elementId: ElementId,
  catalogue: Catalogue,
): Emplacement | null {
  if (!resteDeLaPlace(composition, elementId, catalogue)) return null

  const rayonUtile = catalogue.bocal.rayonSol - catalogue.elements[elementId].rayonEncombrement
  if (rayonUtile < 0) return null

  for (let i = 0; i < POINTS_DE_SPIRALE; i++) {
    const distance = rayonUtile * Math.sqrt(i / (POINTS_DE_SPIRALE - 1))
    const angle = i * ANGLE_D_OR
    const emplacement = {
      x: Math.round(Math.cos(angle) * distance * 1000),
      z: Math.round(Math.sin(angle) * distance * 1000),
    }
    // On vérifie APRÈS l'arrondi en millièmes : c'est cette position-là qui sera enregistrée.
    if (emplacementValide(composition, elementId, emplacement, catalogue)) return emplacement
  }

  return null
}

/** Ramène une rotation entre 0 et 23 crans, dans un sens comme dans l'autre. */
export function normaliserRotation(crans: number): number {
  return ((crans % 24) + 24) % 24
}

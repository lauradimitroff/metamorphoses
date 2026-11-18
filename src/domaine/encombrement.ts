import type { Catalogue, Composition, ElementId, ElementPose } from './types'

/*
 * Les règles de place (D1, D4). Chaque élément occupe au sol un cercle de rayon
 * `rayonEncombrement`. Les positions des compositions sont en millièmes d'unité
 * (des entiers) ; les calculs se font en unités de scène.
 */

/**
 * Part maximale du sol que les emprises peuvent couvrir. Des cercles laissent toujours
 * des vides entre eux : au-delà de la moitié du sol, on ne trouve presque plus de place (D13).
 */
export const OCCUPATION_MAXIMALE = 0.5

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

/** La forme entière de l'élément reste-t-elle à l'intérieur du verre ? */
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
  const { rayonEncombrement: rayon, rayonVisuel } = catalogue.elements[elementId]
  if (!estDansLeBocal(emplacement, rayonVisuel, catalogue.bocal.rayonSol)) return false

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

  const rayonUtile = catalogue.bocal.rayonSol - catalogue.elements[elementId].rayonVisuel
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

const ETAPES_DE_DEPLACEMENT = 32

/** Avance de `depart` vers `cible` et s'arrête juste avant le premier obstacle. */
function avancer(
  composition: Composition,
  pose: ElementPose,
  depart: Emplacement,
  cible: Emplacement,
  catalogue: Catalogue,
): Emplacement {
  let atteint = depart
  for (let i = 1; i <= ETAPES_DE_DEPLACEMENT; i++) {
    const t = i / ETAPES_DE_DEPLACEMENT
    const essai = {
      x: Math.round(depart.x + (cible.x - depart.x) * t),
      z: Math.round(depart.z + (cible.z - depart.z) * t),
    }
    if (!emplacementValide(composition, pose.elementId, essai, catalogue, pose.uid)) break
    atteint = essai
  }
  return atteint
}

/**
 * Où l'élément peut-il aller en direction de `cible` ? Il s'arrête contre le verre,
 * bute contre ses voisins, puis glisse le long de l'obstacle s'il reste de la marge.
 */
export function rejoindreEmplacement(
  composition: Composition,
  pose: ElementPose,
  cible: Emplacement,
  catalogue: Catalogue,
): Emplacement {
  const limite = (catalogue.bocal.rayonSol - catalogue.elements[pose.elementId].rayonVisuel) * 1000
  const distance = Math.hypot(cible.x, cible.z)
  const echelle = distance > limite ? limite / distance : 1
  const vise = { x: Math.trunc(cible.x * echelle), z: Math.trunc(cible.z * echelle) }

  const direct = avancer(composition, pose, pose, vise, catalogue)
  const surX = avancer(composition, pose, direct, { x: vise.x, z: direct.z }, catalogue)
  return avancer(composition, pose, surX, { x: surX.x, z: vise.z }, catalogue)
}

/**
 * Remplissage affiché par la jauge, de 0 à 1. Il ne vaut 1 que si plus aucun élément du
 * catalogue ne trouve de place : la jauge ne dit jamais « plein » à tort, ni l'inverse.
 */
export function remplissage(composition: Composition, catalogue: Catalogue): number {
  const elements = Object.values(catalogue.elements)
  if (elements.every(({ id }) => trouverPlaceLibre(composition, id, catalogue) === null)) return 1
  return Math.min(0.95, tauxOccupation(composition, catalogue) / OCCUPATION_MAXIMALE)
}

/** Ramène une rotation entre 0 et 23 crans, dans un sens comme dans l'autre. */
export function normaliserRotation(crans: number): number {
  return ((crans % 24) + 24) % 24
}

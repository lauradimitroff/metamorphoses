import { CATALOGUE } from '../catalogue/catalogue'
import type { Catalogue, Composition, ElementId, ElementPose, MatiereId } from './types'

/*
 * Données de test. Le catalogue de test a un sol de rayon 1 et des rayons ronds :
 * les calculs se vérifient de tête. Les noms et prix sont ceux du vrai catalogue.
 */

const RAYONS_DE_TEST: Readonly<Record<ElementId, number>> = {
  mousse: 0.1,
  fougere: 0.3,
  galets: 0.1,
  amethyste: 0.2,
  'champignons-luminescents': 0.1,
}

export const CATALOGUE_DE_TEST: Catalogue = {
  chaudron: { ...CATALOGUE.chaudron, rayonSol: 1 },
  elements: Object.fromEntries(
    Object.values(CATALOGUE.elements).map((element) => [
      element.id,
      { ...element, rayonEncombrement: RAYONS_DE_TEST[element.id] },
    ]),
  ) as Catalogue['elements'],
}

let compteur = 0

/** Pose un élément à une position en millièmes d'unité. */
export function poser(elementId: ElementId, x = 0, z = 0, rotation = 0): ElementPose {
  compteur += 1
  return { uid: `test-${compteur}`, elementId, x, z, rotation }
}

export function composer(elements: ElementPose[] = [], matiere: MatiereId = 'fonte'): Composition {
  return { matiere, elements }
}

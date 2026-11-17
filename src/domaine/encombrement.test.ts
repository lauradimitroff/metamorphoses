import { describe, expect, it } from 'vitest'
import { CATALOGUE } from '../catalogue/catalogue'
import {
  emplacementValide,
  estDansLeChaudron,
  normaliserRotation,
  OCCUPATION_MAXIMALE,
  resteDeLaPlace,
  seChevauchent,
  tauxOccupation,
  trouverPlaceLibre,
} from './encombrement'
import { CATALOGUE_DE_TEST, composer, poser } from './fixtures'
import type { Catalogue, Composition, ElementId } from './types'

describe('estDansLeChaudron', () => {
  it('accepte un cercle qui touche tout juste le bord, et refuse celui qui dépasse', () => {
    expect(estDansLeChaudron({ x: 0, z: 0 }, 0.1, 1)).toBe(true)
    expect(estDansLeChaudron({ x: 900, z: 0 }, 0.1, 1)).toBe(true)
    expect(estDansLeChaudron({ x: 901, z: 0 }, 0.1, 1)).toBe(false)
  })
})

describe('seChevauchent', () => {
  it('ne considère pas deux cercles qui se touchent comme chevauchants', () => {
    expect(seChevauchent({ x: 0, z: 0 }, 0.1, { x: 200, z: 0 }, 0.1)).toBe(false)
    expect(seChevauchent({ x: 0, z: 0 }, 0.1, { x: 199, z: 0 }, 0.1)).toBe(true)
  })
})

describe('emplacementValide', () => {
  const fougere = poser('fougere', 0, 0)
  const composition = composer([fougere])

  it('refuse un emplacement qui empiète sur un voisin', () => {
    expect(emplacementValide(composition, 'mousse', { x: 350, z: 0 }, CATALOGUE_DE_TEST)).toBe(false)
    expect(emplacementValide(composition, 'mousse', { x: 400, z: 0 }, CATALOGUE_DE_TEST)).toBe(true)
  })

  it('ignore l’élément lui-même quand on le déplace', () => {
    expect(emplacementValide(composition, 'fougere', { x: 50, z: 0 }, CATALOGUE_DE_TEST, fougere.uid)).toBe(true)
  })
})

describe('tauxOccupation et resteDeLaPlace', () => {
  it('rapporte la surface des cercles à celle du sol', () => {
    // Une fougère de rayon 0,3 sur un sol de rayon 1 : 0,3² / 1² = 0,09.
    expect(tauxOccupation(composer([poser('fougere')]), CATALOGUE_DE_TEST)).toBeCloseTo(0.09)
  })

  it('refuse un ajout qui dépasserait 70 % du sol', () => {
    // Chaque améthyste couvre 0,2² = 4 % : 17 font 68 %, une 18e porterait à 72 %.
    const dixSept = composer(Array.from({ length: 17 }, () => poser('amethyste')))
    expect(resteDeLaPlace(dixSept, 'mousse', CATALOGUE_DE_TEST)).toBe(true) // 68 % + 1 % = 69 %
    expect(resteDeLaPlace(dixSept, 'amethyste', CATALOGUE_DE_TEST)).toBe(false)
  })
})

/** Remplit le chaudron en déposant l'élément jusqu'à ce qu'il n'y ait plus de place. */
function remplir(elementId: ElementId, catalogue: Catalogue): Composition {
  let composition = composer()
  for (let i = 0; i < 500; i++) {
    const place = trouverPlaceLibre(composition, elementId, catalogue)
    if (!place) break
    composition = composer([...composition.elements, poser(elementId, place.x, place.z)])
  }
  return composition
}

describe('trouverPlaceLibre', () => {
  it('pose le premier élément au centre', () => {
    expect(trouverPlaceLibre(composer(), 'fougere', CATALOGUE_DE_TEST)).toEqual({ x: 0, z: 0 })
  })

  it('donne toujours la même réponse pour la même composition', () => {
    const composition = composer([poser('fougere')])
    expect(trouverPlaceLibre(composition, 'mousse', CATALOGUE_DE_TEST)).toEqual(
      trouverPlaceLibre(composition, 'mousse', CATALOGUE_DE_TEST),
    )
  })

  it('ne propose que des emplacements valides, jusqu’à ce que le chaudron soit plein', () => {
    for (const elementId of ['mousse', 'amethyste', 'fougere'] as const) {
      const plein = remplir(elementId, CATALOGUE)
      expect(plein.elements.length).toBeGreaterThan(1)
      // Chaque élément posé est valide au regard de tous les autres.
      for (const pose of plein.elements) {
        expect(emplacementValide(plein, elementId, pose, CATALOGUE, pose.uid)).toBe(true)
      }
      expect(tauxOccupation(plein, CATALOGUE)).toBeLessThanOrEqual(OCCUPATION_MAXIMALE)
      expect(trouverPlaceLibre(plein, elementId, CATALOGUE)).toBeNull()
    }
  })

  it('renvoie des positions entières, en millièmes', () => {
    const place = trouverPlaceLibre(composer([poser('fougere')]), 'galets', CATALOGUE)
    expect(place).not.toBeNull()
    expect(Number.isInteger(place?.x)).toBe(true)
    expect(Number.isInteger(place?.z)).toBe(true)
  })
})

describe('normaliserRotation', () => {
  it('ramène toute rotation entre 0 et 23 crans', () => {
    expect(normaliserRotation(0)).toBe(0)
    expect(normaliserRotation(24)).toBe(0)
    expect(normaliserRotation(25)).toBe(1)
    expect(normaliserRotation(-1)).toBe(23)
  })
})

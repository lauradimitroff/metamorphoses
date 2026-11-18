import { describe, expect, it } from 'vitest'
import { CATALOGUE } from '../catalogue/catalogue'
import {
  emplacementValide,
  estDansLeBocal,
  normaliserRotation,
  OCCUPATION_MAXIMALE,
  remplissage,
  resteDeLaPlace,
  seChevauchent,
  tauxOccupation,
  trouverPlaceLibre,
} from './encombrement'
import { CATALOGUE_DE_TEST, composer, poser } from './fixtures'
import type { Catalogue, Composition, ElementId } from './types'

describe('estDansLeBocal', () => {
  it('accepte un cercle qui touche tout juste le bord, et refuse celui qui dépasse', () => {
    expect(estDansLeBocal({ x: 0, z: 0 }, 0.1, 1)).toBe(true)
    expect(estDansLeBocal({ x: 900, z: 0 }, 0.1, 1)).toBe(true)
    expect(estDansLeBocal({ x: 901, z: 0 }, 0.1, 1)).toBe(false)
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

  it('laisse un feuillage passer au-dessus d’un voisin, mais jamais à travers le verre', () => {
    const elements = {
      ...CATALOGUE_DE_TEST.elements,
      fougere: { ...CATALOGUE_DE_TEST.elements.fougere, rayonEncombrement: 0.1, rayonVisuel: 0.4 },
    }
    const catalogue = { ...CATALOGUE_DE_TEST, elements }
    const avecMousse = composer([poser('mousse', 0, 0)])
    // Les pieds sont à 0,25 l'un de l'autre : le feuillage (0,4) recouvre la mousse, c'est permis.
    expect(emplacementValide(avecMousse, 'fougere', { x: 250, z: 0 }, catalogue)).toBe(true)
    // 0,7 + 0,4 dépasse le sol de rayon 1, alors que le pied seul y tiendrait.
    expect(emplacementValide(avecMousse, 'fougere', { x: 700, z: 0 }, catalogue)).toBe(false)
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

  it('refuse un ajout qui dépasserait la moitié du sol', () => {
    // Chaque améthyste couvre 0,2² = 4 % : 12 font 48 %, une 13e porterait à 52 %.
    const douze = composer(Array.from({ length: 12 }, () => poser('amethyste')))
    expect(resteDeLaPlace(douze, 'mousse', CATALOGUE_DE_TEST)).toBe(true) // 48 % + 1 % = 49 %
    expect(resteDeLaPlace(douze, 'amethyste', CATALOGUE_DE_TEST)).toBe(false)
  })
})

/** Remplit le bocal en déposant l'élément jusqu'à ce qu'il n'y ait plus de place. */
function remplir(elementId: ElementId, catalogue: Catalogue, depart: Composition = composer()): Composition {
  let composition = depart
  const ajouts = []
  for (let i = 0; i < 500; i++) {
    const place = trouverPlaceLibre(composition, elementId, catalogue)
    if (!place) break
    const pose = poser(elementId, place.x, place.z)
    ajouts.push(pose)
    composition = composer([...composition.elements, pose])
  }
  return composer(ajouts)
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

  it('ne propose que des emplacements valides, jusqu’à ce que le bocal soit plein', () => {
    for (const elementId of ['mousse', 'amethyste', 'fougere'] as const) {
      // Catalogue de test : ses rayons ne bougent pas, contrairement à ceux du vrai catalogue.
      const plein = remplir(elementId, CATALOGUE_DE_TEST)
      expect(plein.elements.length).toBeGreaterThan(1)
      // Chaque élément posé est valide au regard de tous les autres.
      for (const pose of plein.elements) {
        expect(emplacementValide(plein, elementId, pose, CATALOGUE_DE_TEST, pose.uid)).toBe(true)
      }
      expect(tauxOccupation(plein, CATALOGUE_DE_TEST)).toBeLessThanOrEqual(OCCUPATION_MAXIMALE)
      expect(trouverPlaceLibre(plein, elementId, CATALOGUE_DE_TEST)).toBeNull()
    }
  })

  it('renvoie des positions entières, en millièmes', () => {
    const place = trouverPlaceLibre(composer([poser('fougere')]), 'galets', CATALOGUE)
    expect(place).not.toBeNull()
    expect(Number.isInteger(place?.x)).toBe(true)
    expect(Number.isInteger(place?.z)).toBe(true)
  })
})

describe('remplissage', () => {
  it('part de zéro et ne vaut 1 que lorsque plus rien ne peut entrer', () => {
    expect(remplissage(composer(), CATALOGUE_DE_TEST)).toBe(0)
    let composition = composer()
    for (const elementId of ['fougere', 'amethyste', 'mousse', 'galets', 'champignons-luminescents'] as const) {
      composition = composer([...composition.elements, ...remplir(elementId, CATALOGUE_DE_TEST, composition).elements])
      expect(remplissage(composition, CATALOGUE_DE_TEST)).toBeLessThanOrEqual(1)
    }
    expect(remplissage(composition, CATALOGUE_DE_TEST)).toBe(1)
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

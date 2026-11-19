import { describe, expect, it } from 'vitest'
import { CATALOGUE } from '../catalogue/catalogue'
import { composer, poser } from './fixtures'
import { lirePanier, resumerBocal, totalPanier } from './panier'

describe('panier', () => {
  const bocal = composer([poser('mousse'), poser('mousse'), poser('fougere')], 'verre-ambre', 'Pour Charlotte')

  it('additionne le prix de chaque bocal', () => {
    const bocaux = [
      { id: 'a', composition: bocal },
      { id: 'b', composition: composer() },
    ]
    expect(totalPanier(bocaux, CATALOGUE)).toBe(6400 + 600 + 600 + 800 + 5400)
  })

  it('résume un bocal par son verre, sa gravure et ses pièces', () => {
    expect(resumerBocal(bocal, CATALOGUE)).toEqual({
      titre: 'Bocal en verre ambré',
      gravure: 'Pour Charlotte',
      pieces: ['Touffe de mousse × 2', 'Petite fougère'],
    })
  })
})

describe('lirePanier', () => {
  it('relit un panier enregistré', () => {
    const enregistre = JSON.parse(JSON.stringify([{ id: 'a', composition: composer([poser('galets', 100, 0)]) }]))
    expect(lirePanier(enregistre, CATALOGUE)).toHaveLength(1)
  })

  it('écarte tout ce qui est abîmé ou inconnu, sans planter', () => {
    const abime = [
      null,
      { id: 'a' },
      { id: 'b', composition: { matiere: 'plastique', elements: [], gravure: null } },
      { id: 'c', composition: { matiere: 'verre-clair', elements: [{ uid: 'x', elementId: 'licorne', x: 0, z: 0, rotation: 0 }] } },
      { id: 'd', composition: { matiere: 'verre-clair', elements: [{ uid: 'y', elementId: 'mousse', x: 0.5, z: 0, rotation: 0 }] } },
      { id: 'e', composition: { matiere: 'verre-clair', elements: [], gravure: '  Pour   Charlotte ' } },
    ]
    const lu = lirePanier(abime, CATALOGUE)
    expect(lu.map((bocal) => bocal.id)).toEqual(['e'])
    expect(lu[0]?.composition.gravure).toBe('Pour Charlotte')
    expect(lirePanier('pas un panier', CATALOGUE)).toEqual([])
  })
})

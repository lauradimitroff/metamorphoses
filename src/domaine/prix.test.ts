import { describe, expect, it } from 'vitest'
import { CATALOGUE } from '../catalogue/catalogue'
import { composer, poser } from './fixtures'
import { calculerTotal, detaillerPrix, formaterPrix } from './prix'

describe('calculerTotal', () => {
  it('compte le chaudron seul à son prix', () => {
    expect(calculerTotal(composer([], 'fonte'), CATALOGUE)).toBe(5400)
    expect(calculerTotal(composer([], 'cuivre'), CATALOGUE)).toBe(6400)
  })

  it('additionne le chaudron et chaque élément posé (l’exemple du cahier des charges : 90 €)', () => {
    const composition = composer([
      poser('mousse'),
      poser('mousse'),
      poser('mousse'),
      poser('fougere'),
      poser('amethyste'),
      poser('champignons-luminescents'),
    ])
    expect(calculerTotal(composition, CATALOGUE)).toBe(9000)
  })
})

describe('detaillerPrix', () => {
  it('commence par le chaudron, puis regroupe les éléments dans l’ordre du catalogue', () => {
    const composition = composer([poser('amethyste'), poser('mousse'), poser('mousse')], 'cuivre')
    expect(detaillerPrix(composition, CATALOGUE)).toEqual([
      { libelle: 'Chaudron en cuivre', quantite: 1, prixUnitaireCentimes: 6400, sousTotalCentimes: 6400 },
      { libelle: 'Touffe de mousse', quantite: 2, prixUnitaireCentimes: 300, sousTotalCentimes: 600 },
      { libelle: 'Améthyste', quantite: 1, prixUnitaireCentimes: 1200, sousTotalCentimes: 1200 },
    ])
  })
})

describe('formaterPrix', () => {
  it('affiche les euros à la française, avec une espace insécable avant le symbole', () => {
    expect(formaterPrix(9000)).toBe('90,00 €')
  })

  it('sépare les milliers par une espace fine insécable', () => {
    expect(formaterPrix(123456)).toBe('1 234,56 €')
  })
})

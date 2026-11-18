import { describe, expect, it } from 'vitest'
import { CATALOGUE } from '../catalogue/catalogue'
import { composer, poser } from './fixtures'
import { calculerTotal, detaillerPrix, formaterPrix } from './prix'

describe('calculerTotal', () => {
  it('compte le bocal seul à son prix', () => {
    expect(calculerTotal(composer([], 'verre-clair'), CATALOGUE)).toBe(5400)
    expect(calculerTotal(composer([], 'verre-ambre'), CATALOGUE)).toBe(6400)
  })

  it('additionne le bocal et chaque élément posé (l’exemple du cahier des charges : 90 €)', () => {
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
  it('commence par le bocal, puis regroupe les éléments dans l’ordre du catalogue', () => {
    const composition = composer([poser('amethyste'), poser('mousse'), poser('mousse')], 'verre-ambre')
    expect(detaillerPrix(composition, CATALOGUE)).toEqual([
      { libelle: 'Bocal en verre ambré', quantite: 1, prixUnitaireCentimes: 6400, sousTotalCentimes: 6400 },
      { libelle: 'Touffe de mousse', quantite: 2, prixUnitaireCentimes: 300, sousTotalCentimes: 600 },
      { libelle: 'Améthyste', quantite: 1, prixUnitaireCentimes: 1200, sousTotalCentimes: 1200 },
    ])
  })
})

describe('gravure personnalisée', () => {
  it('ajoute sa ligne après le bocal et compte dans le total', () => {
    const composition = composer([poser('mousse')], 'verre-clair', 'Pour Charlotte')
    expect(detaillerPrix(composition, CATALOGUE)[1]).toEqual({
      libelle: 'Gravure personnalisée',
      quantite: 1,
      prixUnitaireCentimes: 600,
      sousTotalCentimes: 600,
    })
    expect(calculerTotal(composition, CATALOGUE)).toBe(5400 + 600 + 300)
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

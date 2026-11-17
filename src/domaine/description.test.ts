import { describe, expect, it } from 'vitest'
import { compter, decrireComposition, enumerer, zoneDe } from './description'
import { CATALOGUE_DE_TEST, composer, poser } from './fixtures'

describe('zoneDe', () => {
  it('situe un élément selon le point de vue du visiteur', () => {
    expect(zoneDe(100, 0, 1)).toBe('centre')
    expect(zoneDe(0, 600, 1)).toBe('avant')
    expect(zoneDe(600, 0, 1)).toBe('droite')
    expect(zoneDe(-600, 0, 1)).toBe('gauche')
    expect(zoneDe(0, -600, 1)).toBe('arriere')
    expect(zoneDe(-500, 500, 1)).toBe('avant-gauche')
    expect(zoneDe(500, -500, 1)).toBe('arriere-droit')
  })
})

describe('compter', () => {
  it('accorde l’article au genre et écrit les petits nombres en lettres', () => {
    expect(compter(1, CATALOGUE_DE_TEST.elements.fougere.appellation)).toBe('une fougère')
    expect(compter(1, CATALOGUE_DE_TEST.elements['champignons-luminescents'].appellation)).toBe(
      'un groupe de champignons luminescents',
    )
    expect(compter(3, CATALOGUE_DE_TEST.elements.mousse.appellation)).toBe('trois touffes de mousse')
    expect(compter(12, CATALOGUE_DE_TEST.elements.mousse.appellation)).toBe('12 touffes de mousse')
  })
})

describe('enumerer', () => {
  it('relie les éléments par des virgules et un « et » final', () => {
    expect(enumerer(['a'])).toBe('a')
    expect(enumerer(['a', 'b'])).toBe('a et b')
    expect(enumerer(['a', 'b', 'c'])).toBe('a, b et c')
  })
})

describe('decrireComposition', () => {
  it('signale un bocal vide', () => {
    expect(decrireComposition(composer([], 'verre-ambre'), CATALOGUE_DE_TEST)).toBe('Bocal en verre ambré, encore vide.')
  })

  it('décrit le centre, puis la scène de l’avant vers l’arrière et de gauche à droite', () => {
    const composition = composer([
      poser('amethyste', 0, -600),
      poser('mousse', -500, 500),
      poser('fougere', 0, 0),
      poser('mousse', -520, 480),
      poser('champignons-luminescents', -480, 520),
      poser('mousse', -500, 520),
    ])
    expect(decrireComposition(composition, CATALOGUE_DE_TEST)).toBe(
      'Bocal en verre clair. Au centre, une fougère. ' +
        'À l’avant gauche, trois touffes de mousse et un groupe de champignons luminescents. ' +
        'À l’arrière, une améthyste.',
    )
  })
})

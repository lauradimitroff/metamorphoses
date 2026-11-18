import { beforeEach, describe, expect, it } from 'vitest'
import { COMPOSITION_VIDE, useComposition } from './composition'

const etat = () => useComposition.getState()

describe('état de la composition', () => {
  beforeEach(() => useComposition.setState({ composition: COMPOSITION_VIDE }))

  it('dépose un élément sur une place libre, avec un identifiant propre', () => {
    expect(etat().ajouter('mousse')).toBe(true)
    expect(etat().ajouter('mousse')).toBe(true)
    const [a, b] = etat().composition.elements
    expect(a?.uid).not.toBe(b?.uid)
    expect([a?.x, a?.z]).not.toEqual([b?.x, b?.z])
  })

  it('refuse l’ajout quand il n’y a plus de place, sans changer la composition', () => {
    while (etat().ajouter('fougere'));
    const avant = etat().composition
    expect(etat().ajouter('fougere')).toBe(false)
    expect(etat().composition).toBe(avant)
  })

  it('retire le dernier élément posé de ce type', () => {
    etat().ajouter('mousse')
    etat().ajouter('galets')
    etat().ajouter('mousse')
    const deuxiemeMousse = etat().composition.elements[2]
    etat().retirerUn('mousse')
    expect(etat().composition.elements).toHaveLength(2)
    expect(etat().composition.elements).not.toContain(deuxiemeMousse)
  })

  it('enregistre la gravure nettoyée, et l’efface si le champ est vide', () => {
    etat().graver('  Pour   Charlotte ')
    expect(etat().composition.gravure).toBe('Pour Charlotte')
    etat().graver('   ')
    expect(etat().composition.gravure).toBeNull()
  })
})

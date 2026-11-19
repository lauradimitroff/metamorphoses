import { beforeEach, describe, expect, it } from 'vitest'
import { COMPOSITION_VIDE } from './composition'
import { usePanier } from './panier'

describe('état du panier', () => {
  beforeEach(() => usePanier.setState({ bocaux: [] }))

  it('ajoute chaque bocal avec son propre identifiant, puis retire et vide', () => {
    usePanier.getState().ajouter(COMPOSITION_VIDE)
    usePanier.getState().ajouter(COMPOSITION_VIDE)
    const [a, b] = usePanier.getState().bocaux
    expect(a?.id).not.toBe(b?.id)
    usePanier.getState().retirer(a?.id ?? '')
    expect(usePanier.getState().bocaux).toEqual([b])
    usePanier.getState().vider()
    expect(usePanier.getState().bocaux).toEqual([])
  })
})

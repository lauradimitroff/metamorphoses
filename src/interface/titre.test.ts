import { describe, expect, it } from 'vitest'
import { formaterTitre } from './titre'

describe('formaterTitre', () => {
  it('place le nom de la page avant celui du site', () => {
    expect(formaterTitre('Contact')).toBe('Contact — Métamorphoses')
  })

  it('donne le titre complet de la boutique sans nom de page', () => {
    expect(formaterTitre()).toBe('Métamorphoses — Cabinet de terrariums à composer')
  })

  it('ignore un nom de page vide ou fait d’espaces', () => {
    expect(formaterTitre('   ')).toBe(formaterTitre())
  })
})

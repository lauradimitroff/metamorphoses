import { describe, expect, it } from 'vitest'
import { MESSAGE_MAX, validerContact, type ValeursContact } from './contact'

const valide: ValeursContact = {
  nom: 'Charlotte',
  email: 'charlotte@exemple.fr',
  objet: 'Une composition',
  message: 'Un bocal pour une amie.',
}

describe('validerContact', () => {
  it('accepte un formulaire complet', () => {
    expect(validerContact(valide)).toEqual({})
  })

  it('signale chaque champ vide, sans se contenter d’espaces', () => {
    expect(Object.keys(validerContact({ nom: ' ', email: '', objet: '', message: '  ' }))).toEqual([
      'nom',
      'email',
      'objet',
      'message',
    ])
  })

  it('refuse une adresse mal formée', () => {
    expect(validerContact({ ...valide, email: 'charlotte@exemple' }).email).toContain('Vérifiez')
  })

  it('refuse un objet inconnu', () => {
    expect(validerContact({ ...valide, objet: 'Publicité' }).objet).toBeDefined()
  })

  it('encadre la longueur du message', () => {
    expect(validerContact({ ...valide, message: 'Trop' }).message).toContain('au moins')
    expect(validerContact({ ...valide, message: 'a'.repeat(MESSAGE_MAX + 1) }).message).toContain('Limitez')
  })
})

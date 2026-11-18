export interface ValeursContact {
  nom: string
  email: string
  objet: string
  message: string
}

export type ChampContact = keyof ValeursContact
export type ErreursContact = Partial<Record<ChampContact, string>>

export const OBJETS_CONTACT = [
  'Une composition',
  'Une gravure personnalisée',
  'Le registre d’Hortense',
  'Autre chose',
] as const

export const MESSAGE_MIN = 10
export const MESSAGE_MAX = 1000

/** Une vérification volontairement simple : un texte, une arobase, un domaine avec un point. */
const FORME_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Renvoie un message par champ à corriger. Un objet vide signifie que tout est bon. */
export function validerContact({ nom, email, objet, message }: ValeursContact): ErreursContact {
  const erreurs: ErreursContact = {}
  const longueurMessage = message.trim().length

  if (nom.trim() === '') erreurs.nom = 'Indiquez votre nom.'
  if (email.trim() === '') erreurs.email = 'Indiquez votre adresse électronique.'
  else if (!FORME_EMAIL.test(email.trim())) erreurs.email = 'Vérifiez l’adresse, par exemple charlotte@exemple.fr.'
  if (!(OBJETS_CONTACT as readonly string[]).includes(objet)) erreurs.objet = 'Choisissez un objet.'
  if (longueurMessage === 0) erreurs.message = 'Écrivez votre message.'
  else if (longueurMessage < MESSAGE_MIN) erreurs.message = `Écrivez au moins ${MESSAGE_MIN} caractères.`
  else if (longueurMessage > MESSAGE_MAX) erreurs.message = `Limitez-vous à ${MESSAGE_MAX} caractères.`

  return erreurs
}

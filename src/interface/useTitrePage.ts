import { useEffect } from 'react'
import { formaterTitre } from './titre'

/** Fixe le titre de l'onglet. Sans nom de page, affiche le titre de la boutique. */
export function useTitrePage(titreOnglet?: string) {
  useEffect(() => {
    document.title = formaterTitre(titreOnglet)
  }, [titreOnglet])
}

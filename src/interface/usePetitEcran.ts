import { useSyncExternalStore } from 'react'

/** Même seuil que les feuilles de style : en dessous, l'atelier passe en tiroir. */
const REQUETE = '(max-width: 56rem)'

function abonner(prevenir: () => void) {
  const liste = window.matchMedia(REQUETE)
  liste.addEventListener('change', prevenir)
  return () => liste.removeEventListener('change', prevenir)
}

/** Vrai sur un écran étroit ; se met à jour si la fenêtre change de taille ou si l'appareil pivote. */
export function usePetitEcran() {
  return useSyncExternalStore(abonner, () => window.matchMedia(REQUETE).matches)
}

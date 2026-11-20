import { HDRI, MODELE_FOUGERE, TEXTURES_NOYER } from '../scene/ressources'

/*
 * Sans aide, le navigateur découvre les fichiers de la scène en cascade : la page, puis le code 3D,
 * puis seulement, quand ce code s'exécute, l'HDRI, les textures et la fougère.
 * Ici, on les demande en avance, en parallèle.
 *
 * Le type déclaré doit correspondre à la future requête, sinon le navigateur télécharge deux fois :
 * Three.js lit les textures comme des images, l'HDRI et le modèle avec fetch().
 */
const FICHIERS = [
  { href: HDRI, as: 'fetch' },
  { href: MODELE_FOUGERE, as: 'fetch' },
  ...Object.values(TEXTURES_NOYER).map((href) => ({ href, as: 'image' })),
]

let fichiersDemandes = false
let atelierDemande = false

/** Demande les fichiers de la scène (HDRI, textures, modèle). Sans effet la seconde fois. */
export function prechargerFichiersScene() {
  if (fichiersDemandes) return
  fichiersDemandes = true
  for (const { href, as } of FICHIERS) {
    const lien = document.createElement('link')
    lien.rel = 'preload'
    lien.as = as
    lien.href = href
    lien.crossOrigin = 'anonymous'
    document.head.append(lien)
  }
}

/** Demande tout l'atelier : le code de la page (et, avec lui, celui de la 3D) puis ses fichiers. */
export function prechargerAtelier() {
  if (atelierDemande) return
  atelierDemande = true
  void import('../pages/Composer')
  prechargerFichiersScene()
}

/** Dès que le visiteur montre l'intention d'aller composer (survol, focus, toucher d'un lien). */
export function surveillerIntentionDeComposer() {
  const surIntention = (evenement: Event) => {
    if (evenement.target instanceof Element && evenement.target.closest('a[href="/composer"]')) prechargerAtelier()
  }
  for (const type of ['pointerover', 'focusin', 'touchstart']) {
    document.addEventListener(type, surIntention, { passive: true })
  }
}

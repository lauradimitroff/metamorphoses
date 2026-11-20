/**
 * Les fichiers de la scène, en un seul endroit : la scène les charge,
 * et le préchargement (src/interface/prechargement.ts) les demande en avance.
 * Ce module ne dépend pas de Three.js : l'importer ne grossit pas le code principal.
 */
export const HDRI = '/hdri/workshop.jpg'
export const MODELE_FOUGERE = '/models/fougere.glb'
export const TEXTURES_NOYER = {
  map: '/textures/noyer/couleur.webp',
  normalMap: '/textures/noyer/normale.webp',
  roughnessMap: '/textures/noyer/rugosite.webp',
}

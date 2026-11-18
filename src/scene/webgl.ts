/** Le navigateur sait-il créer un contexte WebGL 2 ? Sans lui, aucune scène 3D ne peut s'afficher. */
export function webglDisponible(): boolean {
  try {
    return document.createElement('canvas').getContext('webgl2') !== null
  } catch {
    return false
  }
}

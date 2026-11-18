/*
 * Hasard reproductible : avec la même graine, on obtient toujours les mêmes formes.
 * La scène est donc identique à chaque chargement, et aucune géométrie n'est téléchargée.
 */

export function generateur(graine: number): () => number {
  let etat = graine
  return () => {
    etat = (etat * 16807) % 2147483647
    return etat / 2147483647
  }
}

/** Valeur pseudo-aléatoire entre 0 et 1, toujours la même pour un point de la grille. */
function valeurGrille(x: number, y: number, z: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453
  return s - Math.floor(s)
}

const lisser = (t: number) => t * t * (3 - 2 * t)
const melanger = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * Bruit de valeur en 3D, entre 0 et 1 : un hasard « doux », où deux points voisins
 * ont des valeurs proches. C'est lui qui donne aux formes leur irrégularité naturelle.
 */
export function bruit3(x: number, y: number, z: number): number {
  const [ix, iy, iz] = [Math.floor(x), Math.floor(y), Math.floor(z)]
  const [u, v, w] = [lisser(x - ix), lisser(y - iy), lisser(z - iz)]
  const coin = (dx: number, dy: number, dz: number) => valeurGrille(ix + dx, iy + dy, iz + dz)
  return melanger(
    melanger(melanger(coin(0, 0, 0), coin(1, 0, 0), u), melanger(coin(0, 1, 0), coin(1, 1, 0), u), v),
    melanger(melanger(coin(0, 0, 1), coin(1, 0, 1), u), melanger(coin(0, 1, 1), coin(1, 1, 1), u), v),
    w,
  )
}

/** Plusieurs couches de bruit, de plus en plus fines : grandes bosses et petits détails. */
export function bruitFractal(x: number, y: number, z: number, couches = 3): number {
  let somme = 0
  let amplitude = 0.5
  let frequence = 1
  let total = 0
  for (let i = 0; i < couches; i++) {
    somme += amplitude * bruit3(x * frequence, y * frequence, z * frequence)
    total += amplitude
    amplitude /= 2
    frequence *= 2
  }
  return somme / total
}

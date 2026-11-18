import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  ConeGeometry,
  CylinderGeometry,
  IcosahedronGeometry,
  RingGeometry,
  SphereGeometry,
} from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { bruitFractal, generateur } from './hasard'

/*
 * Les formes générées dans le code. Chacune est calculée une seule fois, à la première
 * demande, puis partagée : dix mousses utilisent la même géométrie en mémoire.
 * Les couleurs sont portées par les sommets : un seul matériau, sans texture à télécharger.
 */

const ANGLE_D_OR = Math.PI * (3 - Math.sqrt(5))

function unique<T>(creer: () => T): () => T {
  let valeur: T | undefined
  return () => (valeur ??= creer())
}

/** Colore chaque sommet selon sa position. `cible` évite de recréer une couleur à chaque appel. */
function colorer(geometrie: BufferGeometry, teinte: (x: number, y: number, z: number, cible: Color) => void) {
  const positions = geometrie.getAttribute('position')
  const couleurs = new Float32Array(positions.count * 3)
  const couleur = new Color()
  for (let i = 0; i < positions.count; i++) {
    teinte(positions.getX(i), positions.getY(i), positions.getZ(i), couleur)
    couleurs.set([couleur.r, couleur.g, couleur.b], i * 3)
  }
  geometrie.setAttribute('color', new BufferAttribute(couleurs, 3))
}

/** Déforme une sphère : chaque point s'éloigne ou se rapproche du centre selon le bruit. */
function bosseler(geometrie: BufferGeometry, force: number, frequence: number, decalage: number) {
  const positions = geometrie.getAttribute('position')
  for (let i = 0; i < positions.count; i++) {
    const [x, y, z] = [positions.getX(i), positions.getY(i), positions.getZ(i)]
    const n = bruitFractal(x * frequence + decalage, y * frequence + decalage, z * frequence + decalage)
    const facteur = 1 + (n - 0.5) * force
    positions.setXYZ(i, x * facteur, y * facteur, z * facteur)
  }
  geometrie.computeVertexNormals()
}

const MOUSSE_SOMBRE = new Color('#25401f')
const MOUSSE_CLAIRE = new Color('#7f9b4a')

/** Un coussin de mousse : un dôme couvert de dizaines de petites touffes. */
export const geometrieMousse = unique(() => {
  const hasard = generateur(7)
  const morceaux: BufferGeometry[] = []
  const socle = new SphereGeometry(0.112, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2)
  socle.scale(1, 0.48, 1)
  morceaux.push(socle)

  const nombre = 64
  for (let i = 0; i < nombre; i++) {
    const distance = Math.sqrt((i + 0.5) / nombre) * 0.108
    const angle = i * ANGLE_D_OR
    const hauteur = 0.054 * Math.sqrt(Math.max(0, 1 - (distance / 0.118) ** 2))
    const rayon = 0.015 + hasard() * 0.014
    const touffe = new SphereGeometry(1, 9, 7)
    bosseler(touffe, 0.7, 2.4, i * 3.1)
    touffe.scale(rayon, rayon * (0.75 + hasard() * 0.5), rayon)
    touffe.translate(Math.cos(angle) * distance, hauteur, Math.sin(angle) * distance)
    morceaux.push(touffe)
  }

  const mousse = mergeGeometries(morceaux)
  colorer(mousse, (x, y, z, cible) => {
    const taches = bruitFractal(x * 34 + 4, y * 34, z * 34)
    cible.copy(MOUSSE_SOMBRE).lerp(MOUSSE_CLAIRE, Math.min(1, y / 0.075) * 0.55 + taches * 0.45)
  })
  return mousse
})

/** Trois pierres polies par l'eau, aplaties et jamais tout à fait rondes. */
export const geometrieGalets = unique(() => {
  const pierres = [
    { x: -0.035, z: 0.02, a: 0.066, b: 0.033, c: 0.05, angle: 0.4, teinte: '#747b7f' },
    { x: 0.052, z: 0.03, a: 0.046, b: 0.027, c: 0.038, angle: 1.7, teinte: '#9a958a' },
    { x: 0.012, z: -0.05, a: 0.05, b: 0.029, c: 0.036, angle: 2.6, teinte: '#565e65' },
  ]
  const blanc = new Color('#c9c6bc')
  const morceaux = pierres.map(({ x, z, a, b, c, angle, teinte }, i) => {
    const pierre = new SphereGeometry(1, 28, 18)
    bosseler(pierre, 0.28, 1.15, 11 + i * 5)
    const base = new Color(teinte)
    // Veines et mouchetures, calculées avant la mise à l'échelle.
    colorer(pierre, (px, py, pz, cible) => {
      const veine = bruitFractal(px * 2.2 + i, py * 7, pz * 2.2)
      cible.copy(base).multiplyScalar(0.72 + veine * 0.55).lerp(blanc, veine > 0.68 ? 0.28 : 0)
    })
    pierre.scale(a, b, c)
    pierre.rotateY(angle)
    pierre.translate(x, b * 0.82, z)
    pierre.computeVertexNormals()
    return pierre
  })
  return mergeGeometries(morceaux)
})

const AMETHYSTE_FOND = new Color('#2d1259')
const AMETHYSTE_POINTE = new Color('#c9a5f2')

/** Une pointe de cristal : un prisme à six pans, terminé par une pyramide. */
function pointe(rayon: number, hauteur: number): BufferGeometry {
  const hauteurPointe = rayon * 1.7
  const prisme = new CylinderGeometry(rayon, rayon * 0.82, hauteur, 6, 1, true).toNonIndexed()
  prisme.translate(0, hauteur / 2, 0)
  const sommet = new ConeGeometry(rayon, hauteurPointe, 6, 1, true).toNonIndexed()
  sommet.translate(0, hauteur + hauteurPointe / 2, 0)
  return mergeGeometries([prisme, sommet])
}

/** Un groupe de cristaux violets sur sa gangue de pierre. Les faces restent nettes. */
export const geometrieAmethyste = unique(() => {
  const cristaux = [
    { x: 0, z: 0, rayon: 0.043, hauteur: 0.2, penteX: 0.04, penteZ: -0.05 },
    { x: 0.05, z: 0.022, rayon: 0.029, hauteur: 0.125, penteX: 0.12, penteZ: -0.34 },
    { x: -0.046, z: 0.03, rayon: 0.031, hauteur: 0.14, penteX: 0.2, penteZ: 0.32 },
    { x: -0.012, z: -0.054, rayon: 0.025, hauteur: 0.105, penteX: -0.38, penteZ: 0.08 },
    { x: 0.036, z: -0.04, rayon: 0.019, hauteur: 0.075, penteX: -0.3, penteZ: -0.34 },
    { x: 0.012, z: 0.06, rayon: 0.018, hauteur: 0.07, penteX: 0.42, penteZ: -0.06 },
  ]
  const hauteurMax = 0.28
  const morceaux = cristaux.map(({ x, z, rayon, hauteur, penteX, penteZ }, i) => {
    const cristal = pointe(rayon, hauteur)
    cristal.rotateY(i * 1.1)
    cristal.rotateX(penteX)
    cristal.rotateZ(penteZ)
    cristal.translate(x, 0.012, z)
    colorer(cristal, (_, y, __, cible) => {
      cible.copy(AMETHYSTE_FOND).lerp(AMETHYSTE_POINTE, Math.min(1, y / hauteurMax) ** 0.85)
    })
    return cristal
  })

  const gangue = new IcosahedronGeometry(1, 2)
  bosseler(gangue, 0.42, 1.5, 3)
  gangue.scale(0.098, 0.04, 0.092)
  gangue.translate(0, 0.012, 0)
  const pierre = new Color('#3a3540')
  colorer(gangue, (_, __, ___, cible) => {
    cible.copy(pierre)
  })

  const amethyste = mergeGeometries([...morceaux, gangue])
  amethyste.computeVertexNormals()
  return amethyste
})

const TERRE_SOMBRE = new Color('#150e09')
const TERRE_CLAIRE = new Color('#4a3424')

/** La surface de la terre : un disque à peine vallonné, moucheté de grains plus clairs. */
export function creerSol(rayon: number): BufferGeometry {
  const sol = new RingGeometry(0.001, rayon, 128, 36).rotateX(-Math.PI / 2)
  const positions = sol.getAttribute('position')
  for (let i = 0; i < positions.count; i++) {
    const [x, z] = [positions.getX(i), positions.getZ(i)]
    positions.setY(i, (bruitFractal(x * 7 + 2, 0, z * 7 + 2) - 0.5) * 0.018)
  }
  sol.computeVertexNormals()
  colorer(sol, (x, _, z, cible) => {
    const large = bruitFractal(x * 8, 1, z * 8)
    const grain = bruitFractal(x * 70, 3, z * 70, 2)
    cible.copy(TERRE_SOMBRE).lerp(TERRE_CLAIRE, 0.12 + large * 0.22 + grain * 0.34)
  })
  return sol
}

/**
 * Une tache de lumière sur fond noir, pour un mélange additif : le noir n'ajoute rien.
 * Sans canal de transparence, elle est dessinée avec les objets opaques, et reste
 * donc visible à travers le verre, contrairement aux objets transparents.
 */
export const textureLueurAuSol = unique(() => {
  const taille = 128
  const canevas = document.createElement('canvas')
  canevas.width = taille
  canevas.height = taille
  const contexte = canevas.getContext('2d')
  if (contexte) {
    const milieu = taille / 2
    const degrade = contexte.createRadialGradient(milieu, milieu, 0, milieu, milieu, milieu)
    degrade.addColorStop(0, '#ffffff')
    degrade.addColorStop(0.35, '#555555')
    degrade.addColorStop(1, '#000000')
    contexte.fillStyle = degrade
    contexte.fillRect(0, 0, taille, taille)
  }
  return new CanvasTexture(canevas)
})

/** Un disque flou, blanc au centre : la forme des lucioles. */
export const textureHalo = unique(() => {
  const taille = 128
  const canevas = document.createElement('canvas')
  canevas.width = taille
  canevas.height = taille
  const contexte = canevas.getContext('2d')
  if (contexte) {
    const milieu = taille / 2
    const degrade = contexte.createRadialGradient(milieu, milieu, 0, milieu, milieu, milieu)
    degrade.addColorStop(0, 'rgba(255,255,255,1)')
    degrade.addColorStop(0.25, 'rgba(255,255,255,0.6)')
    degrade.addColorStop(1, 'rgba(255,255,255,0)')
    contexte.fillStyle = degrade
    contexte.fillRect(0, 0, taille, taille)
  }
  return new CanvasTexture(canevas)
})

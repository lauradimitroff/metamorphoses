import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import {
  Color,
  IcosahedronGeometry,
  MathUtils,
  Matrix4,
  Quaternion,
  SplineCurve,
  Vector2,
  Vector3,
  type Group,
  type InstancedMesh,
} from 'three'
import { BOCAL } from '../catalogue/catalogue'
import type { MatiereId } from '../domaine/types'
import { creerSol } from './generateurs/formes'
import { generateur } from './generateurs/hasard'
import { Gravure } from './Gravure'

/*
 * Le bocal d'apothicaire : une paroi de verre tournée (comme sur un tour de potier),
 * deux couches de substrat visibles à travers le verre, la devise gravée à l'acide
 * sur le haut de la panse, et un couvercle en laiton.
 */

/** Tourne une demi-coupe (rayon, hauteur) lissée par une spline. */
function profilLisse(points: ReadonlyArray<readonly [number, number]>, finesse: number): Vector2[] {
  return new SplineCurve(points.map(([rayon, hauteur]) => new Vector2(rayon, hauteur))).getPoints(finesse)
}

/**
 * Paroi du bocal : on monte par l'extérieur jusqu'à la lèvre, puis on redescend par
 * l'intérieur. Le verre a ainsi une vraie épaisseur.
 */
const PROFIL_VERRE = profilLisse(
  [
    // Extérieur : fond, panse haute et droite, épaule arrondie, col resserré, lèvre évasée
    [0, 0], [0.52, 0], [0.585, 0.01], [0.615, 0.04], [0.625, 0.1], [0.625, 1.22], [0.615, 1.32],
    [0.58, 1.4], [0.52, 1.46], [0.48, 1.49], [0.47, 1.53], [0.47, 1.6], [0.49, 1.62], [0.5, 1.645],
    [0.48, 1.655],
    // Intérieur, de la lèvre vers le fond (le fond de verre est épais, comme sur les bocaux anciens)
    [0.457, 1.645], [0.457, 1.53], [0.467, 1.49], [0.507, 1.455], [0.567, 1.395], [0.602, 1.32],
    [0.612, 1.22], [0.612, 0.1], [0.605, 0.075], [0.56, 0.06], [0, 0.06],
  ],
  260,
)

/** Le couvercle, posé sur la lèvre : un dôme et une jupe qui l'emboîte. */
const PROFIL_COUVERCLE = profilLisse(
  [
    [0, 0.13], [0.15, 0.125], [0.33, 0.105], [0.48, 0.07], [0.507, 0.06], [0.507, 0], [0.497, 0],
    [0.497, 0.055], [0.33, 0.09], [0, 0.1],
  ],
  90,
)

/** Le fleuron qui couronne le couvercle : un petit bouton tourné. */
const PROFIL_FLEURON = profilLisse(
  [[0, 0.12], [0.04, 0.125], [0.03, 0.16], [0.052, 0.2], [0.046, 0.235], [0.02, 0.252], [0, 0.258]],
  48,
)

/** Hauteur où le couvercle repose sur le bocal. */
const HAUTEUR_COUVERCLE = 1.635

/** Rayon intérieur de la panse : le substrat le touche, pour qu'on le voie à travers le verre. */
const RAYON_INTERIEUR = 0.609
const FOND_INTERIEUR = 0.06
const HAUT_DU_DRAINAGE = 0.15
/**
 * Le bloc de terre s'arrête sous les creux du sol vallonné. À la même hauteur, les deux
 * surfaces se disputeraient l'affichage, et des taches à bords nets apparaîtraient.
 */
const HAUT_DE_LA_TERRE = BOCAL.hauteurSol - 0.012

const VERRES: Record<MatiereId, { color: string; attenuationColor: string; attenuationDistance: number }> = {
  // Un verre à peine verdi, comme le verre ancien.
  'verre-clair': { color: '#f4f8f4', attenuationColor: '#eef6ee', attenuationDistance: 6 },
  // Le verre ambré des flacons d'apothicaire : la teinte s'intensifie avec l'épaisseur traversée.
  'verre-ambre': { color: '#e3a35a', attenuationColor: '#b8702a', attenuationDistance: 0.8 },
}

const LAITON = { color: '#b89b5e', metalness: 1, roughness: 0.32 } as const

/** Rayon extérieur de la panse droite (de 0,1 à 1,22 de hauteur). */
export const RAYON_PANSE = 0.625

/** À la manière des inscriptions latines anciennes, le U s'écrit V. */
const DEVISE = 'VVLNERANT OMNES · VLTIMA NECAT'
/** Sur le haut de la panse, juste sous l'épaule. */
const HAUTEUR_DEVISE = 1.13

/** Le couvercle ouvert repose sur la table, à gauche du bocal. */
const POSE_OUVERTE = { x: -1.1, y: 0, z: 0.4 }
const DUREE_OUVERTURE = 0.9 // secondes

const reduireAnimations = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const NOMBRE_DE_GRAVIERS = 300

/**
 * Les graviers de drainage, plaqués contre le verre. Une seule géométrie, répétée
 * 300 fois par la carte graphique (instanciation) : un seul appel de dessin.
 */
function Graviers() {
  const maillage = useRef<InstancedMesh>(null)
  const geometrie = useMemo(() => new IcosahedronGeometry(1, 1), [])

  useLayoutEffect(() => {
    const instances = maillage.current
    if (!instances) return
    const hasard = generateur(19)
    const matrice = new Matrix4()
    const rotation = new Quaternion()
    const couleur = new Color()
    for (let i = 0; i < NOMBRE_DE_GRAVIERS; i++) {
      const angle = hasard() * Math.PI * 2
      const rayon = RAYON_INTERIEUR - 0.012 - hasard() * 0.012
      const hauteur = FOND_INTERIEUR + 0.012 + hasard() * (HAUT_DU_DRAINAGE - FOND_INTERIEUR - 0.012)
      const taille = 0.012 + hasard() * 0.012
      rotation.setFromAxisAngle(new Vector3(hasard(), hasard(), hasard()).normalize(), hasard() * Math.PI)
      matrice.compose(
        new Vector3(Math.cos(angle) * rayon, hauteur, Math.sin(angle) * rayon),
        rotation,
        new Vector3(taille, taille * (0.7 + hasard() * 0.3), taille * (0.8 + hasard() * 0.3)),
      )
      instances.setMatrixAt(i, matrice)
      const gris = 0.035 + hasard() * 0.13
      instances.setColorAt(i, couleur.setRGB(gris, gris * 1.01, gris * (1 + hasard() * 0.08)))
    }
    instances.instanceMatrix.needsUpdate = true
    if (instances.instanceColor) instances.instanceColor.needsUpdate = true
  }, [])

  return (
    <instancedMesh ref={maillage} args={[geometrie, undefined, NOMBRE_DE_GRAVIERS]} receiveShadow>
      <meshStandardMaterial roughness={0.72} />
    </instancedMesh>
  )
}

function Couvercle({ ouvert }: { ouvert: boolean }) {
  const groupe = useRef<Group>(null)
  const avancement = useRef(ouvert ? 1 : 0)

  // Le couvercle suit un arc : il se soulève, glisse sur le côté, puis se pose sur la table.
  useFrame((_, delta) => {
    const cible = ouvert ? 1 : 0
    const pas = reduireAnimations ? 1 : Math.min(delta, 0.1) / DUREE_OUVERTURE
    avancement.current = cible > avancement.current
      ? Math.min(cible, avancement.current + pas)
      : Math.max(cible, avancement.current - pas)
    const t = avancement.current
    const doux = t * t * (3 - 2 * t)
    if (!groupe.current) return
    groupe.current.position.set(
      MathUtils.lerp(0, POSE_OUVERTE.x, doux),
      MathUtils.lerp(HAUTEUR_COUVERCLE, POSE_OUVERTE.y, doux) + Math.sin(Math.PI * doux) * 0.45,
      MathUtils.lerp(0, POSE_OUVERTE.z, doux),
    )
  })

  return (
    <group ref={groupe} position={ouvert ? [POSE_OUVERTE.x, POSE_OUVERTE.y, POSE_OUVERTE.z] : [0, HAUTEUR_COUVERCLE, 0]}>
      {/* Il ne reçoit pas d'ombre : son dôme, presque plat, s'ombrerait lui-même par taches. */}
      <mesh castShadow>
        <latheGeometry args={[PROFIL_COUVERCLE, 128]} />
        <meshStandardMaterial {...LAITON} />
      </mesh>
      <mesh castShadow>
        <latheGeometry args={[PROFIL_FLEURON, 64]} />
        <meshStandardMaterial {...LAITON} />
      </mesh>
    </group>
  )
}

export function Bocal({ matiere, couvercleOuvert = false }: { matiere: MatiereId; couvercleOuvert?: boolean }) {
  const sol = useMemo(() => creerSol(RAYON_INTERIEUR), [])

  return (
    <group>
      {/*
        Le verre « transmet » la lumière : Three.js dessine d'abord ce qui est derrière,
        puis le voit à travers la paroi, légèrement déformé (réfraction). Le verre ne
        projette pas d'ombre : sinon, l'intérieur du bocal serait plongé dans le noir.
      */}
      <mesh>
        <latheGeometry args={[PROFIL_VERRE, 128]} />
        <meshPhysicalMaterial
          {...VERRES[matiere]}
          transmission={1}
          thickness={0.03}
          roughness={0.04}
          ior={1.5}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Couche de drainage : petits graviers gris, au fond */}
      <mesh position={[0, (FOND_INTERIEUR + HAUT_DU_DRAINAGE) / 2, 0]} receiveShadow>
        <cylinderGeometry args={[RAYON_INTERIEUR, RAYON_INTERIEUR, HAUT_DU_DRAINAGE - FOND_INTERIEUR, 96]} />
        <meshStandardMaterial color="#26292d" roughness={0.95} />
      </mesh>
      <Graviers />
      {/* Terre, jusqu'à la hauteur du sol */}
      <mesh position={[0, (HAUT_DU_DRAINAGE + HAUT_DE_LA_TERRE) / 2, 0]} receiveShadow>
        <cylinderGeometry args={[RAYON_INTERIEUR, RAYON_INTERIEUR, HAUT_DE_LA_TERRE - HAUT_DU_DRAINAGE, 96]} />
        <meshStandardMaterial color="#21170f" roughness={1} />
      </mesh>
      <mesh geometry={sol} position={[0, BOCAL.hauteurSol, 0]} receiveShadow>
        <meshStandardMaterial vertexColors roughness={1} />
      </mesh>

      <Gravure texte={DEVISE} rayon={RAYON_PANSE} hauteur={HAUTEUR_DEVISE} taille={0.042} />

      <Couvercle ouvert={couvercleOuvert} />
    </group>
  )
}

import { SplineCurve, Vector2 } from 'three'
import type { Matiere } from './types'

/**
 * Profil du chaudron : une demi-coupe (rayon, hauteur) qu'on fait tourner
 * autour de l'axe vertical, comme une pièce sur un tour de potier.
 * On monte par l'extérieur jusqu'au bord, puis on redescend par l'intérieur :
 * la paroi a ainsi une vraie épaisseur, visible sur la lèvre.
 */
const POINTS_DE_CONTROLE = [
  // Extérieur, du fond vers le bord
  [0, 0.02], [0.2, 0.015], [0.38, 0.03], [0.54, 0.09], [0.66, 0.22],
  [0.715, 0.38], [0.71, 0.52], [0.67, 0.64], [0.63, 0.72], [0.625, 0.78],
  [0.65, 0.82], [0.685, 0.845], [0.69, 0.865], [0.67, 0.88], [0.64, 0.875],
  // Intérieur, du bord vers le fond
  [0.615, 0.84], [0.6, 0.78], [0.61, 0.72], [0.645, 0.64], [0.68, 0.52],
  [0.685, 0.38], [0.63, 0.23], [0.51, 0.11], [0.36, 0.06], [0.2, 0.05], [0, 0.05],
].map(([rayon, hauteur]) => new Vector2(rayon, hauteur))

/**
 * Une courbe lisse (spline) passe par ces points de contrôle : on y prélève
 * 160 points. Sans elle, on verrait des cassures sur la silhouette.
 */
const PROFIL = new SplineCurve(POINTS_DE_CONTROLE).getPoints(160)

/** Hauteur du sol dans le repère du chaudron : assez haut pour que les plantes dépassent du bord. */
export const HAUTEUR_SOL = 0.76
/** Le chaudron est surélevé par ses pieds. */
export const ELEVATION = 0.04

const RENDUS: Record<Matiere, { color: string; metalness: number; roughness: number }> = {
  // Fonte : sombre, peu réfléchissante, rugueuse.
  fonte: { color: '#2a2a2d', metalness: 0.75, roughness: 0.62 },
  // Cuivre : la couleur d'un métal vient de ses reflets, d'où metalness à 1.
  cuivre: { color: '#c07a52', metalness: 1, roughness: 0.3 },
}

const PIEDS = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle) => [
  Math.cos(angle) * 0.3,
  Math.sin(angle) * 0.3,
] as const)

export function Chaudron({ matiere }: { matiere: Matiere }) {
  const rendu = RENDUS[matiere]
  const materiau = <meshStandardMaterial {...rendu} />

  return (
    <group position={[0, ELEVATION, 0]}>
      <mesh castShadow receiveShadow>
        <latheGeometry args={[PROFIL, 128]} />
        {materiau}
      </mesh>

      {PIEDS.map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, -0.005, z]} castShadow>
          <cylinderGeometry args={[0.045, 0.028, 0.07, 24]} />
          {materiau}
        </mesh>
      ))}

      {/* Deux oreilles de part et d'autre, à moitié prises dans la paroi */}
      {[-1, 1].map((cote) => (
        <mesh key={cote} position={[cote * 0.672, 0.83, 0]} castShadow>
          <torusGeometry args={[0.055, 0.014, 16, 48]} />
          {materiau}
        </mesh>
      ))}

      {/* Le sol du terrarium */}
      <mesh position={[0, HAUTEUR_SOL, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.605, 96]} />
        <meshStandardMaterial color="#2a1e16" roughness={1} />
      </mesh>
    </group>
  )
}

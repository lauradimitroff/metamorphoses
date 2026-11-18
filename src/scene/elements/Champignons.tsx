import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { AdditiveBlending, Color, type MeshBasicMaterial, type MeshStandardMaterial } from 'three'
import { useAmbiance } from '../ambiance'
import { textureLueurAuSol } from '../generateurs/formes'

/** Chaque champignon : position relative, taille, inclinaison. */
const GROUPE = [
  { x: 0, z: 0, taille: 1, inclinaison: 0.08 },
  { x: 0.075, z: 0.04, taille: 0.7, inclinaison: -0.2 },
  { x: -0.05, z: 0.065, taille: 0.55, inclinaison: 0.25 },
] as const

/*
 * Un vert plus saturé que la couleur « lueur » de la palette : à forte intensité, le rendu
 * final pâlit les couleurs, et c'est ainsi que le halo perçu retrouve la teinte voulue.
 */
const VERT_LUEUR = '#25d68f'
const LUEUR_MAX = 3.4
const LUEUR_AU_SOL = 0.32
const COULEUR_LUEUR = new Color(VERT_LUEUR)

export function Champignons() {
  const ambiance = useAmbiance()
  // Une ref par chapeau : on anime leur lueur à chaque image, hors du cycle de rendu React.
  const chapeaux = useRef<Array<MeshStandardMaterial | null>>([])
  const auSol = useRef<MeshBasicMaterial>(null)

  useFrame(({ clock }) => {
    const { nuit } = ambiance.current
    // Une respiration lente, pour que la lueur paraisse vivante.
    const souffle = 0.85 + 0.15 * Math.sin(clock.elapsedTime * 1.3)
    for (const chapeau of chapeaux.current) {
      if (chapeau) chapeau.emissiveIntensity = LUEUR_MAX * nuit * souffle
    }
    auSol.current?.color.copy(COULEUR_LUEUR).multiplyScalar(LUEUR_AU_SOL * nuit * souffle)
  })

  return (
    <group scale={1.5}>
      {GROUPE.map(({ x, z, taille, inclinaison }, index) => (
        <group key={`${x}-${z}`} position={[x, 0, z]} rotation={[inclinaison, 0, inclinaison / 2]} scale={taille}>
          {/* Pied légèrement évasé */}
          <mesh position={[0, 0.06, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.018, 0.12, 16]} />
            <meshStandardMaterial color="#d9d3bf" roughness={0.7} />
          </mesh>
          {/* Chapeau : une demi-sphère aplatie */}
          <mesh position={[0, 0.118, 0]} scale={[1, 0.6, 1]} castShadow>
            <sphereGeometry args={[0.05, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              ref={(materiau) => {
                chapeaux.current[index] = materiau
              }}
              color="#bfc8b4"
              roughness={0.5}
              emissive={VERT_LUEUR}
              emissiveIntensity={0}
            />
          </mesh>
        </group>
      ))}
      {/*
        La lueur sur la terre est un disque flou, et non une vraie lumière : chaque lumière
        ajoutée alourdit tous les matériaux, et un visiteur peut poser beaucoup de champignons.
      */}
      <mesh position={[0.005, 0.012, 0.03]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
        <planeGeometry args={[0.36, 0.36]} />
        <meshBasicMaterial
          ref={auSol}
          map={textureLueurAuSol()}
          color="#000000"
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

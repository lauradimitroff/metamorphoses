import { useFrame } from '@react-three/fiber'
import { useRef, type RefObject } from 'react'
import type { MeshStandardMaterial, PointLight } from 'three'
import type { Ambiance } from './types'

/** Chaque champignon : position relative, taille, inclinaison. */
const GROUPE = [
  { x: 0, z: 0, taille: 1, inclinaison: 0.08 },
  { x: 0.075, z: 0.04, taille: 0.7, inclinaison: -0.2 },
  { x: -0.05, z: 0.065, taille: 0.55, inclinaison: 0.25 },
] as const

const LUEUR_MAX = 3.5

export function Champignons({
  ambiance,
  position,
}: {
  ambiance: RefObject<Ambiance>
  position: readonly [number, number, number]
}) {
  // Une ref par chapeau : on anime leur lueur à chaque image, hors du cycle de rendu React.
  const chapeaux = useRef<Array<MeshStandardMaterial | null>>([])
  const halo = useRef<PointLight>(null)

  useFrame(({ clock }) => {
    const { nuit } = ambiance.current
    // Une respiration lente, pour que la lueur paraisse vivante.
    const souffle = 0.85 + 0.15 * Math.sin(clock.elapsedTime * 1.3)
    for (const chapeau of chapeaux.current) {
      if (chapeau) chapeau.emissiveIntensity = LUEUR_MAX * nuit * souffle
    }
    if (halo.current) halo.current.intensity = 0.35 * nuit * souffle
  })

  return (
    <group position={position} scale={1.4}>
      {GROUPE.map(({ x, z, taille, inclinaison }, index) => (
        <group key={`${x}-${z}`} position={[x, 0, z]} rotation={[inclinaison, 0, inclinaison / 2]} scale={taille}>
          {/* Pied légèrement évasé */}
          <mesh position={[0, 0.06, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.018, 0.12, 16]} />
            <meshStandardMaterial color="#e6dcc4" roughness={0.7} />
          </mesh>
          {/* Chapeau : une demi-sphère aplatie */}
          <mesh position={[0, 0.118, 0]} scale={[1, 0.6, 1]} castShadow>
            <sphereGeometry args={[0.05, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              ref={(materiau) => {
                chapeaux.current[index] = materiau
              }}
              color="#d8d2bd"
              roughness={0.5}
              emissive="#9fe3c9"
              emissiveIntensity={0}
            />
          </mesh>
        </group>
      ))}
      {/* Une petite lumière verte au ras du sol : la lueur éclaire ce qui l'entoure */}
      <pointLight ref={halo} position={[0, 0.12, 0.03]} color="#9fe3c9" intensity={0} distance={0.8} decay={2} />
    </group>
  )
}

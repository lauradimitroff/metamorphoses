import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Mesh, PointLight } from 'three'
import { useAmbiance } from './ambiance'

const POSITION = [1.05, 0, -0.35] as const
const HAUTEUR_CIRE = 0.3
const INTENSITE_MAX = 4

/**
 * Vacillement de la flamme : trois sinusoïdes de fréquences sans rapport simple.
 * Leur somme ne se répète jamais vraiment, ce qui imite un mouvement naturel.
 */
function vacillement(temps: number): number {
  return 1 + 0.06 * Math.sin(temps * 13) + 0.04 * Math.sin(temps * 23.7 + 1) + 0.03 * Math.sin(temps * 7.3 + 2)
}

export function Bougie() {
  const ambiance = useAmbiance()
  const lumiere = useRef<PointLight>(null)
  const flamme = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    const { nuit } = ambiance.current
    const v = vacillement(clock.elapsedTime)
    if (lumiere.current) lumiere.current.intensity = INTENSITE_MAX * nuit * v
    if (flamme.current) {
      flamme.current.visible = nuit > 0.02
      flamme.current.scale.set(0.022 * nuit, 0.06 * nuit * v, 0.022 * nuit)
    }
  })

  const hauteurFlamme = 0.025 + HAUTEUR_CIRE + 0.07

  return (
    <group position={POSITION}>
      {/* Coupelle en laiton */}
      <mesh position={[0, 0.0125, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.13, 0.025, 64]} />
        <meshStandardMaterial color="#b89b5e" metalness={1} roughness={0.35} />
      </mesh>
      {/* Cire */}
      <mesh position={[0, 0.025 + HAUTEUR_CIRE / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.052, 0.055, HAUTEUR_CIRE, 48]} />
        <meshStandardMaterial color="#e9dfc8" roughness={0.55} />
      </mesh>
      {/* Mèche */}
      <mesh position={[0, 0.025 + HAUTEUR_CIRE + 0.015, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.03, 8]} />
        <meshStandardMaterial color="#1a1410" roughness={1} />
      </mesh>
      {/* Flamme : un matériau sans éclairage, plus lumineux que 1 pour déclencher le halo */}
      <mesh ref={flamme} position={[0, hauteurFlamme - 0.02, 0]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshBasicMaterial color={[4, 2.1, 0.8]} toneMapped={false} />
      </mesh>
      <pointLight
        ref={lumiere}
        position={[0, hauteurFlamme, 0]}
        color="#ffb36b"
        intensity={0}
        decay={2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.002}
      />
    </group>
  )
}

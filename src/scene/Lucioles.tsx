import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { AdditiveBlending, CanvasTexture, Color, type Points } from 'three'
import { useAmbiance } from './ambiance'

const NOMBRE = 28
const LUEUR = new Color('#9fe3c9')
const INTENSITE = 4

interface Luciole {
  x: number
  y: number
  z: number
  amplitude: number
  vitesse: number
  phase: number
}

/** Tirage pseudo-aléatoire reproductible : les lucioles sont les mêmes à chaque chargement. */
function generateur(graine: number): () => number {
  let etat = graine
  return () => {
    etat = (etat * 16807) % 2147483647
    return etat / 2147483647
  }
}

function creerLucioles(): Luciole[] {
  const hasard = generateur(42)
  return Array.from({ length: NOMBRE }, () => {
    const angle = hasard() * Math.PI * 2
    // Autour du bocal, jamais à l'intérieur du verre.
    const distance = 0.85 + hasard() * 0.9
    return {
      x: Math.cos(angle) * distance,
      y: 0.4 + hasard() * 1.5,
      z: Math.sin(angle) * distance,
      amplitude: 0.05 + hasard() * 0.12,
      vitesse: 0.25 + hasard() * 0.5,
      phase: hasard() * Math.PI * 2,
    }
  })
}

/** Petit disque flou dessiné une fois dans un canevas : la forme de chaque luciole. */
function creerHalo(): CanvasTexture {
  const taille = 64
  const canevas = document.createElement('canvas')
  canevas.width = taille
  canevas.height = taille
  const contexte = canevas.getContext('2d')
  if (contexte) {
    const degrade = contexte.createRadialGradient(taille / 2, taille / 2, 0, taille / 2, taille / 2, taille / 2)
    degrade.addColorStop(0, 'rgba(255,255,255,1)')
    degrade.addColorStop(0.25, 'rgba(255,255,255,0.6)')
    degrade.addColorStop(1, 'rgba(255,255,255,0)')
    contexte.fillStyle = degrade
    contexte.fillRect(0, 0, taille, taille)
  }
  return new CanvasTexture(canevas)
}

export function Lucioles() {
  const ambiance = useAmbiance()
  const points = useRef<Points>(null)
  const lucioles = useMemo(() => creerLucioles(), [])
  const halo = useMemo(() => creerHalo(), [])
  useEffect(() => () => halo.dispose(), [halo])

  // Deux tableaux réécrits à chaque image : positions (x, y, z) et couleurs (r, v, b).
  const positions = useMemo(() => new Float32Array(NOMBRE * 3), [])
  const couleurs = useMemo(() => new Float32Array(NOMBRE * 3), [])

  useFrame(({ clock }) => {
    const objet = points.current
    if (!objet) return
    const { nuit } = ambiance.current
    objet.visible = nuit > 0.02
    if (!objet.visible) return

    const t = clock.elapsedTime
    lucioles.forEach((l, i) => {
      // Une boucle lente en forme de huit, propre à chaque luciole.
      positions[i * 3] = l.x + Math.sin(t * l.vitesse + l.phase) * l.amplitude
      positions[i * 3 + 1] = l.y + Math.sin(t * l.vitesse * 1.7 + l.phase) * l.amplitude * 0.6
      positions[i * 3 + 2] = l.z + Math.cos(t * l.vitesse * 0.8 + l.phase) * l.amplitude
      // Chaque luciole s'allume et s'éteint à son rythme.
      const clignement = Math.max(0, Math.sin(t * l.vitesse * 2.3 + l.phase * 3)) ** 2
      const eclat = INTENSITE * nuit * (0.15 + 0.85 * clignement)
      couleurs[i * 3] = LUEUR.r * eclat
      couleurs[i * 3 + 1] = LUEUR.g * eclat
      couleurs[i * 3 + 2] = LUEUR.b * eclat
    })
    const geometrie = objet.geometry
    const attributPositions = geometrie.getAttribute('position')
    const attributCouleurs = geometrie.getAttribute('color')
    if (attributPositions) attributPositions.needsUpdate = true
    if (attributCouleurs) attributCouleurs.needsUpdate = true
  })

  return (
    <points ref={points} visible={false} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[couleurs, 3]} />
      </bufferGeometry>
      {/* Mélange additif : les lumières s'ajoutent au fond au lieu de le recouvrir. */}
      <pointsMaterial
        map={halo}
        size={0.045}
        sizeAttenuation
        vertexColors
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </points>
  )
}

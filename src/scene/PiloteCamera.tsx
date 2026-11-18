import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { MathUtils, Spherical, Vector3 } from 'three'
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export type VueCamera = 'dessus' | 'face'

/** Une demande de changement de vue. `numero` change à chaque clic, même vers la même vue. */
export interface DemandeVue {
  vue: VueCamera
  numero: number
}

/** Angle depuis la verticale : presque à l'aplomb, ou la vue de trois quarts du départ. */
const ANGLES: Readonly<Record<VueCamera, number>> = {
  dessus: 0.03,
  face: Math.atan2(Math.hypot(3.2, 4), 2.9 - 0.85),
}
const DUREE = 0.9 // secondes

const reduireAnimations = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const decalage = new Vector3()
const spherique = new Spherical()

/**
 * Amène la caméra à la vue demandée en gardant sa direction autour du bocal.
 * Si le visiteur reprend la main pendant le mouvement, on le laisse faire.
 */
export function PiloteCamera({ demande }: { demande: DemandeVue | null }) {
  const lire = useThree((etat) => etat.get)
  const mouvement = useRef<{ depart: number; arrivee: number; temps: number } | null>(null)

  useEffect(() => {
    const controles = lire().controls as OrbitControls | null
    if (!demande || !controles) return
    mouvement.current = {
      depart: controles.getPolarAngle(),
      arrivee: ANGLES[demande.vue],
      temps: reduireAnimations ? DUREE : 0,
    }
    const interrompre = () => {
      mouvement.current = null
    }
    controles.addEventListener('start', interrompre)
    return () => controles.removeEventListener('start', interrompre)
  }, [demande, lire])

  useFrame(({ camera, controls }, delta) => {
    const m = mouvement.current
    const controles = controls as OrbitControls | null
    if (!m || !controles) return
    m.temps = Math.min(DUREE, m.temps + Math.min(delta, 0.1))
    const t = MathUtils.smoothstep(m.temps / DUREE, 0, 1)
    decalage.copy(camera.position).sub(controles.target)
    spherique.setFromVector3(decalage)
    spherique.phi = MathUtils.lerp(m.depart, m.arrivee, t)
    camera.position.copy(controles.target).add(decalage.setFromSpherical(spherique))
    controles.update()
    if (m.temps === DUREE) mouvement.current = null
  })

  return null
}

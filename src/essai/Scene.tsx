import { Environment, OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode, type BloomEffect } from 'postprocessing'
import { Suspense, useRef } from 'react'
import { MathUtils, type DirectionalLight, type HemisphereLight } from 'three'
import { Bougie } from './Bougie'
import { Champignons } from './Champignons'
import { Chaudron, ELEVATION, HAUTEUR_SOL } from './Chaudron'
import { Fougere } from './Fougere'
import { Lucioles } from './Lucioles'
import { Table } from './Table'
import type { Ambiance, Hdri, Matiere, Moment } from './types'

const ENCRE_DE_NUIT = '#12161a'
const DUREE_TRANSITION = 2.5 // secondes
const SOL = ELEVATION + HAUTEUR_SOL

/** Avance `valeur` vers `cible` d'au plus `pas`, sans la dépasser. */
function avancerVers(valeur: number, cible: number, pas: number): number {
  return valeur < cible ? Math.min(cible, valeur + pas) : Math.max(cible, valeur - pas)
}

/** Courbe en S : départ et arrivée en douceur. */
function adoucir(t: number): number {
  return t * t * (3 - 2 * t)
}

const reduireAnimations = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function Scene({ moment, hdri, matiere }: { moment: Moment; hdri: Hdri; matiere: Matiere }) {
  const ambiance = useRef<Ambiance>({ progression: 0, nuit: 0 })
  const soleil = useRef<DirectionalLight>(null)
  const clairDeLune = useRef<HemisphereLight>(null)
  const halo = useRef<BloomEffect>(null)

  useFrame(({ scene }, delta) => {
    const a = ambiance.current
    const cible = moment === 'nuit' ? 1 : 0
    // delta est plafonné : après un changement d'onglet, il peut valoir plusieurs secondes.
    const pas = reduireAnimations ? 1 : Math.min(delta, 0.1) / DUREE_TRANSITION
    a.progression = avancerVers(a.progression, cible, pas)
    a.nuit = adoucir(a.progression)

    // L'HDRI ne sert qu'aux reflets et à l'ambiance : on l'éteint presque la nuit.
    scene.environmentIntensity = MathUtils.lerp(0.9, 0.035, a.nuit)
    if (soleil.current) soleil.current.intensity = MathUtils.lerp(2.2, 0, a.nuit)
    if (clairDeLune.current) clairDeLune.current.intensity = MathUtils.lerp(0, 0.18, a.nuit)
    if (halo.current) halo.current.intensity = MathUtils.lerp(0.15, 1.1, a.nuit)
  })

  return (
    <>
      <color attach="background" args={[ENCRE_DE_NUIT]} />
      {/* Le brouillard, de la couleur du fond, fait disparaître les bords de la table. */}
      <fog attach="fog" args={[ENCRE_DE_NUIT, 5, 10]} />

      {/* Sa propre frontière de chargement : changer d'HDRI ne fait pas disparaître la scène. */}
      <Suspense fallback={null}>
        <Environment files={`/hdri/${hdri}_1k.hdr`} />
      </Suspense>

      {/* Lumière principale du jour : une fenêtre haute, sur la gauche. */}
      <directionalLight
        ref={soleil}
        position={[-2.5, 3.5, 1.5]}
        color="#fff1dc"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-2}
        shadow-camera-right={2}
        shadow-camera-top={2}
        shadow-camera-bottom={-2}
        shadow-camera-near={0.5}
        shadow-camera-far={10}
      />
      {/* La nuit : un soupçon de bleu venu d'en haut, pour que les ombres ne soient pas d'un noir mort. */}
      <hemisphereLight ref={clairDeLune} args={['#3a4a66', '#120e0b', 0]} />

      <Table />
      <Chaudron matiere={matiere} />
      <Fougere position={[-0.2, SOL, 0.08]} />
      <Champignons ambiance={ambiance} position={[0.24, SOL, -0.16]} />
      <Bougie ambiance={ambiance} />
      <Lucioles ambiance={ambiance} />

      <OrbitControls
        makeDefault
        target={[0, 0.6, 0]}
        enableDamping
        enablePan={false}
        minDistance={2}
        maxDistance={7}
        minPolarAngle={0.35}
        maxPolarAngle={1.32}
      />

      {/*
        Post-traitement. Le halo (bloom) ne touche que ce qui dépasse une luminosité de 1 :
        flamme, chapeaux luminescents, lucioles. Le mappage des tons (AgX) convertit
        ensuite la lumière « physique » en couleurs affichables, avec un rendu de pellicule.
      */}
      <EffectComposer>
        <Bloom ref={halo} mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.15} />
        <ToneMapping mode={ToneMappingMode.AGX} />
      </EffectComposer>
    </>
  )
}

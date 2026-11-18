import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer, Noise, ToneMapping } from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode, type BloomEffect } from 'postprocessing'
import { Suspense, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { MathUtils, type DirectionalLight, type HemisphereLight } from 'three'
import type { MatiereId } from '../domaine/types'
import { EcranAttente } from '../interface/EcranAttente'
import { Logo } from '../interface/Logo'
import { AmbianceContexte, COULEURS, type Ambiance, type Moment } from './ambiance'
import { Bocal } from './Bocal'
import { Bougie } from './Bougie'
import { Lucioles } from './Lucioles'
import { PiloteCamera, type DemandeVue } from './PiloteCamera'
import { Table } from './Table'
import { webglDisponible } from './webgl'
import styles from './Vitrine.module.css'

const DUREE_TRANSITION = 2.5 // secondes

const reduireAnimations = window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Avance `valeur` vers `cible` d'au plus `pas`, sans la dépasser. */
function avancerVers(valeur: number, cible: number, pas: number): number {
  return valeur < cible ? Math.min(cible, valeur + pas) : Math.max(cible, valeur - pas)
}

/** Courbe en S : départ et arrivée en douceur. */
function adoucir(t: number): number {
  return t * t * (3 - 2 * t)
}

/** La scène est-elle à l'écran ? Hors de vue, inutile de calculer des images. */
function useEnVue(cible: RefObject<HTMLElement | null>): boolean {
  const [enVue, setEnVue] = useState(true)
  useEffect(() => {
    if (!cible.current) return
    const observateur = new IntersectionObserver(([entree]) => setEnVue(entree?.isIntersecting ?? true))
    observateur.observe(cible.current)
    return () => observateur.disconnect()
  }, [cible])
  return enVue
}

interface ProprietesVitrine {
  moment: Moment
  matiere: MatiereId
  /** Description de la scène pour les lecteurs d'écran. */
  description: string
  /** Rotation lente de la caméra (page d'accueil). Désactivée si l'on demande moins d'animations. */
  rotationAuto?: boolean
  /** Le visiteur peut-il tourner et zoomer ? Non sur l'accueil, où le défilement doit passer. */
  pilotable?: boolean
  /** Ce qui remplace la scène si WebGL est indisponible. */
  repli?: ReactNode
  /** Couvercle soulevé et posé sur la table, pour composer. */
  couvercleOuvert?: boolean
  /** Appelé après un clic dans la scène qui ne touche aucun élément. */
  onClicVide?: () => void
  /** Dernière vue demandée par un bouton de l'atelier. */
  demandeVue?: DemandeVue | null
  /** Texte gravé par le visiteur sous la devise. */
  gravure?: string | null
  /** Ce qui est posé dans le bocal. */
  children?: ReactNode
}

/**
 * Le décor commun à l'accueil et au configurateur : table, bocal, bougie, lumières,
 * passage du jour à la nuit. Ce qu'on pose dans le bocal arrive par `children`.
 */
export function Vitrine({
  moment,
  matiere,
  description,
  rotationAuto = false,
  pilotable = true,
  repli,
  couvercleOuvert = false,
  onClicVide,
  demandeVue = null,
  gravure = null,
  children,
}: ProprietesVitrine) {
  // Vérifié une seule fois : sans WebGL, le reste de la page doit continuer à fonctionner.
  const [scenePossible] = useState(webglDisponible)
  const cadre = useRef<HTMLDivElement>(null)
  const enVue = useEnVue(cadre)

  if (!scenePossible) {
    if (repli) return repli
    return (
      <div className={styles.repli}>
        <Logo variante="gravure" className={styles.repliLogo} />
        <p>
          Ce navigateur ne peut pas éclairer le cabinet en trois dimensions. Vous pouvez tout de même composer votre
          terrarium : son détail s’affiche dans le panneau.
        </p>
      </div>
    )
  }

  return (
    <div ref={cadre} className={styles.vitrine} data-pilotable={pilotable}>
      <Canvas
        className={styles.scene}
        frameloop={enVue ? 'always' : 'never'}
        shadows="percentage"
        dpr={[1, 2]}
        camera={{ position: [3.2, 2.9, 4], fov: 32, near: 0.1, far: 30 }}
        role="img"
        aria-label={description}
        onPointerMissed={onClicVide}
      >
        <Suspense fallback={null}>
          <Scene
            moment={moment}
            matiere={matiere}
            couvercleOuvert={couvercleOuvert}
            gravure={gravure}
            demandeVue={demandeVue}
            rotationAuto={rotationAuto && !reduireAnimations}
            pilotable={pilotable}
          >
            {children}
          </Scene>
        </Suspense>
      </Canvas>
      <EcranAttente />
    </div>
  )
}

function Scene({
  moment,
  matiere,
  rotationAuto,
  pilotable,
  couvercleOuvert,
  gravure,
  demandeVue,
  children,
}: Required<Omit<ProprietesVitrine, 'description' | 'children' | 'onClicVide' | 'repli'>> & { children?: ReactNode }) {
  // Si la scène s'ouvre de nuit (accueil), elle y est déjà : pas de transition au chargement.
  const depart = moment === 'nuit' ? 1 : 0
  const ambiance = useRef<Ambiance>({ progression: depart, nuit: depart })
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
    <AmbianceContexte value={ambiance}>
      <color attach="background" args={[COULEURS.encreDeNuit]} />
      {/* Le brouillard, de la couleur du fond, fait disparaître les bords de la table. */}
      <fog attach="fog" args={[COULEURS.encreDeNuit, 5.5, 11]} />

      {/* L'HDRI « Workshop » (Poly Haven), choisie pour les reflets qu'elle donne au verre (D10). */}
      <Environment files="/hdri/workshop_1k.hdr" />

      {/* Lumière principale du jour : une fenêtre haute, sur la gauche. */}
      <directionalLight
        ref={soleil}
        position={[-2.5, 3.5, 1.5]}
        color="#fff1dc"
        intensity={2.2 * (1 - depart)}
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
      <hemisphereLight ref={clairDeLune} args={['#3a4a66', '#120e0b', 0.18 * depart]} />

      <Table />
      <Bocal matiere={matiere} couvercleOuvert={couvercleOuvert} gravure={gravure} />
      {children}
      <Bougie />
      <Lucioles />

      <OrbitControls
        makeDefault
        target={[0, 0.85, 0]}
        enableDamping
        enablePan={false}
        enableRotate={pilotable}
        enableZoom={pilotable}
        minDistance={1.45}
        maxDistance={8}
        // Presque à la verticale, pour regarder dans le bocal par son ouverture.
        // Pas exactement 0 : à l'aplomb parfait, la rotation de la caméra devient instable.
        minPolarAngle={0.03}
        maxPolarAngle={1.32}
        autoRotate={rotationAuto}
        autoRotateSpeed={0.35}
      />

      <PiloteCamera demande={demandeVue} />

      {/*
        Post-traitement. Le halo (bloom) ne touche que ce qui dépasse une luminosité de 1 :
        flamme, chapeaux luminescents, lucioles. Le mappage des tons (AgX) convertit
        ensuite la lumière « physique » en couleurs affichables, avec un rendu de pellicule.
      */}
      <EffectComposer>
        <Bloom ref={halo} mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.15} />
        <ToneMapping mode={ToneMappingMode.AGX} />
        {/* Un grain à peine visible, qui évite les bandes dans les dégradés très sombres. */}
        <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.035} />
      </EffectComposer>
    </AmbianceContexte>
  )
}

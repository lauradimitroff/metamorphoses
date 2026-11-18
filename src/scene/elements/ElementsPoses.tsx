import { useCursor } from '@react-three/drei'
import { useThree, type ThreeEvent } from '@react-three/fiber'
import { useRef, useState, type ComponentType } from 'react'
import { Plane, Vector3, type Group } from 'three'
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { BOCAL, CATALOGUE } from '../../catalogue/catalogue'
import { rejoindreEmplacement } from '../../domaine/encombrement'
import type { ElementId, ElementPose } from '../../domaine/types'
import { useComposition } from '../../etat/composition'
import { COULEURS } from '../ambiance'
import { Amethyste } from './Amethyste'
import { Champignons } from './Champignons'
import { Fougere } from './Fougere'
import { Galets } from './Galets'
import { Mousse } from './Mousse'

/** Un élément ajouté au catalogue sans son composant 3D devient une erreur de compilation. */
const COMPOSANTS: Readonly<Record<ElementId, ComponentType>> = {
  mousse: Mousse,
  fougere: Fougere,
  galets: Galets,
  amethyste: Amethyste,
  'champignons-luminescents': Champignons,
}

/** Hauteur de la zone qu'on peut saisir pour chaque élément. */
const HAUTEURS_DE_PRISE: Readonly<Record<ElementId, number>> = {
  mousse: 0.1,
  fougere: 0.2,
  galets: 0.08,
  amethyste: 0.3,
  'champignons-luminescents': 0.24,
}

const RADIANS_PAR_CRAN = Math.PI / 12
/** Le plan horizontal de la terre, sur lequel on projette le pointeur. */
const PLAN_DU_SOL = new Plane(new Vector3(0, 1, 0), -BOCAL.hauteurSol)
const pointSurLeSol = new Vector3()

function ElementInteractif({
  pose,
  selectionne,
  onSelection,
}: {
  pose: ElementPose
  selectionne: boolean
  onSelection: (uid: string) => void
}) {
  const groupe = useRef<Group>(null)
  const lire = useThree((etat) => etat.get)
  const [survol, setSurvol] = useState(false)
  const glisser = useRef<{ dx: number; dz: number; x: number; z: number } | null>(null)
  const { rayonEncombrement } = CATALOGUE.elements[pose.elementId]
  const hauteur = HAUTEURS_DE_PRISE[pose.elementId]
  useCursor(survol, 'grab', 'auto')

  const activerCamera = (actif: boolean) => {
    const controles = lire().controls as OrbitControls | null
    if (controles) controles.enabled = actif
  }

  const surAppui = (evenement: ThreeEvent<PointerEvent>) => {
    evenement.stopPropagation()
    onSelection(pose.uid)
    if (!evenement.ray.intersectPlane(PLAN_DU_SOL, pointSurLeSol)) return
    activerCamera(false)
    ;(evenement.target as unknown as Element).setPointerCapture(evenement.pointerId)
    glisser.current = {
      dx: pose.x - pointSurLeSol.x * 1000,
      dz: pose.z - pointSurLeSol.z * 1000,
      x: pose.x,
      z: pose.z,
    }
  }

  // Pendant le geste, on déplace directement l'objet 3D : aucun rendu React à chaque image.
  const surDeplacement = (evenement: ThreeEvent<PointerEvent>) => {
    const geste = glisser.current
    if (!geste || !groupe.current || !evenement.ray.intersectPlane(PLAN_DU_SOL, pointSurLeSol)) return
    const { composition } = useComposition.getState()
    const courante = { ...pose, x: geste.x, z: geste.z }
    const cible = { x: pointSurLeSol.x * 1000 + geste.dx, z: pointSurLeSol.z * 1000 + geste.dz }
    const arrivee = rejoindreEmplacement(composition, courante, cible, CATALOGUE)
    geste.x = arrivee.x
    geste.z = arrivee.z
    groupe.current.position.x = arrivee.x / 1000
    groupe.current.position.z = arrivee.z / 1000
  }

  const finirGeste = (evenement: ThreeEvent<PointerEvent>) => {
    const geste = glisser.current
    if (!geste) return
    glisser.current = null
    ;(evenement.target as unknown as Element).releasePointerCapture(evenement.pointerId)
    activerCamera(true)
    useComposition.getState().deplacer(pose.uid, { x: geste.x, z: geste.z })
  }

  const Composant = COMPOSANTS[pose.elementId]
  return (
    <group ref={groupe} position={[pose.x / 1000, BOCAL.hauteurSol, pose.z / 1000]}>
      <group rotation={[0, pose.rotation * RADIANS_PAR_CRAN, 0]}>
        <Composant />
      </group>
      {/* Une zone de prise simple et invisible : bien plus légère à tester que les formes réelles. */}
      <mesh
        position={[0, hauteur / 2, 0]}
        onPointerDown={surAppui}
        onPointerMove={surDeplacement}
        onPointerUp={finirGeste}
        onPointerCancel={finirGeste}
        onPointerOver={(evenement) => {
          evenement.stopPropagation()
          setSurvol(true)
        }}
        onPointerOut={() => setSurvol(false)}
      >
        <cylinderGeometry args={[rayonEncombrement, rayonEncombrement, hauteur, 20]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      {selectionne && (
        <mesh position={[0, 0.014, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[rayonEncombrement + 0.012, rayonEncombrement + 0.02, 64]} />
          <meshBasicMaterial color={COULEURS.laiton} />
        </mesh>
      )}
    </group>
  )
}

/** Traduit les poses du domaine (millièmes, crans de 15°) en objets placés sur le sol. */
export function ElementsPoses({
  elements,
  interactif = false,
  selection = null,
  onSelection,
}: {
  elements: readonly ElementPose[]
  interactif?: boolean
  selection?: string | null
  onSelection?: (uid: string) => void
}) {
  return elements.map((pose) => {
    if (interactif && onSelection) {
      return (
        <ElementInteractif key={pose.uid} pose={pose} selectionne={pose.uid === selection} onSelection={onSelection} />
      )
    }
    const Composant = COMPOSANTS[pose.elementId]
    return (
      <group
        key={pose.uid}
        position={[pose.x / 1000, BOCAL.hauteurSol, pose.z / 1000]}
        rotation={[0, pose.rotation * RADIANS_PAR_CRAN, 0]}
      >
        <Composant />
      </group>
    )
  })
}

import type { ComponentType } from 'react'
import { BOCAL } from '../../catalogue/catalogue'
import type { ElementId, ElementPose } from '../../domaine/types'
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

const RADIANS_PAR_CRAN = Math.PI / 12

/** Traduit les poses du domaine (millièmes, crans de 15°) en objets placés sur le sol. */
export function ElementsPoses({ elements }: { elements: readonly ElementPose[] }) {
  return elements.map(({ uid, elementId, x, z, rotation }) => {
    const Composant = COMPOSANTS[elementId]
    return (
      <group key={uid} position={[x / 1000, BOCAL.hauteurSol, z / 1000]} rotation={[0, rotation * RADIANS_PAR_CRAN, 0]}>
        <Composant />
      </group>
    )
  })
}

import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { Panneau } from './Panneau'
import { Scene } from './Scene'
import type { Hdri, Matiere, Moment } from './types'
import './essai.css'

/**
 * Essai d'éclairage (étape de repérage). Il sert à valider le rendu de jour
 * et de nuit, et à choisir l'HDRI, avant d'écrire l'architecture.
 * Ce code sera recyclé ou supprimé ensuite.
 */
export default function EssaiEclairage() {
  const [moment, setMoment] = useState<Moment>('jour')
  const [hdri, setHdri] = useState<Hdri>('workshop')
  const [matiere, setMatiere] = useState<Matiere>('fonte')

  return (
    <div className="essai">
      <Canvas
        className="essai-scene"
        shadows="percentage"
        dpr={[1, 2]}
        camera={{ position: [2.9, 2.6, 3.6], fov: 32, near: 0.1, far: 30 }}
        aria-label="Chaudron en fonte posé sur une table en noyer, avec une fougère, des champignons et une bougie"
        role="img"
      >
        <Suspense fallback={null}>
          <Scene moment={moment} hdri={hdri} matiere={matiere} />
        </Suspense>
      </Canvas>
      <Panneau
        moment={moment}
        hdri={hdri}
        matiere={matiere}
        onMoment={setMoment}
        onHdri={setHdri}
        onMatiere={setMatiere}
      />
    </div>
  )
}

import { geometrieGalets } from '../generateurs/formes'

export function Galets() {
  return (
    <mesh geometry={geometrieGalets()} castShadow receiveShadow>
      {/* Une pierre polie par l'eau : mate, avec un léger reflet. */}
      <meshStandardMaterial vertexColors roughness={0.48} />
    </mesh>
  )
}

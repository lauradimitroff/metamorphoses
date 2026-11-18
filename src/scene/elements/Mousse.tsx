import { geometrieMousse } from '../generateurs/formes'

export function Mousse() {
  return (
    <mesh geometry={geometrieMousse()} castShadow receiveShadow>
      <meshStandardMaterial vertexColors roughness={1} />
    </mesh>
  )
}

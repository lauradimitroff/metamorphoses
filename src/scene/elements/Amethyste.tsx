import { geometrieAmethyste } from '../generateurs/formes'

/*
 * Le cristal n'utilise pas la transmission du verre : Three.js n'affiche pas un objet
 * transmissif à travers un autre, et l'améthyste disparaîtrait derrière la paroi du bocal.
 * Des faces très lisses et une faible lueur propre suggèrent la matière translucide.
 */
export function Amethyste() {
  return (
    <mesh geometry={geometrieAmethyste()} castShadow receiveShadow>
      <meshStandardMaterial
        vertexColors
        roughness={0.16}
        metalness={0.08}
        envMapIntensity={1.7}
        emissive="#3a1878"
        emissiveIntensity={0.22}
      />
    </mesh>
  )
}

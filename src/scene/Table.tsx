import { useTexture } from '@react-three/drei'
import { RepeatWrapping, SRGBColorSpace, Vector2 } from 'three'

const REPETITIONS = 5
const TEXTURES = {
  map: '/textures/noyer/couleur.jpg',
  normalMap: '/textures/noyer/normale.jpg',
  roughnessMap: '/textures/noyer/rugosite.jpg',
}
const RELIEF = new Vector2(0.6, 0.6)

/** Plateau en noyer fumé. Ses bords se perdent dans le brouillard, comme dans une vitrine. */
export function Table() {
  // Le second argument est appelé une seule fois, au chargement : c'est là qu'on règle les textures.
  const textures = useTexture(TEXTURES, (chargees) => {
    // Seule la carte de couleur est une image « à regarder » (espace sRGB) ;
    // les cartes de normales et de rugosité sont des données brutes.
    chargees.map.colorSpace = SRGBColorSpace
    for (const texture of Object.values(chargees)) {
      texture.wrapS = RepeatWrapping
      texture.wrapT = RepeatWrapping
      texture.repeat.set(REPETITIONS, REPETITIONS)
      texture.anisotropy = 8
    }
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[14, 14]} />
      {/* La texture d'origine est claire : une teinte la multiplie pour obtenir un noyer sombre. */}
      <meshStandardMaterial {...textures} color="#6b4a35" normalScale={RELIEF} />
    </mesh>
  )
}

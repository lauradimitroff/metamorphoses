import { Text } from '@react-three/drei'
import { useLayoutEffect, useRef } from 'react'
import type { Mesh } from 'three'
import policeGravure from '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff?url'

/** La caméra regarde le bocal de trois quarts (à environ 39° sur la droite) : les gravures lui font face. */
const ORIENTATION_FACE_CAMERA = Math.atan2(3.2, 4)

/**
 * Une inscription gravée à l'acide dans le verre : des lettres dépolies, blanchâtres
 * et translucides, comme sur les bocaux d'apothicaire.
 *
 * Le texte est courbé pour épouser la panse : troika (le moteur de texte de drei)
 * l'enroule autour d'un cylindre. Rayon négatif : le centre de la courbure est
 * derrière le texte, sur l'axe du bocal.
 *
 * Servira aussi à la gravure personnalisée (étape 3a).
 */
export function Gravure({
  texte,
  rayon,
  hauteur,
  taille,
  espacement = 0.12,
}: {
  texte: string
  /** Rayon extérieur du verre à cette hauteur. */
  rayon: number
  hauteur: number
  /** Hauteur des lettres, en unités de scène. */
  taille: number
  espacement?: number
}) {
  const maille = useRef<Mesh & { curveRadius: number; sync: () => void }>(null)
  // À peine au-dessus de la surface, pour que les lettres ne s'enfoncent pas dans le verre.
  const rayonGravure = rayon + 0.002

  useLayoutEffect(() => {
    if (!maille.current) return
    maille.current.curveRadius = -rayonGravure
    maille.current.sync()
  }, [rayonGravure])

  return (
    <group rotation={[0, ORIENTATION_FACE_CAMERA, 0]}>
      <Text
        ref={maille}
        font={policeGravure}
        fontSize={taille}
        letterSpacing={espacement}
        anchorX="center"
        anchorY="middle"
        position={[0, hauteur, rayonGravure]}
      >
        {texte}
        {/* Verre dépoli : blanc, mat, à moitié transparent. Il n'écrit pas dans le tampon de
            profondeur, pour ne pas masquer le verre qu'il recouvre. */}
        <meshStandardMaterial color="#eef2ee" roughness={0.9} metalness={0} transparent opacity={0.6} depthWrite={false} />
      </Text>
    </group>
  )
}

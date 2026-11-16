import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import { DoubleSide, Mesh, MeshStandardMaterial } from 'three'

const CHEMIN = '/models/fougere.glb'
/** Le modèle d'origine mesure environ 9 unités de large : on le ramène à environ 0,7. */
const ECHELLE = 0.078
/** Le pied du modèle est 0,25 unité sous son origine : on le remonte d'autant. */
const DECALAGE_PIED = 0.25 * ECHELLE

export function Fougere({ position }: { position: readonly [number, number, number] }) {
  const { scene } = useGLTF(CHEMIN)

  const fougere = useMemo(() => {
    const copie = scene.clone(true)
    copie.traverse((objet) => {
      if (!(objet instanceof Mesh) || !(objet.material instanceof MeshStandardMaterial)) return
      objet.castShadow = true
      objet.receiveShadow = true
      // Le fichier d'origine utilise la transparence « mélangée » (BLEND), qui pose
      // des problèmes d'ordre d'affichage. Un seuil (alphaTest) découpe
      // net les feuilles, et chaque pixel est alors soit opaque, soit invisible.
      const materiau = objet.material.clone()
      materiau.transparent = false
      materiau.alphaTest = 0.5
      materiau.side = DoubleSide
      // Le fichier contient des couleurs par sommet très sombres (de 0,05 à 0,22),
      // qui multiplient la texture et noircissent les feuilles : on les ignore.
      materiau.vertexColors = false
      // Le modèle déclare un aspect à moitié métallique : faux pour une feuille.
      materiau.metalness = 0
      materiau.roughness = 0.8
      objet.material = materiau
    })
    return copie
  }, [scene])

  const [x, y, z] = position
  return <primitive object={fougere} position={[x, y + DECALAGE_PIED, z]} scale={ECHELLE} />
}

useGLTF.preload(CHEMIN)

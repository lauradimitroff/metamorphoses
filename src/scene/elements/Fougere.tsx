import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import { DoubleSide, Mesh, MeshStandardMaterial } from 'three'
import { MODELE_FOUGERE } from '../ressources'

/** Le modèle d'origine mesure environ 9 unités de large : on le ramène à 0,6 (rayon visuel 0,3). */
const ECHELLE = 0.064
/** Les frondes d'origine sont presque à plat : on les redresse en étirant la hauteur. */
const ETIREMENT_VERTICAL = 1.55
/** Le pied du modèle est 0,25 unité sous son origine : on le remonte d'autant. */
const DECALAGE_PIED = 0.25 * ECHELLE * ETIREMENT_VERTICAL

export function Fougere() {
  const { scene } = useGLTF(MODELE_FOUGERE)

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
      // En mode BLEND, le chargeur glTF coupe aussi l'écriture dans le tampon de profondeur.
      // Sans la rétablir, les objets dessinés après la fougère (le sol) la recouvrent.
      materiau.depthWrite = true
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

  return (
    <primitive object={fougere} position={[0, DECALAGE_PIED, 0]} scale={[ECHELLE, ECHELLE * ETIREMENT_VERTICAL, ECHELLE]} />
  )
}

useGLTF.preload(MODELE_FOUGERE)

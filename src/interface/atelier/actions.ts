import { useComposition } from '../../etat/composition'
import { useInterface } from '../../etat/interface'

/** Retire une pièce et place le focus sur sa voisine, pour ne pas perdre le fil au clavier. */
export function retirerPose(uid: string) {
  const { composition, retirer } = useComposition.getState()
  const index = composition.elements.findIndex((pose) => pose.uid === uid)
  const voisine = composition.elements[index + 1] ?? composition.elements[index - 1]
  retirer(uid)
  useInterface.getState().selectionner(voisine?.uid ?? null)
  if (!voisine) requestAnimationFrame(() => document.getElementById('titre-poses')?.focus({ preventScroll: true }))
}

import { CATALOGUE } from '../../catalogue/catalogue'
import { useComposition } from '../../etat/composition'
import { useInterface } from '../../etat/interface'
import { retirerPose } from './actions'
import styles from './BarreSelection.module.css'

/** Les actions sur la pièce sélectionnée, posées sur la scène. */
export function BarreSelection() {
  const selection = useInterface((etat) => etat.selection)
  const selectionner = useInterface((etat) => etat.selectionner)
  const pose = useComposition((etat) => etat.composition.elements.find((element) => element.uid === selection))
  const tourner = useComposition((etat) => etat.tourner)
  if (!pose) return null
  const nom = CATALOGUE.elements[pose.elementId].nom

  return (
    <div className={styles.barre} role="group" aria-label={`Pièce sélectionnée : ${nom}`}>
      <p>
        <strong>{nom}</strong>
        <span>Faites-la glisser sur la terre.</span>
      </p>
      <div className={styles.actions}>
        <button type="button" aria-label="Tourner de 15 degrés vers la gauche" onClick={() => tourner(pose.uid, -1)}>
          −15°
        </button>
        <button type="button" aria-label="Tourner de 15 degrés vers la droite" onClick={() => tourner(pose.uid, 1)}>
          +15°
        </button>
        <button type="button" onClick={() => retirerPose(pose.uid)}>
          Retirer
        </button>
        <button type="button" onClick={() => selectionner(null)}>
          Fermer
        </button>
      </div>
    </div>
  )
}

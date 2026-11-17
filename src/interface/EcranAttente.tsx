import { useProgress } from '@react-three/drei'
import { Logo } from './Logo'
import styles from './EcranAttente.module.css'

/**
 * Pendant le chargement de la scène (modèles, textures, HDRI), le papillon du logo
 * se dessine trait par trait. `useProgress` suit tous les chargements de Three.js.
 * Une fois tout chargé, l'écran s'efface en fondu, et la scène apparaît dessous.
 */
export function EcranAttente() {
  const { active, progress } = useProgress()
  const termine = !active && progress === 100

  return (
    <div className={styles.ecran} data-termine={termine} aria-hidden={termine}>
      <Logo variante="gravure" className={styles.papillon} />
      <p className={styles.message} role="status">
        {termine ? 'Le cabinet est prêt.' : 'Le cabinet s’éclaire…'}
      </p>
    </div>
  )
}

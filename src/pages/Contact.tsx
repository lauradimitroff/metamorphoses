import { Page } from '../interface/Page'
import styles from './provisoire.module.css'

// Provisoire : le formulaire arrive à l'étape 4c.
export default function Contact() {
  return (
    <Page titre="Écrire au cabinet" titreOnglet="Contact" surtitre="Contact">
      <p className={styles.chapo}>Le pupitre de correspondance sera bientôt installé.</p>
    </Page>
  )
}

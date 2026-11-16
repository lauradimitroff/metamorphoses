import { Page } from '../interface/Page'
import styles from './provisoire.module.css'

// Provisoire : le lore arrive à l'étape 4b.
export default function APropos() {
  return (
    <Page titre="Le cabinet" titreOnglet="Le cabinet" surtitre="À propos">
      <p className={styles.chapo}>L’histoire du cabinet est encore en cours de transcription.</p>
    </Page>
  )
}

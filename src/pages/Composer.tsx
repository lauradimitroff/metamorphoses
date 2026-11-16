import { Page } from '../interface/Page'
import styles from './provisoire.module.css'

// Provisoire : le configurateur arrive aux étapes 2 et 3.
export default function Composer() {
  return (
    <Page titre="Composer un terrarium" titreOnglet="Composer" surtitre="L’atelier">
      <p className={styles.chapo}>L’atelier se prépare. Le chaudron chauffe doucement.</p>
    </Page>
  )
}

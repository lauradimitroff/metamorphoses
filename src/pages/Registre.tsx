import { Page } from '../interface/Page'
import styles from './provisoire.module.css'

// Provisoire : le registre, généré depuis les données des crédits, arrive à l'étape 1c.
export default function Registre() {
  return (
    <Page titre="Registre d’inventaire" titreOnglet="Registre des crédits" surtitre="Crédits">
      <p className={styles.chapo}>Chaque pièce du cabinet y sera consignée, avec son auteur et sa licence.</p>
    </Page>
  )
}

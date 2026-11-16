import { Link } from 'react-router'
import { Page } from '../interface/Page'
import styles from './provisoire.module.css'

export default function Introuvable() {
  return (
    <Page titre="Ce spécimen n’existe pas" titreOnglet="Page introuvable" surtitre="Erreur 404">
      <p className={styles.chapo}>Aucune étiquette ne correspond à cette adresse dans nos registres.</p>
      <p className={styles.suite}>
        <Link to="/">Revenir à l’accueil</Link>
      </p>
    </Page>
  )
}

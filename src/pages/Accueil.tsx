import { Link } from 'react-router'
import { Page } from '../interface/Page'
import styles from './provisoire.module.css'

// Provisoire : la vraie page d'accueil vitrine arrive à l'étape 4a.
export default function Accueil() {
  return (
    <Page titre="Métamorphoses" surtitre="Cabinet de terrariums à composer">
      <p className={styles.chapo}>
        Choisissez votre bocal, déposez-y mousses, cristaux et champignons, puis attendez la nuit.
      </p>
      <p className={styles.suite}>
        <Link to="/composer">Composer mon terrarium</Link>
      </p>
    </Page>
  )
}

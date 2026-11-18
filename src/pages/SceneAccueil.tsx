import { COMPOSITION_VITRINE } from '../catalogue/compositions'
import { Photo } from '../interface/Photo'
import { ElementsPoses } from '../scene/elements/ElementsPoses'
import { Vitrine } from '../scene/Vitrine'
import styles from './Accueil.module.css'

/** Chargée à part : le texte de l'accueil s'affiche sans attendre Three.js. */
export default function SceneAccueil() {
  return (
    <Vitrine
      moment="nuit"
      matiere={COMPOSITION_VITRINE.matiere}
      rotationAuto
      pilotable={false}
      description="Un bocal d’apothicaire, de nuit : la bougie l’éclaire et des champignons y luisent."
      repli={
        <Photo
          nom="champignons"
          alt="Des champignons luminescents dans une forêt, à la nuit tombée"
          largeur={2000}
          hauteur={1563}
          tailles="70vw"
          prioritaire
          className={styles.repliPhoto}
        />
      }
    >
      <ElementsPoses elements={COMPOSITION_VITRINE.elements} />
    </Vitrine>
  )
}

import { CATALOGUE } from '../catalogue/catalogue'
import { decrireComposition } from '../domaine/description'
import { useComposition } from '../etat/composition'
import { useInterface } from '../etat/interface'
import { BarreSelection } from '../interface/atelier/BarreSelection'
import { PanneauAtelier } from '../interface/atelier/PanneauAtelier'
import { useTitrePage } from '../interface/useTitrePage'
import { ElementsPoses } from '../scene/elements/ElementsPoses'
import { Vitrine } from '../scene/Vitrine'
import styles from './Composer.module.css'

export default function Composer() {
  useTitrePage('Composer')
  const composition = useComposition((etat) => etat.composition)
  const { moment, couvercleOuvert, demandeVue, selection, selectionner, basculerMoment, basculerCouvercle, basculerVue } =
    useInterface()
  const description = decrireComposition(composition, CATALOGUE)

  return (
    <div className={styles.atelier}>
      <div className={styles.scene}>
        <Vitrine
          moment={moment}
          matiere={composition.matiere}
          couvercleOuvert={couvercleOuvert}
          demandeVue={demandeVue}
          onClicVide={() => selectionner(null)}
          gravure={composition.gravure}
          description="Votre terrarium en trois dimensions, posé sur une table en noyer."
        >
          <ElementsPoses elements={composition.elements} interactif selection={selection} onSelection={selectionner} />
        </Vitrine>
        <BarreSelection />
        <div className={styles.commandes}>
          <button type="button" onClick={basculerMoment}>
            {moment === 'jour' ? 'Attendre la nuit' : 'Revenir au jour'}
          </button>
          <button type="button" onClick={basculerVue}>
            {demandeVue?.vue === 'dessus' ? 'Revenir de face' : 'Voir du dessus'}
          </button>
          <button type="button" onClick={basculerCouvercle}>
            {couvercleOuvert ? 'Refermer le bocal' : 'Rouvrir le bocal'}
          </button>
        </div>
        {/* La scène racontée aux lecteurs d'écran, à chaque changement. */}
        <p className="visuellement-cache" aria-live="polite" data-testid="description-scene">
          {description}
        </p>
      </div>

      <div className={styles.panneau}>
        <header className={styles.entete}>
          <p className={styles.surtitre}>L’atelier</p>
          <h1 tabIndex={-1} data-titre-page className={styles.titre}>
            Composer un terrarium
          </h1>
        </header>
        <PanneauAtelier />
      </div>
    </div>
  )
}

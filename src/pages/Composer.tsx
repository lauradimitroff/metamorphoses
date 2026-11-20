import { useEffect, useRef, useState, type RefObject } from 'react'
import { CATALOGUE } from '../catalogue/catalogue'
import { decrireComposition } from '../domaine/description'
import { useComposition } from '../etat/composition'
import { useInterface } from '../etat/interface'
import { BarreSelection } from '../interface/atelier/BarreSelection'
import { BarreDuSpecimen, PanneauAtelier } from '../interface/atelier/PanneauAtelier'
import { usePetitEcran } from '../interface/usePetitEcran'
import { useTitrePage } from '../interface/useTitrePage'
import { ElementsPoses } from '../scene/elements/ElementsPoses'
import { Vitrine } from '../scene/Vitrine'
import styles from './Composer.module.css'

/**
 * Sur mobile, l'atelier occupe exactement l'écran sous l'en-tête : la scène en haut, le tiroir en bas.
 * La hauteur de l'en-tête varie (polices, retour à la ligne) : on la mesure plutôt que de la deviner.
 */
function useHauteurSousEnTete(atelier: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const element = atelier.current
    if (!element) return
    const mesurer = () => {
      const haut = element.getBoundingClientRect().top + window.scrollY
      element.style.setProperty('--hauteur-atelier', `calc(100svh - ${Math.round(haut)}px)`)
    }
    mesurer()
    const observateur = new ResizeObserver(mesurer)
    observateur.observe(document.body)
    return () => observateur.disconnect()
  }, [atelier])
}

const reduireAnimations = window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Un bouton de la scène : son intitulé complet, raccourci à l'écran sur mobile. */
function Commande({ libelle, court, onClick }: { libelle: string; court: string; onClick: () => void }) {
  return (
    <button type="button" aria-label={libelle} onClick={onClick}>
      <span className={styles.long}>{libelle}</span>
      <span className={styles.court}>{court}</span>
    </button>
  )
}

export default function Composer() {
  useTitrePage('Composer')
  const composition = useComposition((etat) => etat.composition)
  const { moment, couvercleOuvert, demandeVue, selection, selectionner, basculerMoment, basculerCouvercle, basculerVue } =
    useInterface()
  const description = decrireComposition(composition, CATALOGUE)
  const petitEcran = usePetitEcran()
  const [tiroirOuvert, setTiroirOuvert] = useState(false)
  const atelier = useRef<HTMLDivElement>(null)
  useHauteurSousEnTete(atelier)

  const basculerTiroir = () => {
    const ouvrir = !tiroirOuvert
    setTiroirOuvert(ouvrir)
    // Tiroir ouvert, l'atelier prend tout l'écran : l'en-tête du site s'efface pour laisser la scène visible.
    if (ouvrir) {
      requestAnimationFrame(() =>
        atelier.current?.scrollIntoView({ behavior: reduireAnimations ? 'auto' : 'smooth', block: 'start' }),
      )
    }
  }

  return (
    <div ref={atelier} className={styles.atelier} data-tiroir={tiroirOuvert ? 'ouvert' : 'replie'}>
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
          <Commande
            libelle={moment === 'jour' ? 'Attendre la nuit' : 'Revenir au jour'}
            court={moment === 'jour' ? 'Nuit' : 'Jour'}
            onClick={basculerMoment}
          />
          <Commande
            libelle={demandeVue?.vue === 'dessus' ? 'Revenir de face' : 'Voir du dessus'}
            court={demandeVue?.vue === 'dessus' ? 'Face' : 'Dessus'}
            onClick={basculerVue}
          />
          <Commande
            libelle={couvercleOuvert ? 'Refermer le bocal' : 'Rouvrir le bocal'}
            court={couvercleOuvert ? 'Refermer' : 'Rouvrir'}
            onClick={basculerCouvercle}
          />
        </div>
        {/* La scène racontée aux lecteurs d'écran, à chaque changement. */}
        <p className="visuellement-cache" aria-live="polite" data-testid="description-scene">
          {description}
        </p>
      </div>

      <div className={styles.panneau}>
        <header className={styles.entete}>
          <div>
            <p className={styles.surtitre}>L’atelier</p>
            <h1 tabIndex={-1} data-titre-page className={styles.titre}>
              Composer un terrarium
            </h1>
          </div>
          <button
            type="button"
            className={styles.poignee}
            aria-expanded={tiroirOuvert}
            aria-controls="corps-atelier"
            onClick={basculerTiroir}
          >
            {tiroirOuvert ? 'Replier' : 'Choisir les pièces'}
            <span className={styles.chevron} aria-hidden="true" />
          </button>
        </header>
        {/* Tiroir replié : son contenu est hors de portée du clavier et des lecteurs d'écran. */}
        <div id="corps-atelier" className={styles.corps} inert={petitEcran && !tiroirOuvert}>
          <PanneauAtelier />
        </div>
        <BarreDuSpecimen />
      </div>
    </div>
  )
}

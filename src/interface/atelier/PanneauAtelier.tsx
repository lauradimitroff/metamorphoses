import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { CATALOGUE, FAMILLES, LISTE_ELEMENTS } from '../../catalogue/catalogue'
import { REGISTRE } from '../../credits/registre'
import { compter, situer } from '../../domaine/description'
import { remplissage } from '../../domaine/encombrement'
import { filtrerSaisie } from '../../domaine/gravure'
import { calculerTotal, detaillerPrix, formaterPrix } from '../../domaine/prix'
import type { DefinitionElement, ElementPose, MatiereId } from '../../domaine/types'
import { useComposition } from '../../etat/composition'
import { useInterface } from '../../etat/interface'
import { retirerPose } from './actions'
import { VignetteElement } from './VignetteElement'
import styles from './PanneauAtelier.module.css'

const VERRES = Object.entries(CATALOGUE.bocal.matieres) as ReadonlyArray<
  [MatiereId, (typeof CATALOGUE.bocal.matieres)[MatiereId]]
>

function ChoixDuVerre() {
  const matiere = useComposition((etat) => etat.composition.matiere)
  const choisirMatiere = useComposition((etat) => etat.choisirMatiere)

  return (
    <fieldset className={styles.section}>
      <legend className={styles.intitule}>Le verre</legend>
      <div className={styles.verres}>
        {VERRES.map(([id, verre]) => (
          <label key={id} className={styles.verre}>
            <input type="radio" name="verre" checked={matiere === id} onChange={() => choisirMatiere(id)} />
            <span className={styles.nuancier} data-verre={id} aria-hidden="true" />
            <span>{verre.nom}</span>
            <span className={styles.prix}>{formaterPrix(verre.prixCentimes)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/** Provenance de l'élément : l'auteur et la licence, ou « façonné au cabinet ». */
function Provenance({ element }: { element: DefinitionElement }) {
  const credits = REGISTRE.filter((credit) => element.creditIds.includes(credit.id))
  if (credits.length === 0) return <>Façonné au cabinet, dans le code.</>
  return credits.map((credit) => (
    <span key={credit.id}>
      «{"\u00a0"}{credit.titre}{"\u00a0"}», {credit.auteur} · {credit.licence}
    </span>
  ))
}

function FicheElement({ element }: { element: DefinitionElement }) {
  const quantite = useComposition(
    (etat) => etat.composition.elements.filter((pose) => pose.elementId === element.id).length,
  )
  const ajouter = useComposition((etat) => etat.ajouter)
  const retirerUn = useComposition((etat) => etat.retirerUn)
  const afficherMessage = useInterface((etat) => etat.afficherMessage)
  const [provenanceVisible, setProvenanceVisible] = useState(false)
  const idProvenance = useId()

  const surAjout = () => {
    const pose = ajouter(element.id)
    afficherMessage(
      pose ? null : `Plus de place pour ${compter(1, element.appellation)}\u00a0: retirez d’abord un élément.`,
    )
  }
  const surRetrait = () => {
    retirerUn(element.id)
    afficherMessage(null)
  }

  return (
    <li className={styles.fiche}>
      <VignetteElement elementId={element.id} className={styles.vignette} />
      <div className={styles.ficheTexte}>
        <h3 className={styles.nomElement}>
          {element.nom}
          <button
            type="button"
            className={styles.info}
            aria-expanded={provenanceVisible}
            aria-controls={idProvenance}
            aria-label={`Provenance : ${element.nom}`}
            onClick={() => setProvenanceVisible((visible) => !visible)}
          >
            i
          </button>
        </h3>
        <p className={styles.description}>{element.description}</p>
        <p id={idProvenance} className={styles.provenance} hidden={!provenanceVisible}>
          <Provenance element={element} />
        </p>
        <div className={styles.ficheBas}>
          <span className={styles.prix}>{formaterPrix(element.prixCentimes)}</span>
          <div className={styles.compteur}>
            {quantite > 0 && (
              <>
                <button type="button" aria-label={`Retirer : ${element.nom}`} onClick={surRetrait}>
                  −
                </button>
                <span aria-label={`${quantite} dans le bocal`}>{quantite}</span>
              </>
            )}
            <button type="button" aria-label={`Ajouter : ${element.nom}`} onClick={surAjout}>
              +
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}

function Catalogue() {
  return (
    <section className={styles.section} aria-labelledby="titre-catalogue">
      <h2 id="titre-catalogue" className={styles.intitule}>
        Les pièces à déposer
      </h2>
      {FAMILLES.map((famille) => (
        <div key={famille.id} className={styles.famille}>
          <p className={styles.nomFamille}>{famille.nom}</p>
          <ul className={styles.fiches}>
            {LISTE_ELEMENTS.filter((element) => element.famille === famille.id).map((element) => (
              <FicheElement key={element.id} element={element} />
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}

const PAS_NORMAL = 20
const PAS_FIN = 5
const DIRECTIONS: Readonly<Record<string, readonly [number, number]>> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
}

function LignePose({ pose }: { pose: ElementPose }) {
  const selectionnee = useInterface((etat) => etat.selection === pose.uid)
  const selectionner = useInterface((etat) => etat.selectionner)
  const afficherMessage = useInterface((etat) => etat.afficherMessage)
  const deplacer = useComposition((etat) => etat.deplacer)
  const tourner = useComposition((etat) => etat.tourner)
  const bouton = useRef<HTMLButtonElement>(null)
  const element = CATALOGUE.elements[pose.elementId]

  // Une pièce choisie dans la scène reçoit le focus : les touches agissent aussitôt sur elle.
  useEffect(() => {
    if (selectionnee && document.activeElement !== bouton.current) bouton.current?.focus({ preventScroll: true })
  }, [selectionnee])

  const surTouche = (evenement: KeyboardEvent) => {
    const direction = DIRECTIONS[evenement.key]
    if (direction) {
      evenement.preventDefault()
      const pas = evenement.shiftKey ? PAS_FIN : PAS_NORMAL
      const cible = { x: pose.x + direction[0] * pas, z: pose.z + direction[1] * pas }
      afficherMessage(deplacer(pose.uid, cible) ? null : 'Le verre ou une pièce voisine bloque le passage.')
    } else if (evenement.key.toLowerCase() === 'r') {
      evenement.preventDefault()
      tourner(pose.uid, evenement.shiftKey ? -1 : 1)
    } else if (evenement.key === 'Delete' || evenement.key === 'Backspace') {
      evenement.preventDefault()
      retirerPose(pose.uid)
    } else if (evenement.key === 'Escape') {
      selectionner(null)
    }
  }

  return (
    <li>
      <button
        ref={bouton}
        id={`pose-${pose.uid}`}
        type="button"
        className={styles.pose}
        aria-pressed={selectionnee}
        aria-describedby="aide-poses"
        onFocus={() => selectionner(pose.uid)}
        onClick={() => selectionner(pose.uid)}
        onKeyDown={surTouche}
      >
        <span>{element.nom}</span>
        <span className={styles.lieu}>{situer(pose.x, pose.z, CATALOGUE.bocal.rayonSol)}</span>
      </button>
    </li>
  )
}

function PiecesDuBocal() {
  const elements = useComposition((etat) => etat.composition.elements)

  return (
    <section className={styles.section} aria-labelledby="titre-poses">
      <h2 id="titre-poses" tabIndex={-1} className={styles.intitule}>
        Dans le bocal
      </h2>
      {elements.length === 0 ? (
        <p className={styles.aide}>Le bocal attend sa première pièce.</p>
      ) : (
        <>
          <ul className={styles.poses}>
            {elements.map((pose) => (
              <LignePose key={pose.uid} pose={pose} />
            ))}
          </ul>
          <p id="aide-poses" className={styles.aide}>
            Au clavier{"\u00a0"}: flèches pour déplacer (Maj pour affiner), R pour tourner, Suppr pour retirer, Échap pour
            désélectionner.
          </p>
        </>
      )}
    </section>
  )
}

function ChampGravure() {
  const graver = useComposition((etat) => etat.graver)
  const [saisie, setSaisie] = useState('')
  const { longueurMax, prixCentimes } = CATALOGUE.gravure
  const restants = longueurMax - saisie.length

  return (
    <section className={styles.section} aria-labelledby="titre-gravure">
      <h2 id="titre-gravure" className={styles.intitule}>
        La gravure
      </h2>
      <label className={styles.champ}>
        <span>
          Quelques mots gravés dans le verre <span className={styles.prix}>+{"\u00a0"}{formaterPrix(prixCentimes)}</span>
        </span>
        <input
          type="text"
          value={saisie}
          maxLength={longueurMax}
          placeholder="Pour Charlotte, 2026"
          autoComplete="off"
          aria-describedby="aide-gravure"
          onChange={(evenement) => {
            const texte = filtrerSaisie(evenement.target.value, longueurMax)
            setSaisie(texte)
            graver(texte)
          }}
        />
      </label>
      <p id="aide-gravure" className={styles.aide}>
        {restants} {restants > 1 ? 'caractères restants' : 'caractère restant'}. Lettres, chiffres et ponctuation simple.
      </p>
    </section>
  )
}

function Recapitulatif() {
  const composition = useComposition((etat) => etat.composition)
  const lignes = useMemo(() => detaillerPrix(composition, CATALOGUE), [composition])

  return (
    <section className={styles.section} aria-labelledby="titre-recapitulatif">
      <h2 id="titre-recapitulatif" className={styles.intitule}>
        Votre spécimen
      </h2>
      <ul className={styles.lignes}>
        {lignes.map((ligne) => (
          <li key={ligne.libelle}>
            <span>
              {ligne.libelle}
              {ligne.quantite > 1 && ` × ${ligne.quantite}`}
            </span>
            <span>{formaterPrix(ligne.sousTotalCentimes)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Toujours visible en bas du panneau : la place occupée, le dernier message et le total. */
function BarreDuSpecimen() {
  const composition = useComposition((etat) => etat.composition)
  const message = useInterface((etat) => etat.message)
  const part = useMemo(() => Math.round(remplissage(composition, CATALOGUE) * 100), [composition])

  return (
    <div className={styles.barre}>
      <div className={styles.jauge}>
        <span id="titre-jauge">Place occupée</span>
        <div role="meter" aria-labelledby="titre-jauge" aria-valuemin={0} aria-valuemax={100} aria-valuenow={part}>
          <span style={{ transform: `scaleX(${part / 100})` }} />
        </div>
        <span>{part === 100 ? 'Bocal plein' : `${part}\u00a0%`}</span>
      </div>
      <p className={styles.message} role="status">
        {message}
      </p>
      <p className={styles.total}>
        <span>Total</span>
        <strong>{formaterPrix(calculerTotal(composition, CATALOGUE))}</strong>
      </p>
    </div>
  )
}

export function PanneauAtelier() {
  return (
    <>
      <ChoixDuVerre />
      <Catalogue />
      <PiecesDuBocal />
      <ChampGravure />
      <Recapitulatif />
      <BarreDuSpecimen />
    </>
  )
}

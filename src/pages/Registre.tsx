import { Fragment } from 'react'
import { PIECES_ORIGINALES } from '../credits/pieces'
import {
  INTITULES_DES_NATURES,
  LICENCES,
  ORDRE_DES_NATURES,
  REGISTRE,
  type Credit,
  type Nature,
} from '../credits/registre'
import { Page } from '../interface/Page'
import styles from './Registre.module.css'

/**
 * Identifiant HTML d'une rubrique. Il ne doit contenir aucune espace :
 * `aria-labelledby` découpe sa valeur aux espaces, et « modèle 3D » deviendrait deux identifiants.
 */
function idRubrique(nature: Nature): string {
  return `rubrique-${ORDRE_DES_NATURES.indexOf(nature)}`
}

/** « N° 007 » : numéro d'inventaire sur trois chiffres. */
function numero(rang: number): string {
  return `N° ${String(rang).padStart(3, '0')}`
}

// Les crédits regroupés par rubrique, avec un numéro d'inventaire continu d'une rubrique à l'autre.
const RUBRIQUES = (() => {
  let rang = 0
  return ORDRE_DES_NATURES.map((nature) => ({
    nature,
    entrees: REGISTRE.filter((credit) => credit.nature === nature).map((credit) => ({ credit, rang: ++rang })),
  })).filter((rubrique) => rubrique.entrees.length > 0)
})()

const LICENCES_UTILISEES = [...new Set(REGISTRE.map((credit) => credit.licence))]

function Entree({ credit, rang }: { credit: Credit; rang: number }) {
  return (
    <li className={styles.entree}>
      <span className={styles.numero} aria-hidden="true">
        {numero(rang)}
      </span>
      <div className={styles.corps}>
        <h3 className={styles.titre}>
          {/* Un seul lien par ligne, étiré en CSS pour couvrir toute la ligne */}
          <a
            href={credit.source}
            className={styles.lienLigne}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${credit.titre}, page d’origine (nouvel onglet)`}
          >
            {credit.titre}
            <span className={styles.fleche} aria-hidden="true">
              ↗
            </span>
          </a>
        </h3>
        <p className={styles.auteur}>{credit.auteur}</p>
        {credit.modifications && <p className={styles.modifications}>{credit.modifications}</p>}
      </div>
      <p className={styles.licence}>
        <span className={styles.libelleLicence}>Licence</span>
        <span className={styles.sigleLicence}>{credit.licence}</span>
      </p>
    </li>
  )
}

export default function Registre() {
  return (
    <Page titre="Registre d’inventaire" titreOnglet="Registre des crédits" surtitre="Crédits">
      <p className={styles.chapo}>
        Chaque pièce entrée au cabinet y est consignée : son auteur, sa provenance, et la licence sous laquelle elle
        nous a été confiée.
      </p>

      {RUBRIQUES.map(({ nature, entrees }) => (
        <section key={nature} className={styles.rubrique} aria-labelledby={idRubrique(nature)}>
          <h2 id={idRubrique(nature)} className={styles.intitule}>
            {INTITULES_DES_NATURES[nature]}
          </h2>
          <ol className={styles.liste}>
            {entrees.map(({ credit, rang }) => (
              <Entree key={credit.id} credit={credit} rang={rang} />
            ))}
          </ol>
        </section>
      ))}

      <section className={styles.rubrique} aria-labelledby="rubrique-cabinet">
        <h2 id="rubrique-cabinet" className={styles.intitule}>
          Pièces façonnées au cabinet
        </h2>
        <p className={styles.texte}>Générées dans le code par Laura Dimitroff, sans aucune ressource extérieure.</p>
        <ul className={styles.pieces}>
          {PIECES_ORIGINALES.map((piece) => (
            <li key={piece}>{piece}</li>
          ))}
        </ul>
      </section>

      <section className={styles.rubrique} aria-labelledby="rubrique-licences">
        <h2 id="rubrique-licences" className={styles.intitule}>
          Les licences
        </h2>
        <dl className={styles.licences}>
          {LICENCES_UTILISEES.map((licence) => (
            <Fragment key={licence}>
              <dt>
                <a
                  href={LICENCES[licence].lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${licence} (nouvel onglet)`}
                >
                  {licence}
                </a>
              </dt>
              <dd>{LICENCES[licence].resume}</dd>
            </Fragment>
          ))}
        </dl>
      </section>
    </Page>
  )
}

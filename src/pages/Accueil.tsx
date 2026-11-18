import { lazy, Suspense } from 'react'
import { Link } from 'react-router'
import { Apparition } from '../interface/Apparition'
import { Photo } from '../interface/Photo'
import { useTitrePage } from '../interface/useTitrePage'
import styles from './Accueil.module.css'

const SceneAccueil = lazy(() => import('./SceneAccueil'))

/** Le bocal gravé au trait, pour le premier temps. */
function GravureBocal() {
  return (
    <svg
      className={styles.gravure}
      viewBox="0 0 240 300"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M120 16c-5 0-8 3-8 7 0 3 2 5 4 6l-2 6h12l-2-6c2-1 4-3 4-6 0-4-3-7-8-7Z" />
      <path d="M58 58c8-13 34-23 62-23s54 10 62 23v9H58v-9Z" />
      <path d="M70 67v14c0 5-8 9-18 18-9 8-14 17-14 27v128c0 18 12 28 28 28h108c16 0 28-10 28-28V126c0-10-5-19-14-27-10-9-18-13-18-18V67" />
      <path d="M70 81c14 5 86 5 100 0M39 214c22 9 140 9 162 0M39 242c22 9 140 9 162 0" />
      <path d="M58 118c-4 6-6 13-6 22v42M190 150v62" />
      <path d="M88 212c2-17 12-27 25-34-3 12-5 23-5 37M152 214c-1-13-1-24 5-36 7 9 10 21 9 36M122 216c0-11 4-20 12-27" />
      <path d="M76 148c28 7 60 7 88 0" strokeDasharray="2 5" />
    </svg>
  )
}

function AppelAComposer({ secondaire = false }: { secondaire?: boolean }) {
  return (
    <Link to="/composer" className={secondaire ? styles.appelSecondaire : styles.appel}>
      Composer mon terrarium
    </Link>
  )
}

export default function Accueil() {
  useTitrePage()

  return (
    <>
      <section className={styles.ouverture}>
        <div className={styles.scene}>
          <Suspense fallback={null}>
            <SceneAccueil />
          </Suspense>
        </div>
        <div className={styles.accroche}>
          <p className={styles.surtitre}>Cabinet de terrariums à composer</p>
          <h1 tabIndex={-1} data-titre-page className={styles.titre}>
            Un jardin sous verre, qui s’éveille à la nuit tombée
          </h1>
          <p className={styles.chapo}>
            Choisissez un bocal d’apothicaire, déposez-y mousses, cristaux et champignons, puis laissez venir le soir.
          </p>
          <div className={styles.actions}>
            <AppelAComposer />
            <Link to="/a-propos" className={styles.lienDiscret}>
              Découvrir le cabinet
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.temps} aria-labelledby="titre-temps">
        <Apparition>
          <h2 id="titre-temps" className={styles.titreSection}>
            Comment naît un spécimen
          </h2>
        </Apparition>

        <Apparition className={styles.etape}>
          <div className={`${styles.illustration} ${styles.illustrationGravure}`}>
            <GravureBocal />
          </div>
          <div className={styles.texteEtape}>
            <p className={styles.numero}>I</p>
            <h3>Choisir son verre</h3>
            <p>
              Clair comme une vitre ancienne, ou ambré comme un flacon d’apothicaire. Faites-y graver quelques mots,
              sous la devise de la maison.
            </p>
          </div>
        </Apparition>

        <Apparition className={`${styles.etape} ${styles.etapeInversee}`}>
          <div className={`${styles.illustration} bords-fondus`}>
            <Photo
              nom="mousse"
              alt="Une butte de mousse à contre-jour, ses fines tiges éclairées sur un fond noir"
              largeur={2000}
              hauteur={1335}
              tailles="(max-width: 48rem) 100vw, 55vw"
              className={styles.photo}
            />
          </div>
          <div className={styles.texteEtape}>
            <p className={styles.numero}>II</p>
            <h3>Déposer chaque pièce</h3>
            <p>
              Mousses, fougère, galets, améthyste{' '}: chaque pièce se pose, se tourne et se déplace sur la terre,
              jusqu’à trouver sa place.
            </p>
          </div>
        </Apparition>

        <Apparition className={styles.etape}>
          <div className={`${styles.illustration} bords-fondus`}>
            <Photo
              nom="champignons"
              alt="Des champignons luminescents, d’un vert pâle, dans l’herbe d’une forêt nocturne"
              largeur={2000}
              hauteur={1563}
              tailles="(max-width: 48rem) 100vw, 55vw"
              className={styles.photo}
            />
          </div>
          <div className={styles.texteEtape}>
            <p className={styles.numero}>III</p>
            <h3>Attendre la nuit</h3>
            <p>Le jour tombe, la bougie s’allume, et ce que vous avez composé se met à luire.</p>
          </div>
        </Apparition>
      </section>

      <section className={styles.cabinet} aria-labelledby="titre-cabinet">
        <Apparition>
          <p className={styles.surtitre}>Le cabinet</p>
          <h2 id="titre-cabinet" className={styles.devise} lang="la">
            Vulnerant omnes, ultima necat
          </h2>
          <p className={styles.traduction}>Toutes blessent, la dernière tue.</p>
          <p className={styles.texteCabinet}>
            Gravée sur les anciens cadrans solaires, la devise parle des heures. La maison l’a faite sienne{' '}:
            ici, on prend le temps de regarder vivre ce qui tient dans un bocal.
          </p>
          <Link to="/a-propos" className={styles.lienDiscret}>
            Entrer dans le cabinet
          </Link>
        </Apparition>
      </section>

      <section className={styles.fin}>
        <Apparition>
          <h2 className={styles.titreSection}>Votre bocal attend sa première pièce</h2>
          <AppelAComposer secondaire />
        </Apparition>
      </section>
    </>
  )
}

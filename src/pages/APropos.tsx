import { Fragment, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { Apparition } from '../interface/Apparition'
import { Page } from '../interface/Page'
import { Photo } from '../interface/Photo'
import styles from './APropos.module.css'

const CHAPITRES = [
  {
    annee: '1887',
    titre: 'Une chrysalide dans un bocal',
    texte:
      'La naturaliste Hortense Vauclair enferme une chrysalide sur un peu de terre humide. Elle veut voir, sans y toucher, l’instant où une chose en devient une autre. Au printemps, un papillon de nuit s’envole vers la lampe. Elle referme le bocal, et l’oublie.',
    photo: {
      nom: 'papillon-lumiere',
      hauteur: 1333,
      alt: 'La silhouette d’un papillon de nuit devant un disque de lumière, en noir et blanc',
    },
  },
  {
    annee: '1888',
    titre: 'Une fougère que personne n’a semée',
    texte:
      'Un an plus tard, elle le retrouve derrière ses herbiers. Sans eau et sans soin, une fougère y a poussé. Le matin, la buée monte sur le verre\u00a0; le soir, elle redescend vers la terre. Ce petit monde pleut sur lui-même.',
    photo: {
      nom: 'papillon-fougere',
      hauteur: 1333,
      alt: 'Un petit papillon orangé posé sur une fronde de fougère, dans la pénombre',
    },
  },
  {
    annee: '1891',
    titre: 'Une lueur dans le noir',
    texte:
      'Un soir d’octobre, elle souffle sa bougie plus tôt que d’habitude. Dans un bocal, de minuscules champignons se mettent à luire. Elle reste assise dans le noir, longtemps, à regarder cette lumière qui ne chauffe rien.',
    photo: {
      nom: 'champignons',
      hauteur: 1563,
      alt: 'Des champignons luminescents, d’un vert pâle, dans l’herbe d’une forêt nocturne',
    },
  },
  {
    annee: '1903',
    titre: 'Une devise gravée dans le verre',
    texte:
      'Elle fait graver sur ses bocaux la devise du vieux cadran solaire de son jardin\u00a0: Vulnerant omnes, ultima necat. Toutes les heures blessent, la dernière tue. Sur un bocal où le temps ne fait que pousser, la phrase devient presque tendre.',
    photo: {
      nom: 'mousse',
      hauteur: 1335,
      alt: 'Une butte de mousse à contre-jour, ses fines tiges éclairées sur un fond noir',
    },
  },
] as const

/** Chaque mot monte depuis une ligne invisible, l'un après l'autre. */
function TitreRevele({ texte }: { texte: string }) {
  return (
    <h2 className={styles.titreChapitre}>
      {texte.split(' ').map((mot, index) => (
        // Un même mot peut revenir : sa position le rend unique.
        <Fragment key={`${mot}-${index}`}>
          <span className={styles.mot}>
            <span style={{ '--rang': index } as CSSProperties}>{mot}</span>
          </span>{' '}
        </Fragment>
      ))}
    </h2>
  )
}

export default function APropos() {
  return (
    <Page titre="Le registre d’Hortense" titreOnglet="Le cabinet" surtitre="Le cabinet">
      <p className={styles.chapo}>
        Métamorphoses est né d’un bocal oublié, et du carnet où une naturaliste a noté tout ce qui s’y passait.
      </p>

      <div className={styles.chapitres}>
        {CHAPITRES.map(({ annee, titre, texte, photo }) => (
          <Apparition key={annee} sobre className={styles.chapitre}>
            <div className={`${styles.image} bords-fondus`}>
              <Photo
                nom={photo.nom}
                alt={photo.alt}
                largeur={2000}
                hauteur={photo.hauteur}
                tailles="(max-width: 48rem) 100vw, 50vw"
              />
            </div>
            <div className={styles.recit}>
              <p className={styles.annee}>{annee}</p>
              <TitreRevele texte={titre} />
              <p className={styles.texte}>{texte}</p>
            </div>
          </Apparition>
        ))}
      </div>

      <Apparition className={styles.fin}>
        <h2>La page suivante est à vous</h2>
        <Link to="/composer" className={styles.appel}>
          Composer mon terrarium
        </Link>
        <p className={styles.verite}>
          Hortense Vauclair et son cabinet sont imaginaires. Son bocal, lui, a un ancêtre{'\u00a0'}: vers 1829, à Londres, le
          médecin Nathaniel Ward aurait vu une fougère germer dans un flacon fermé où il gardait une chrysalide. C’est
          l’origine de nos terrariums.
        </p>
      </Apparition>
    </Page>
  )
}

import { useState } from 'react'
import { BOCAL } from '../catalogue/catalogue'
import type { MatiereId } from '../domaine/types'
import { Page } from '../interface/Page'
import type { Moment } from '../scene/ambiance'
import { HAUTEUR_DU_SOL } from '../scene/Bocal'
import { Champignons } from '../scene/elements/Champignons'
import { Fougere } from '../scene/elements/Fougere'
import { Vitrine } from '../scene/Vitrine'
import styles from './Composer.module.css'

/*
 * Provisoire (étape 2a) : la vitrine avec une composition fixe et des commandes de test.
 * Le vrai configurateur arrive aux étapes 3a et 3b.
 */

function Bascule<T extends string>({
  legende,
  options,
  valeur,
  onChange,
}: {
  legende: string
  options: ReadonlyArray<{ id: T; nom: string }>
  valeur: T
  onChange: (valeur: T) => void
}) {
  return (
    <fieldset className={styles.bascule}>
      <legend>{legende}</legend>
      {options.map((option) => (
        <button key={option.id} type="button" aria-pressed={option.id === valeur} onClick={() => onChange(option.id)}>
          {option.nom}
        </button>
      ))}
    </fieldset>
  )
}

export default function Composer() {
  const [moment, setMoment] = useState<Moment>('jour')
  const [matiere, setMatiere] = useState<MatiereId>('verre-clair')
  const [couvercle, setCouvercle] = useState<'ferme' | 'ouvert'>('ferme')

  return (
    <Page titre="Composer un terrarium" titreOnglet="Composer" surtitre="L’atelier">
      <div className={styles.atelier}>
        <Vitrine
          moment={moment}
          matiere={matiere}
          couvercleOuvert={couvercle === 'ouvert'}
          description={`Bocal en ${BOCAL.matieres[matiere].nom.toLowerCase()} posé sur une table en noyer, avec une fougère et des champignons.`}
        >
          <Fougere position={[-0.2, HAUTEUR_DU_SOL, 0.08]} />
          <Champignons position={[0.24, HAUTEUR_DU_SOL, -0.16]} />
        </Vitrine>
      </div>

      <div className={styles.commandes}>
        <Bascule
          legende="Moment"
          options={[
            { id: 'jour', nom: 'Jour' },
            { id: 'nuit', nom: 'Nuit' },
          ]}
          valeur={moment}
          onChange={setMoment}
        />
        <Bascule
          legende="Verre"
          options={[
            { id: 'verre-clair', nom: 'Clair' },
            { id: 'verre-ambre', nom: 'Ambré' },
          ]}
          valeur={matiere}
          onChange={setMatiere}
        />
        <Bascule
          legende="Couvercle"
          options={[
            { id: 'ferme', nom: 'Fermé' },
            { id: 'ouvert', nom: 'Ouvert' },
          ]}
          valeur={couvercle}
          onChange={setCouvercle}
        />
      </div>
    </Page>
  )
}

import { HDRIS, MATIERES, type Hdri, type Matiere, type Moment } from './types'

interface Option<T extends string> {
  id: T
  nom: string
}

/** Groupe de boutons dont un seul est actif. `aria-pressed` l'annonce aux lecteurs d'écran. */
function Choix<T extends string>({
  legende,
  options,
  valeur,
  onChange,
}: {
  legende: string
  options: ReadonlyArray<Option<T>>
  valeur: T
  onChange: (valeur: T) => void
}) {
  return (
    <fieldset className="essai-choix">
      <legend>{legende}</legend>
      <div className="essai-boutons">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={option.id === valeur}
            onClick={() => onChange(option.id)}
          >
            {option.nom}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

const MOMENTS: ReadonlyArray<Option<Moment>> = [
  { id: 'jour', nom: 'Jour' },
  { id: 'nuit', nom: 'Nuit' },
]

export function Panneau(props: {
  moment: Moment
  hdri: Hdri
  matiere: Matiere
  onMoment: (moment: Moment) => void
  onHdri: (hdri: Hdri) => void
  onMatiere: (matiere: Matiere) => void
}) {
  return (
    <aside className="essai-panneau" aria-label="Réglages de l'essai">
      <p className="essai-surtitre">Métamorphoses</p>
      <h1>Essai d’éclairage</h1>
      <Choix legende="Moment" options={MOMENTS} valeur={props.moment} onChange={props.onMoment} />
      <Choix legende="Reflets (HDRI)" options={HDRIS} valeur={props.hdri} onChange={props.onHdri} />
      <Choix legende="Matière du chaudron" options={MATIERES} valeur={props.matiere} onChange={props.onMatiere} />
    </aside>
  )
}

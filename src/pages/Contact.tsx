import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import {
  MESSAGE_MAX,
  OBJETS_CONTACT,
  validerContact,
  type ChampContact,
  type ErreursContact,
  type ValeursContact,
} from '../domaine/contact'
import { Logo } from '../interface/Logo'
import { Page } from '../interface/Page'
import styles from './Contact.module.css'

const VIDE: ValeursContact = { nom: '', email: '', objet: '', message: '' }
const ORDRE_DES_CHAMPS: readonly ChampContact[] = ['nom', 'email', 'objet', 'message']

/** Un champ avec son libellé et son erreur, reliés pour les lecteurs d'écran. */
function Champ({
  id,
  libelle,
  erreur,
  aide,
  children,
}: {
  id: ChampContact
  libelle: string
  erreur?: string
  aide?: ReactNode
  children: ReactNode
}) {
  return (
    <div className={styles.champ} data-erreur={Boolean(erreur)}>
      <label htmlFor={id}>{libelle}</label>
      {children}
      {aide && (
        <p id={`${id}-aide`} className={styles.aide}>
          {aide}
        </p>
      )}
      {erreur && (
        <p id={`${id}-erreur`} className={styles.erreur}>
          {erreur}
        </p>
      )}
    </div>
  )
}

function Formulaire({ onEnvoi }: { onEnvoi: () => void }) {
  const [valeurs, setValeurs] = useState(VIDE)
  const [erreurs, setErreurs] = useState<ErreursContact>({})
  const formulaire = useRef<HTMLFormElement>(null)

  const changer = (champ: ChampContact, valeur: string) => {
    const suivantes = { ...valeurs, [champ]: valeur }
    setValeurs(suivantes)
    // Une erreur déjà affichée disparaît dès que le champ est corrigé.
    if (erreurs[champ]) setErreurs((actuelles) => ({ ...actuelles, [champ]: validerContact(suivantes)[champ] }))
  }

  const verifierChamp = (champ: ChampContact) => {
    if (valeurs[champ].trim() === '') return // On ne reproche rien à un champ simplement traversé.
    setErreurs((actuelles) => ({ ...actuelles, [champ]: validerContact(valeurs)[champ] }))
  }

  const envoyer = (evenement: FormEvent) => {
    evenement.preventDefault()
    const trouvees = validerContact(valeurs)
    setErreurs(trouvees)
    const premier = ORDRE_DES_CHAMPS.find((champ) => trouvees[champ])
    if (premier) formulaire.current?.querySelector<HTMLElement>(`#${premier}`)?.focus()
    else onEnvoi()
  }

  const attributs = (champ: ChampContact) => ({
    id: champ,
    name: champ,
    required: true,
    value: valeurs[champ],
    'aria-invalid': Boolean(erreurs[champ]),
    'aria-describedby':
      [champ === 'message' ? 'message-aide' : '', erreurs[champ] ? `${champ}-erreur` : ''].filter(Boolean).join(' ') ||
      undefined,
    onBlur: () => verifierChamp(champ),
  })

  return (
    <form ref={formulaire} className={styles.formulaire} onSubmit={envoyer} noValidate>
      <div className={styles.ligne}>
        <Champ id="nom" libelle="Votre nom" erreur={erreurs.nom}>
          <input {...attributs('nom')} autoComplete="name" onChange={(e) => changer('nom', e.target.value)} />
        </Champ>
        <Champ id="email" libelle="Votre adresse électronique" erreur={erreurs.email}>
          <input
            {...attributs('email')}
            type="email"
            autoComplete="email"
            onChange={(e) => changer('email', e.target.value)}
          />
        </Champ>
      </div>
      <Champ id="objet" libelle="L’objet de votre lettre" erreur={erreurs.objet}>
        <select {...attributs('objet')} onChange={(e) => changer('objet', e.target.value)}>
          <option value="" disabled>
            Choisissez…
          </option>
          {OBJETS_CONTACT.map((objet) => (
            <option key={objet}>{objet}</option>
          ))}
        </select>
      </Champ>
      <Champ
        id="message"
        libelle="Votre message"
        erreur={erreurs.message}
        aide={`${valeurs.message.length} sur ${MESSAGE_MAX} caractères`}
      >
        <textarea {...attributs('message')} rows={7} onChange={(e) => changer('message', e.target.value)} />
      </Champ>
      <button type="submit" className={styles.envoyer}>
        Confier au cabinet
      </button>
    </form>
  )
}

function Confirmation({ onNouveau }: { onNouveau: () => void }) {
  const titre = useRef<HTMLHeadingElement>(null)
  useEffect(() => titre.current?.focus(), [])

  return (
    <div className={styles.confirmation}>
      <Logo variante="gravure" className={styles.papillon} />
      <h2 ref={titre} tabIndex={-1}>
        Votre lettre est bien arrivée sur le pupitre
      </h2>
      <p>Boutique de démonstration{' '}: votre message n’a pas été envoyé, et rien n’a quitté votre navigateur.</p>
      <button type="button" onClick={onNouveau}>
        Écrire une autre lettre
      </button>
    </div>
  )
}

export default function Contact() {
  const [envoye, setEnvoye] = useState(false)

  return (
    <Page titre="Écrire au cabinet" titreOnglet="Contact" surtitre="Contact">
      <div className={styles.disposition}>
        <div className={styles.introduction}>
          <p className={styles.chapo}>
            Une question sur une composition, une gravure à imaginer, ou une page du registre à commenter{' '}?
          </p>
          <p>Le pupitre de correspondance est ouvert, même si cette boutique imaginaire ne reçoit aucun courrier.</p>
        </div>
        {envoye ? <Confirmation onNouveau={() => setEnvoye(false)} /> : <Formulaire onEnvoi={() => setEnvoye(true)} />}
      </div>
    </Page>
  )
}

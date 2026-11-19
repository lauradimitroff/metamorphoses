import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { CATALOGUE } from '../catalogue/catalogue'
import { resumerBocal, totalPanier, type BocalAuPanier } from '../domaine/panier'
import { calculerTotal, detaillerPrix, formaterPrix } from '../domaine/prix'
import { usePanier } from '../etat/panier'
import { Logo } from '../interface/Logo'
import { Page } from '../interface/Page'
import styles from './Panier.module.css'

interface Commande {
  numero: string
  bocaux: BocalAuPanier[]
}

function FicheBocal({ bocal, rang, onRetirer }: { bocal: BocalAuPanier; rang: number; onRetirer?: () => void }) {
  const { titre, gravure } = resumerBocal(bocal.composition, CATALOGUE)
  const lignes = detaillerPrix(bocal.composition, CATALOGUE)

  return (
    <article className={styles.bocal} aria-labelledby={`bocal-${bocal.id}`}>
      <p className={styles.numero}>Spécimen n°{' '}{rang}</p>
      <div className={styles.entete}>
        <h3 id={`bocal-${bocal.id}`}>{titre}</h3>
        <span className={styles.prix}>{formaterPrix(calculerTotal(bocal.composition, CATALOGUE))}</span>
      </div>
      {gravure && <p className={styles.gravure}>Gravé «{' '}{gravure}{' '}»</p>}
      <ul className={styles.detail}>
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
      {onRetirer && (
        <button type="button" className={styles.retirer} onClick={onRetirer} aria-label={`Retirer le spécimen n° ${rang}`}>
          Retirer
        </button>
      )}
    </article>
  )
}

function Confirmation({ commande }: { commande: Commande }) {
  const titre = useRef<HTMLHeadingElement>(null)
  useEffect(() => titre.current?.focus(), [])

  return (
    <section className={styles.confirmation} aria-labelledby="titre-confirmation">
      <Logo variante="gravure" className={styles.papillon} />
      <p className={styles.numero}>Commande n°{' '}{commande.numero}</p>
      <h2 id="titre-confirmation" ref={titre} tabIndex={-1}>
        Votre commande est consignée au registre
      </h2>
      <p className={styles.mention}>
        Boutique de démonstration{' '}: rien n’est vendu et aucun paiement n’a eu lieu. Vos bocaux restent dans le
        registre, à l’état de rêve.
      </p>
      <div className={styles.liste}>
        {commande.bocaux.map((bocal, index) => (
          <FicheBocal key={bocal.id} bocal={bocal} rang={index + 1} />
        ))}
      </div>
      <p className={styles.total}>
        <span>Total</span>
        <strong>{formaterPrix(totalPanier(commande.bocaux, CATALOGUE))}</strong>
      </p>
      <div className={styles.suites}>
        <Link to="/composer" className={styles.appel}>
          Composer un autre bocal
        </Link>
        <Link to="/" className={styles.lien}>
          Revenir à l’accueil
        </Link>
      </div>
    </section>
  )
}

export default function Panier() {
  const { bocaux, retirer, vider } = usePanier()
  const [commande, setCommande] = useState<Commande | null>(null)
  const titreListe = useRef<HTMLHeadingElement>(null)

  const valider = () => {
    setCommande({ numero: String(Date.now() % 10000).padStart(4, '0'), bocaux })
    vider()
  }

  const retirerBocal = (id: string) => {
    retirer(id)
    // Le bouton cliqué disparaît : on replace le focus sur la liste pour ne pas le perdre.
    titreListe.current?.focus()
  }

  return (
    <Page titre="Votre panier" titreOnglet="Panier" surtitre="Le comptoir">
      {commande ? (
        <Confirmation commande={commande} />
      ) : bocaux.length === 0 ? (
        <div className={styles.videPanier}>
          <p>Aucun bocal n’attend encore sur le comptoir.</p>
          <Link to="/composer" className={styles.appel}>
            Composer mon terrarium
          </Link>
        </div>
      ) : (
        <div className={styles.disposition}>
          <section aria-labelledby="titre-bocaux">
            <h2 id="titre-bocaux" ref={titreListe} tabIndex={-1} className={styles.intitule}>
              {bocaux.length > 1 ? `Vos ${bocaux.length} bocaux` : 'Votre bocal'}
            </h2>
            <div className={styles.liste}>
              {bocaux.map((bocal, index) => (
                <FicheBocal key={bocal.id} bocal={bocal} rang={index + 1} onRetirer={() => retirerBocal(bocal.id)} />
              ))}
            </div>
          </section>

          <aside className={styles.resume} aria-labelledby="titre-resume">
            <h2 id="titre-resume" className={styles.intitule}>
              Récapitulatif
            </h2>
            <ul className={styles.detail}>
              {bocaux.map(({ id, composition }, index) => (
                <li key={id}>
                  <span>Spécimen n°{' '}{index + 1}</span>
                  <span>{formaterPrix(calculerTotal(composition, CATALOGUE))}</span>
                </li>
              ))}
              <li>
                <span>Préparation et emballage</span>
                <span>Offerts</span>
              </li>
            </ul>
            <p className={styles.total}>
              <span>Total</span>
              <strong>{formaterPrix(totalPanier(bocaux, CATALOGUE))}</strong>
            </p>
            <button type="button" className={styles.valider} onClick={valider}>
              Valider la commande
            </button>
            <p className={styles.mention}>Boutique de démonstration{' '}: aucun paiement ne sera demandé.</p>
            <Link to="/composer" className={styles.lien}>
              Continuer à composer
            </Link>
          </aside>
        </div>
      )}
    </Page>
  )
}

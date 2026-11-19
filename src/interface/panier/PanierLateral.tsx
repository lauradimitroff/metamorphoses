import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { CATALOGUE } from '../../catalogue/catalogue'
import { resumerBocal, totalPanier } from '../../domaine/panier'
import { calculerTotal, formaterPrix } from '../../domaine/prix'
import { useInterface } from '../../etat/interface'
import { usePanier } from '../../etat/panier'
import styles from './Panier.module.css'

/**
 * L'aperçu du panier s'ouvre dans un <dialog> natif, en mode modal : le navigateur garde
 * le focus à l'intérieur, ferme avec Échap et rend le focus au bouton d'origine.
 * La commande elle-même se passe sur la page /panier.
 */
export function PanierLateral() {
  const ouvert = useInterface((etat) => etat.panierOuvert)
  const fermer = useInterface((etat) => etat.fermerPanier)
  const { bocaux, retirer } = usePanier()
  const dialogue = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const element = dialogue.current
    if (!element) return
    if (ouvert && !element.open) element.showModal()
    if (!ouvert && element.open) element.close()
  }, [ouvert])

  const refermer = () => dialogue.current?.close()

  return (
    <dialog
      ref={dialogue}
      className={styles.panneau}
      aria-labelledby="titre-panier"
      onClose={fermer}
      // Un clic sur le voile, autour du panneau, le referme.
      onClick={(evenement) => evenement.target === dialogue.current && refermer()}
    >
      <div className={styles.contenu}>
        <header className={styles.entete}>
          <h2 id="titre-panier">Votre panier</h2>
          <button type="button" className={styles.fermer} onClick={refermer}>
            Fermer
          </button>
        </header>

        {bocaux.length === 0 ? (
          <div className={styles.vide}>
            <p>Aucun bocal pour l’instant.</p>
            <Link to="/composer" className={styles.lienAtelier} onClick={refermer}>
              Composer mon terrarium
            </Link>
          </div>
        ) : (
          <>
            <ul className={styles.bocaux}>
              {bocaux.map(({ id, composition }, index) => {
                const { titre, gravure, pieces } = resumerBocal(composition, CATALOGUE)
                return (
                  <li key={id} className={styles.bocal}>
                    <p className={styles.numero}>Spécimen n°{' '}{index + 1}</p>
                    <div className={styles.ligne}>
                      <h3>{titre}</h3>
                      <span className={styles.prix}>{formaterPrix(calculerTotal(composition, CATALOGUE))}</span>
                    </div>
                    {gravure && <p className={styles.gravure}>Gravé «{' '}{gravure}{' '}»</p>}
                    <p className={styles.pieces}>{pieces.length > 0 ? pieces.join(', ') : 'Sans pièce, la terre seule'}</p>
                    <button
                      type="button"
                      className={styles.retirer}
                      aria-label={`Retirer le spécimen n° ${index + 1}`}
                      onClick={() => retirer(id)}
                    >
                      Retirer
                    </button>
                  </li>
                )
              })}
            </ul>
            <footer className={styles.pied}>
              <p className={styles.total}>
                <span>Total</span>
                <strong>{formaterPrix(totalPanier(bocaux, CATALOGUE))}</strong>
              </p>
              <Link to="/panier" className={styles.commander} onClick={refermer}>
                Voir mon panier
              </Link>
            </footer>
          </>
        )}
      </div>
    </dialog>
  )
}

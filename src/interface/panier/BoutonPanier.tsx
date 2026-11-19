import { useInterface } from '../../etat/interface'
import { usePanier } from '../../etat/panier'
import styles from './Panier.module.css'

export function BoutonPanier({ className }: { className?: string }) {
  const nombre = usePanier((etat) => etat.bocaux.length)
  const ouvrir = useInterface((etat) => etat.ouvrirPanier)

  return (
    <button
      type="button"
      className={`${styles.bouton} ${className ?? ''}`}
      aria-label={nombre === 0 ? 'Panier, vide' : `Panier, ${nombre} ${nombre > 1 ? 'bocaux' : 'bocal'}`}
      aria-haspopup="dialog"
      onClick={ouvrir}
    >
      <span aria-hidden="true">Panier</span>
      <span className={styles.compte} aria-hidden="true" data-plein={nombre > 0}>
        {nombre}
      </span>
    </button>
  )
}

import { Link, NavLink } from 'react-router'
import { Logo } from './Logo'
import { BoutonPanier } from './panier/BoutonPanier'
import styles from './EnTete.module.css'

const LIENS = [
  { vers: '/a-propos', libelle: 'Le cabinet' },
  { vers: '/contact', libelle: 'Contact' },
] as const

/**
 * Deux liens, le panier et un bouton : un menu « hamburger » serait une complication inutile.
 * Sur mobile, la navigation passe simplement sur une seconde ligne.
 */
export function EnTete() {
  return (
    <header className={styles.entete}>
      <Link to="/" className={styles.marque}>
        <Logo variante="silhouette" className={styles.logo} />
        <span className={styles.nom}>Métamorphoses</span>
        <span className="visuellement-cache">, accueil</span>
      </Link>

      <nav aria-label="Navigation principale" className={styles.navigation}>
        <ul>
          {LIENS.map(({ vers, libelle }) => (
            <li key={vers}>
              <NavLink to={vers} className={styles.lien}>
                {libelle}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <BoutonPanier className={styles.panier} />

      <Link to="/composer" className={styles.appel}>
        Composer
      </Link>
    </header>
  )
}

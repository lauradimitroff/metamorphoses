import { useEffect, useRef } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import styles from './MiseEnPage.module.css'

const LIENS = [
  { vers: '/a-propos', libelle: 'Le cabinet' },
  { vers: '/contact', libelle: 'Contact' },
] as const

/**
 * Après une navigation, une application d'une seule page ne recharge rien :
 * le lecteur d'écran n'annonce pas la nouvelle page et le focus reste sur le lien cliqué.
 * On remonte donc en haut et on place le focus sur le titre de la nouvelle page.
 */
function useFocusApresNavigation() {
  const { pathname } = useLocation()
  const premierRendu = useRef(true)

  useEffect(() => {
    if (premierRendu.current) {
      premierRendu.current = false
      return
    }
    window.scrollTo(0, 0)
    // La page est chargée à la demande : on attend qu'elle soit affichée.
    const minuterie = window.setTimeout(() => {
      document.querySelector<HTMLElement>('[data-titre-page]')?.focus()
    }, 0)
    return () => window.clearTimeout(minuterie)
  }, [pathname])
}

export function MiseEnPage() {
  useFocusApresNavigation()

  return (
    <div className={styles.cadre}>
      <a className={styles.evitement} href="#contenu">
        Aller au contenu
      </a>

      <p className={styles.bandeau}>Boutique de démonstration — rien n’est vendu.</p>

      <header className={styles.entete}>
        <Link to="/" className={styles.marque} aria-label="Métamorphoses, accueil">
          Métamorphoses
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
          <Link to="/composer" className={styles.appel}>
            Composer
          </Link>
        </nav>
      </header>

      <main id="contenu" className={styles.contenu}>
        <Outlet />
      </main>

      <footer className={styles.pied}>
        <p className={styles.devise} lang="la">
          Vulnerant omnes, ultima necat
        </p>
        <ul className={styles.liensPied}>
          <li>
            <Link to="/credits">Registre des crédits</Link>
          </li>
          <li>
            <a href="https://laura-dimitroff.vercel.app/">Portfolio de Laura Dimitroff</a>
          </li>
        </ul>
        <p className={styles.mention}>
          Métamorphoses est une boutique imaginaire, conçue et développée par Laura Dimitroff. Rien n’y est vendu.
        </p>
      </footer>
    </div>
  )
}

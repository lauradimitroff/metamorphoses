import { Link } from 'react-router'
import { Logo } from './Logo'
import styles from './PiedDePage.module.css'

/** Filet double interrompu par un losange : le fleuron des anciens ouvrages imprimés. */
function Fleuron() {
  return (
    <svg className={styles.fleuron} viewBox="0 0 160 12" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth={0.75} fill="none">
        <path d="M0 5 H68 M0 7.5 H68 M92 5 H160 M92 7.5 H160" />
        <path d="M80 1 L86 6.25 L80 11.5 L74 6.25 Z" />
      </g>
      <circle cx={80} cy={6.25} r={1.2} fill="currentColor" />
    </svg>
  )
}

export function PiedDePage() {
  return (
    <footer className={styles.pied}>
      <Logo variante="gravure" className={styles.logo} />
      <p className={styles.devise}>
        <span lang="la">Vulnerant omnes, ultima necat</span>
        <span className={styles.traduction}>Toutes blessent, la dernière tue.</span>
      </p>
      <Fleuron />
      <nav aria-label="Liens secondaires">
        <ul className={styles.liens}>
          <li>
            <Link to="/a-propos">Le cabinet</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/credits">Registre des crédits</Link>
          </li>
          <li>
            <a
              href="https://laura-dimitroff.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Portfolio de Laura Dimitroff (nouvel onglet)"
            >
              Portfolio de Laura Dimitroff
              <span className={styles.fleche} aria-hidden="true">
                ↗
              </span>
            </a>
          </li>
        </ul>
      </nav>
      <p className={styles.mention}>
        Métamorphoses est une boutique imaginaire, conçue et développée par Laura Dimitroff. Rien n’y est vendu.
      </p>
    </footer>
  )
}

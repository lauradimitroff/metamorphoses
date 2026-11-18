import type { ReactNode } from 'react'
import { useTitrePage } from './useTitrePage'
import styles from './Page.module.css'

/**
 * Enveloppe commune des pages : elle fixe le titre de l'onglet et porte le titre
 * principal. Ce titre reçoit le focus après une navigation (voir MiseEnPage),
 * d'où `tabIndex={-1}` : focalisable par le code, mais absent du parcours au clavier.
 */
export function Page({
  titre,
  titreOnglet,
  surtitre,
  children,
}: {
  titre: ReactNode
  /** Nom de la page dans l'onglet ; absent pour l'accueil. */
  titreOnglet?: string
  surtitre?: string
  children?: ReactNode
}) {
  useTitrePage(titreOnglet)

  return (
    <article className={styles.page}>
      <header className={styles.entete}>
        {surtitre && <p className={styles.surtitre}>{surtitre}</p>}
        <h1 tabIndex={-1} className={styles.titre} data-titre-page>
          {titre}
        </h1>
      </header>
      {children}
    </article>
  )
}

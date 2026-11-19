import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import { EnTete } from './EnTete'
import { PanierLateral } from './panier/PanierLateral'
import { PiedDePage } from './PiedDePage'
import styles from './MiseEnPage.module.css'

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
      <EnTete />
      <main id="contenu" className={styles.contenu}>
        <Outlet />
      </main>
      <PiedDePage />
      <PanierLateral />
    </div>
  )
}

import { useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './Apparition.module.css'

/**
 * Fait apparaître son contenu quand il monte assez haut dans l'écran, et le fait disparaître
 * quand il en sort : l'effet se rejoue à chaque passage, dans les deux sens.
 * Avec `sobre`, le bloc ne s'anime pas : il signale seulement `data-visible` à ses enfants.
 */
export function Apparition({
  children,
  className,
  sobre = false,
}: {
  children: ReactNode
  className?: string
  sobre?: boolean
}) {
  const element = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!element.current) return
    const observateur = new IntersectionObserver(
      ([entree]) => setVisible(entree?.isIntersecting ?? false),
      // Le déclenchement attend que le bloc ait passé le quart bas de l'écran.
      { rootMargin: '0px 0px -25% 0px' },
    )
    observateur.observe(element.current)
    return () => observateur.disconnect()
  }, [])

  return (
    <div ref={element} className={`${sobre ? '' : styles.apparition} ${className ?? ''}`} data-visible={visible}>
      {children}
    </div>
  )
}

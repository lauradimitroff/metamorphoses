import { useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './Apparition.module.css'

/** Fait apparaître son contenu en douceur quand il entre à l'écran, une seule fois. */
export function Apparition({ children, className }: { children: ReactNode; className?: string }) {
  const element = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!element.current) return
    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (!entree?.isIntersecting) return
        setVisible(true)
        observateur.disconnect()
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    observateur.observe(element.current)
    return () => observateur.disconnect()
  }, [])

  return (
    <div ref={element} className={`${styles.apparition} ${className ?? ''}`} data-visible={visible}>
      {children}
    </div>
  )
}

const LARGEURS = [800, 1400] as const

/** Une photo d'ambiance : AVIF si possible, WebP sinon, à la taille adaptée à l'écran. */
export function Photo({
  nom,
  alt,
  largeur,
  hauteur,
  tailles,
  prioritaire = false,
  className,
}: {
  nom: string
  alt: string
  /** Proportions de l'image, pour réserver sa place avant le chargement. */
  largeur: number
  hauteur: number
  /** Largeur affichée, au format de l'attribut `sizes`. */
  tailles: string
  prioritaire?: boolean
  className?: string
}) {
  const jeu = (format: string) => LARGEURS.map((l) => `/photos/${nom}-${l}.${format} ${l}w`).join(', ')
  return (
    <picture>
      <source type="image/avif" srcSet={jeu('avif')} sizes={tailles} />
      <img
        className={className}
        src={`/photos/${nom}-800.webp`}
        srcSet={jeu('webp')}
        sizes={tailles}
        width={largeur}
        height={hauteur}
        alt={alt}
        loading={prioritaire ? 'eager' : 'lazy'}
        decoding="async"
      />
    </picture>
  )
}

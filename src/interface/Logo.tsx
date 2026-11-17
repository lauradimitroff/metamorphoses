import { useId } from 'react'

/*
 * Le papillon de Métamorphoses : ses ailes avant forment les deux pointes du M,
 * son corps se loge au creux, et ses ailes arrière descendent comme les jambages.
 * On ne dessine que l'aile droite ; l'aile gauche en est le reflet (symétrie
 * horizontale autour de x = 60).
 *
 * Deux variantes, d'un même contour :
 * - « gravure » : au trait, pour les grandes tailles (pied de page, accueil) ;
 * - « silhouette » : en aplat, lisible jusqu'à 16 px (en-tête mobile, icône d'onglet).
 *
 * Les couleurs suivent `currentColor` : le logo prend la couleur du texte qui l'entoure.
 */

// Aile avant : longue et pointue, son sommet forme une pointe du M.
const AILE_AVANT = 'M62 42 C70 30 86 16 98 12 C103 18 105 29 104 39 C92 44 76 48 63 51 Z'
// Aile arrière : plus courte et arrondie, elle descend comme un jambage du M.
const AILE_ARRIERE = 'M63 52 C78 50 94 52 98 61 C100 70 88 76 76 72 C70 69 65 62 63 56 Z'
const CONTOUR_AILE = `${AILE_AVANT} ${AILE_ARRIERE}`
const SEPARATION_AILES = 'M104 39 C92 44 76 48 63 51'
const NERVURES_FINES = 'M63 45 L94 17 M63 47 L101 26 M63 49 L103 36 M64 55 L94 62 M64 57 L84 71'
const NERVURES_EN_CREUX = 'M63 46 L96 17 M63 48.5 L102 32 M64 56 L92 64'
const ANTENNE = 'M60.5 33 C63 26 67 22 73 21 C75 21 75.5 23 74 24'
const MIROIR = 'translate(120 0) scale(-1 1)'

type Variante = 'gravure' | 'silhouette'

function AileGravee() {
  return (
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d={CONTOUR_AILE} strokeWidth={1.4} />
      <path d={SEPARATION_AILES} strokeWidth={1} />
      <path d={NERVURES_FINES} strokeWidth={0.6} />
      <circle cx={88} cy={28} r={3.2} strokeWidth={1} />
      <circle cx={88} cy={28} r={1.1} fill="currentColor" stroke="none" />
      <path d={ANTENNE} strokeWidth={0.9} />
    </g>
  )
}

/**
 * Les nervures « en creux » sont découpées dans l'aile grâce à un masque :
 * elles laissent voir le fond, quel qu'il soit, au lieu d'être peintes d'une couleur fixe.
 * Le masque est défini une seule fois ; l'aile reflétée s'en sert aussi, car il suit
 * le repère (et donc le reflet) de l'élément qui l'utilise.
 */
function MasqueSilhouette({ id }: { id: string }) {
  return (
    <mask id={id} maskUnits="userSpaceOnUse" x={0} y={0} width={120} height={90}>
      <path d={CONTOUR_AILE} fill="white" />
      <path d={`${SEPARATION_AILES} ${NERVURES_EN_CREUX}`} stroke="black" strokeWidth={1.3} strokeLinecap="round" fill="none" />
      <circle cx={88} cy={28} r={3.1} fill="black" />
      <circle cx={88} cy={28} r={1.3} fill="white" />
    </mask>
  )
}

function AileSilhouette({ masque }: { masque: string }) {
  return (
    <g>
      <rect x={60} y={0} width={60} height={90} fill="currentColor" mask={`url(#${masque})`} />
      <path d="M60.5 33 C63 26 67 22 73 21" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
    </g>
  )
}

export function Logo({
  variante,
  className,
  titre,
}: {
  variante: Variante
  className?: string
  /** Texte alternatif. Sans titre, le logo est décoratif et ignoré des lecteurs d'écran. */
  titre?: string
}) {
  // Chaque logo affiché a besoin d'un identifiant de masque unique dans la page.
  const masque = `aile-${useId().replaceAll(':', '')}`
  const aile = variante === 'gravure' ? <AileGravee /> : <AileSilhouette masque={masque} />
  const epaisseurCorps = variante === 'gravure' ? 2.6 : 3

  return (
    <svg
      viewBox="10 6 100 74"
      className={className}
      role={titre ? 'img' : undefined}
      aria-hidden={titre ? undefined : true}
      focusable="false"
    >
      {titre && <title>{titre}</title>}
      {variante === 'silhouette' && (
        <defs>
          <MasqueSilhouette id={masque} />
        </defs>
      )}
      {aile}
      <g transform={MIROIR}>{aile}</g>
      <ellipse cx={60} cy={50} rx={epaisseurCorps} ry={variante === 'gravure' ? 13 : 14} fill="currentColor" />
      <circle cx={60} cy={variante === 'gravure' ? 35 : 34.5} r={variante === 'gravure' ? 2.4 : 2.8} fill="currentColor" />
    </svg>
  )
}

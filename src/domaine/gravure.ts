/*
 * Règles de la gravure personnalisée (D11). La police de la gravure ne contient que
 * l'alphabet latin : tout autre caractère serait remplacé par un carré vide, ou
 * déclencherait le téléchargement d'une police de secours sur un serveur extérieur.
 */

const CARACTERES_REFUSES = /[^A-Za-zÀ-ÖØ-öø-ÿŒœ0-9 '’.,:;!?&()\-–—·]/gu

/** Pendant la saisie : retire les caractères impossibles et limite la longueur. */
export function filtrerSaisie(texte: string, longueurMax: number): string {
  return texte.replace(CARACTERES_REFUSES, '').slice(0, longueurMax)
}

/** Le texte réellement gravé, ou null s'il ne reste rien à graver. */
export function normaliserGravure(texte: string, longueurMax: number): string | null {
  const propre = texte
    .replace(CARACTERES_REFUSES, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, longueurMax)
    .trim()
    .replaceAll("'", '’')
  return propre === '' ? null : propre
}

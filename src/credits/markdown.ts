import type { Credit } from './registre.ts'
import { INTITULES_DES_NATURES, LICENCES, ORDRE_DES_NATURES } from './registre.ts'

/**
 * Produit le contenu de CREDITS.md à partir du registre.
 * Fonction pure : le script l'écrit sur disque, les tests la vérifient.
 */
export function genererMarkdown(registre: readonly Credit[], piecesOriginales: readonly string[]): string {
  const lignes: string[] = [
    '# Crédits',
    '',
    '> Fichier généré par `npm run credits` à partir de `src/credits/registre.ts`. Ne pas modifier à la main.',
    '',
    'Métamorphoses est une boutique imaginaire, conçue et développée par Laura Dimitroff.',
    '',
  ]

  for (const nature of ORDRE_DES_NATURES) {
    const credits = registre.filter((credit) => credit.nature === nature)
    if (credits.length === 0) continue

    lignes.push(`## ${INTITULES_DES_NATURES[nature]}`, '')
    for (const credit of credits) {
      lignes.push(`- **[${credit.titre}](${credit.source})** — ${credit.auteur} · ${credit.licence}`)
      if (credit.modifications) lignes.push(`  - Modifications : ${credit.modifications}`)
    }
    lignes.push('')
  }

  if (piecesOriginales.length > 0) {
    lignes.push(
      '## Pièces façonnées au cabinet',
      '',
      'Générées dans le code par Laura Dimitroff, sans ressource externe :',
      '',
      ...piecesOriginales.map((nom) => `- ${nom}`),
      '',
    )
  }

  const licencesUtilisees = [...new Set(registre.map((credit) => credit.licence))]
  lignes.push('## Licences', '')
  for (const licence of licencesUtilisees) {
    const { resume, lien } = LICENCES[licence]
    lignes.push(`- **[${licence}](${lien})** — ${resume}`)
  }

  return `${lignes.join('\n')}\n`
}

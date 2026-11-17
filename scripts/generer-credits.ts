/*
 * Génère CREDITS.md à partir du registre (src/credits/registre.ts).
 *
 *   npm run credits            écrit le fichier
 *   npm run credits:verifier   échoue si le fichier n'est plus à jour (utilisé par la CI)
 *
 * Node 24 exécute ce fichier TypeScript directement, en retirant les types :
 * d'où les extensions « .ts » explicites dans les imports ci-dessous.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { genererMarkdown } from '../src/credits/markdown.ts'
import { PIECES_ORIGINALES } from '../src/credits/pieces.ts'
import { REGISTRE } from '../src/credits/registre.ts'

const CHEMIN = join(import.meta.dirname, '..', 'CREDITS.md')
const attendu = genererMarkdown(REGISTRE, PIECES_ORIGINALES)

if (process.argv.includes('--verifier')) {
  const actuel = existsSync(CHEMIN) ? readFileSync(CHEMIN, 'utf8') : ''
  if (actuel !== attendu) {
    console.error('CREDITS.md n’est plus à jour avec le registre. Lancez « npm run credits » puis commitez le fichier.')
    process.exit(1)
  }
  console.log('CREDITS.md est à jour.')
} else {
  writeFileSync(CHEMIN, attendu)
  console.log('CREDITS.md généré.')
}

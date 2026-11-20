/*
 * Encode l'HDRI de l'atelier en JPEG Ultra HDR (voir scripts/hdri/encoder-navigateur.ts).
 * L'encodage se fait dans Chromium, piloté par Playwright, sur un serveur Vite lancé pour l'occasion.
 *
 *   node scripts/encoder-hdri.ts <fichier .hdr> [qualité JPEG, 0,85 par défaut]
 *
 * Le fichier .hdr original reste hors du dépôt ; le résultat va dans public/hdri/workshop.jpg.
 */
import { copyFileSync, mkdtempSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { chromium } from '@playwright/test'
import { createServer } from 'vite'

const PORT = 5199
const RACINE = join(import.meta.dirname, '..')
const SORTIE = join(RACINE, 'public', 'hdri', 'workshop.jpg')
const [hdr, qualite = '0.85'] = process.argv.slice(2)
if (!hdr) throw new Error('Indiquez le fichier .hdr à encoder.')

// Vite sert le fichier source depuis un dossier temporaire, à côté de la page outil.
const dossier = mkdtempSync(join(tmpdir(), 'hdri-'))
copyFileSync(hdr, join(dossier, 'source.hdr'))

const serveur = await createServer({
  root: RACINE,
  publicDir: dossier,
  logLevel: 'error',
  server: { port: PORT, strictPort: true },
  // Le module libultrahdr embarque du WebAssembly que le pré-assemblage de Vite casserait.
  optimizeDeps: { exclude: ['@monogrid/gainmap-js/libultrahdr'] },
})
await serveur.listen()
const navigateur = await chromium.launch()

try {
  const page = await navigateur.newPage()
  await page.goto(`http://localhost:${PORT}/scripts/hdri/encoder.html?source=/source.hdr&qualite=${qualite}`)
  const poignee = await page.waitForFunction(() => window.resultatEncodage, null, { timeout: 120_000 })
  const resultat = (await poignee.jsonValue()) as { base64: string } | { erreur: string }
  if ('erreur' in resultat) throw new Error(resultat.erreur)
  writeFileSync(SORTIE, Buffer.from(resultat.base64, 'base64'))
  console.log(`${SORTIE} : ${Math.round(statSync(SORTIE).size / 1024)} Ko`)
} finally {
  await navigateur.close()
  await serveur.close()
  rmSync(dossier, { recursive: true })
}

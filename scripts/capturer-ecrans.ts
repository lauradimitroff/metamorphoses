/*
 * Produit les captures d'écran du README (docs/captures/), sur la version de production.
 * À lancer après `npm run build`, sur une machine dotée d'un processeur graphique :
 * sans lui, Chromium dessine la 3D lentement et sans transmission fidèle du verre.
 *
 *   node scripts/capturer-ecrans.ts
 */
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { chromium, type Page } from '@playwright/test'
import sharp from 'sharp'
import { preview } from 'vite'

const PORT = 4176
const ADRESSE = `http://localhost:${PORT}`
const SORTIE = join(import.meta.dirname, '..', 'docs', 'captures')
const BUREAU = { width: 1440, height: 900 }
const TELEPHONE = { width: 390, height: 844 }

async function attendreScene(page: Page) {
  await page.locator('[data-termine="true"]').waitFor({ state: 'attached', timeout: 60_000 })
  // Le temps que l'écran d'attente s'efface et que les ombres se posent.
  await page.waitForTimeout(3500)
}

async function composerUnBocal(page: Page) {
  for (const nom of ['Petite fougère', 'Touffe de mousse', 'Touffe de mousse', 'Améthyste', 'Galets de rivière']) {
    await page.getByRole('button', { name: `Ajouter : ${nom}` }).click()
  }
  await page.getByRole('textbox', { name: /Quelques mots/ }).fill('Pour Charlotte')
  // Retour en haut, sans pièce sélectionnée : la capture montre l'atelier tel qu'on y arrive.
  await page.keyboard.press('Escape')
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    window.scrollTo(0, 0)
  })
}

/** Un clic sans défilement : Playwright, lui, fait défiler la page jusqu'au bouton avant de cliquer. */
async function cliquerSurPlace(page: Page, nom: string) {
  await page.getByRole('button', { name: nom }).evaluate((bouton: HTMLElement) => bouton.click())
}

async function enregistrer(page: Page, nom: string) {
  const image = await page.screenshot()
  const { size } = await sharp(image).webp({ quality: 82 }).toFile(join(SORTIE, `${nom}.webp`))
  console.log(`${nom}.webp : ${Math.round(size / 1024)} Ko`)
}

mkdirSync(SORTIE, { recursive: true })
const serveur = await preview({ logLevel: 'error', preview: { port: PORT, strictPort: true } })
const navigateur = await chromium.launch({ args: ['--ignore-gpu-blocklist', '--enable-gpu'] })

try {
  const bureau = await navigateur.newPage({ viewport: BUREAU, deviceScaleFactor: 1 })

  await bureau.goto(ADRESSE)
  await attendreScene(bureau)
  await enregistrer(bureau, 'accueil')

  await bureau.goto(`${ADRESSE}/composer`)
  await composerUnBocal(bureau)
  await attendreScene(bureau)
  await enregistrer(bureau, 'atelier-jour')
  await cliquerSurPlace(bureau, 'Attendre la nuit')
  await bureau.waitForTimeout(4000)
  await enregistrer(bureau, 'atelier-nuit')

  await bureau.getByRole('button', { name: 'Ajouter au panier' }).click()
  await bureau.getByRole('link', { name: 'Voir mon panier' }).click()
  await bureau.getByRole('heading', { level: 1, name: 'Votre panier' }).waitFor()
  await bureau.waitForTimeout(800)
  await enregistrer(bureau, 'panier')

  await bureau.goto(`${ADRESSE}/a-propos`)
  await bureau.waitForTimeout(1500)
  await enregistrer(bureau, 'cabinet')

  const telephone = await navigateur.newPage({ viewport: TELEPHONE, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await telephone.goto(`${ADRESSE}/composer`)
  await attendreScene(telephone)
  await telephone.getByRole('button', { name: 'Choisir les pièces' }).click()
  for (const nom of ['Petite fougère', 'Touffe de mousse', 'Améthyste']) await cliquerSurPlace(telephone, `Ajouter : ${nom}`)
  // Le tiroir montré depuis son début, l'atelier calé en haut de l'écran comme après l'ouverture.
  await telephone.evaluate(() => {
    document.getElementById('corps-atelier')?.scrollTo(0, 0)
    document.querySelector('[data-tiroir]')?.scrollIntoView({ block: 'start' })
  })
  await telephone.waitForTimeout(2500)
  await enregistrer(telephone, 'atelier-telephone')
} finally {
  await navigateur.close()
  await new Promise<void>((fin) => serveur.httpServer.close(() => fin()))
}

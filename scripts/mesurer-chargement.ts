/*
 * Mesure le temps d'affichage de la scène de l'atelier sur une connexion 4G simulée.
 * À lancer après `npm run build` : la mesure porte sur la version de production (vite preview).
 *
 *   node scripts/mesurer-chargement.ts
 *
 * « Scène prête » : l'écran d'attente annonce la fin des chargements (data-termine="true").
 * Chaque mesure part d'un navigateur au cache vide. Chromium utilise le processeur graphique
 * de la machine : les chiffres valent pour un ordinateur, le réseau seul étant bridé.
 */
import { chromium, type Page } from '@playwright/test'
import { preview } from 'vite'

const PORT = 4174
const ADRESSE = `http://localhost:${PORT}`

// Les réglages « Fast 4G » et « Slow 4G » des outils de développement de Chrome.
const RESEAUX = [
  { nom: '4G rapide', debitKbits: 9000, latenceMs: 165 },
  { nom: '4G lente', debitKbits: 1600, latenceMs: 562 },
]

const PARCOURS = [
  {
    nom: 'Arrivée directe sur /composer',
    lancer: (page: Page) => page.goto(`${ADRESSE}/composer`),
  },
  {
    nom: 'Depuis « Le cabinet », survol puis clic sur « Composer »',
    preparer: async (page: Page) => {
      await page.goto(`${ADRESSE}/a-propos`)
      await page.waitForLoadState('networkidle')
    },
    lancer: async (page: Page) => {
      const lien = page.getByRole('banner').getByRole('link', { name: 'Composer' })
      await lien.hover()
      // Le temps qu'une main aille du survol au clic.
      await page.waitForTimeout(400)
      await lien.click()
    },
  },
]

const serveur = await preview({ logLevel: 'error', preview: { port: PORT, strictPort: true } })
const navigateur = await chromium.launch({ args: ['--ignore-gpu-blocklist', '--enable-gpu'] })

try {
  for (const reseau of RESEAUX) {
    for (const parcours of PARCOURS) {
      const contexte = await navigateur.newContext({ viewport: { width: 1440, height: 900 } })
      const page = await contexte.newPage()
      const cdp = await contexte.newCDPSession(page)
      await cdp.send('Network.enable')
      await cdp.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: reseau.latenceMs,
        downloadThroughput: (reseau.debitKbits * 1000) / 8,
        uploadThroughput: (reseau.debitKbits * 1000) / 8 / 4,
      })
      await parcours.preparer?.(page)
      const debut = performance.now()
      await parcours.lancer(page)
      await page.locator('[data-termine="true"]').waitFor({ state: 'attached', timeout: 90_000 })
      const secondes = (performance.now() - debut) / 1000
      const octets = await page.evaluate(() =>
        performance.getEntriesByType('resource').reduce((total, entree) => total + (entree as PerformanceResourceTiming).transferSize, 0),
      )
      console.log(`${reseau.nom} · ${parcours.nom} : ${secondes.toFixed(2)} s (${Math.round(octets / 1024)} Ko transférés)`)
      await contexte.close()
    }
  }
} finally {
  await navigateur.close()
  await new Promise<void>((fin) => serveur.httpServer.close(() => fin()))
}

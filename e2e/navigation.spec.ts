import { expect, test } from '@playwright/test'
import { desactiverWebgl } from './outils.ts'

test.beforeEach(({ page }) => desactiverWebgl(page))

const PAGES = [
  { chemin: '/', titre: 'Un jardin sous verre', onglet: 'Métamorphoses — Cabinet de terrariums à composer' },
  { chemin: '/composer', titre: 'Composer un terrarium', onglet: 'Composer — Métamorphoses' },
  { chemin: '/a-propos', titre: 'Le registre d’Hortense', onglet: 'Le cabinet — Métamorphoses' },
  { chemin: '/contact', titre: 'Écrire au cabinet', onglet: 'Contact — Métamorphoses' },
  { chemin: '/credits', titre: 'Registre d’inventaire', onglet: 'Registre des crédits — Métamorphoses' },
] as const

for (const { chemin, titre, onglet } of PAGES) {
  test(`la page ${chemin} s’affiche avec son titre et la mention de démonstration`, async ({ page }) => {
    await page.goto(chemin)
    await expect(page.getByRole('heading', { level: 1, name: titre })).toBeVisible()
    await expect(page).toHaveTitle(onglet)
    await expect(page.getByText('Boutique de démonstration — rien n’est vendu.')).toBeVisible()
  })
}

test('une adresse inconnue affiche la page introuvable', async ({ page }) => {
  await page.goto('/un-specimen-perdu')
  await expect(page.getByRole('heading', { level: 1, name: 'Ce spécimen n’existe pas' })).toBeVisible()
})

test('le lien d’évitement apparaît au clavier et mène au contenu', async ({ page }) => {
  await page.goto('/a-propos')
  // La page est chargée à la demande : on attend qu'elle soit affichée avant d'appuyer sur Tab.
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.keyboard.press('Tab')
  const evitement = page.getByRole('link', { name: 'Aller au contenu' })
  await expect(evitement).toBeFocused()
  await expect(evitement).toBeInViewport()
})

test('après une navigation, le focus est placé sur le titre de la nouvelle page', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('navigation', { name: 'Navigation principale' }).getByRole('link', { name: 'Contact' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Écrire au cabinet' })).toBeFocused()
})

test('l’accueil présente le parcours et mène à l’atelier', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Comment naît un spécimen' })).toBeVisible()
  await expect(page.getByRole('img', { name: /champignons/i }).first()).toBeVisible()
  await page.getByRole('main').getByRole('link', { name: 'Composer mon terrarium' }).first().click()
  await expect(page).toHaveURL(/\/composer$/)
})

test('le registre d’Hortense signale sa fiction et mène à l’atelier', async ({ page }) => {
  await page.goto('/a-propos')
  await expect(page.getByText(/sont imaginaires/)).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Une fougère que personne n’a semée' })).toBeVisible()
  await page.getByRole('main').getByRole('link', { name: 'Composer mon terrarium' }).click()
  await expect(page).toHaveURL(/\/composer$/)
})

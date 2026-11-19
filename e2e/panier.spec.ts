import { expect, test } from '@playwright/test'
import { desactiverWebgl } from './outils.ts'

test.beforeEach(({ page }) => desactiverWebgl(page))

test('du bocal composé à la commande validée, en passant par la page panier', async ({ page }) => {
  await page.goto('/composer')
  const panier = page.getByRole('button', { name: /^Panier/ })
  await expect(panier).toHaveAccessibleName('Panier, vide')

  await page.getByRole('button', { name: 'Ajouter : Touffe de mousse' }).click()
  await page.getByRole('textbox', { name: /Quelques mots/ }).fill('Pour Charlotte')
  await page.getByRole('button', { name: 'Ajouter au panier' }).click()

  const apercu = page.getByRole('dialog', { name: 'Votre panier' })
  await expect(apercu).toContainText('Gravé « Pour Charlotte »')
  await expect(apercu).toContainText('63,00')
  await page.keyboard.press('Escape')
  await expect(panier).toHaveAccessibleName('Panier, 1 bocal')

  // Le panier survit au rechargement.
  await page.reload()
  await page.getByRole('button', { name: 'Panier, 1 bocal' }).click()
  await page.getByRole('link', { name: 'Voir mon panier' }).click()
  await expect(page).toHaveURL(/\/panier$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Votre panier' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Votre bocal' })).toContainText('Touffe de mousse')

  await page.getByRole('button', { name: 'Valider la commande' }).click()
  await expect(page.getByRole('heading', { name: 'Votre commande est consignée au registre' })).toBeFocused()
  await expect(page.getByText(/Commande n°\s\d{4}/)).toBeVisible()
  await expect(page.getByText(/aucun paiement n’a eu lieu/)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Panier, vide' })).toBeVisible()
})

test('un bocal se retire du panier, et le panier vide invite à composer', async ({ page }) => {
  await page.goto('/composer')
  await page.getByRole('button', { name: 'Ajouter au panier' }).click()
  await page.getByRole('link', { name: 'Voir mon panier' }).click()
  await expect(page).toHaveURL(/\/panier$/)
  await page.getByRole('main').getByRole('button', { name: 'Retirer le spécimen n° 1' }).click()
  await expect(page.getByText('Aucun bocal n’attend encore sur le comptoir.')).toBeVisible()
})

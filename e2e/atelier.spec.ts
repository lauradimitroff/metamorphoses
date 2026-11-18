import { expect, test } from '@playwright/test'
import { desactiverWebgl } from './outils.ts'

test.beforeEach(({ page }) => desactiverWebgl(page))

test('sans WebGL, un message remplace la scène et l’atelier reste utilisable', async ({ page }) => {
  await page.goto('/composer')
  await expect(page.getByText(/ne peut pas éclairer le cabinet/)).toBeVisible()
  await expect(page.locator('canvas')).toHaveCount(0)
  await page.getByRole('button', { name: 'Ajouter : Améthyste' }).click()
  await expect(page.getByTestId('description-scene')).toContainText('une améthyste')
})

test('composer un terrarium met à jour le prix, la jauge et la description', async ({ page }) => {
  await page.goto('/composer')
  const description = page.getByTestId('description-scene')
  const total = page.getByText('Total').locator('..')
  await expect(description).toHaveText('Bocal en verre clair, encore vide.')
  await expect(total).toContainText('54,00')

  await page.getByRole('button', { name: 'Ajouter : Petite fougère' }).click()
  await page.getByRole('button', { name: 'Ajouter : Touffe de mousse' }).click()
  await expect(description).toContainText('Au centre, une fougère.')
  await expect(total).toContainText('65,00')
  await expect(page.getByRole('meter', { name: 'Place occupée' })).not.toHaveAttribute('aria-valuenow', '0')

  await page.getByRole('button', { name: 'Retirer : Touffe de mousse' }).click()
  await expect(total).toContainText('62,00')

  await page.getByRole('radio', { name: /Verre ambré/ }).check({ force: true })
  await expect(total).toContainText('72,00')
})

test('la gravure personnalisée s’ajoute au prix et à la description', async ({ page }) => {
  await page.goto('/composer')
  const champ = page.getByRole('textbox', { name: /Quelques mots gravés/ })
  await champ.fill('Pour Charlotte 🌿')
  await expect(champ).toHaveValue('Pour Charlotte ')
  await expect(page.getByTestId('description-scene')).toContainText('gravé « Pour Charlotte »')
  await expect(page.getByText('Gravure personnalisée')).toBeVisible()
  await champ.fill('')
  await expect(page.getByText('Gravure personnalisée')).toBeHidden()
})

test('un message prévient quand le bocal n’a plus de place', async ({ page }) => {
  await page.goto('/composer')
  const ajouter = page.getByRole('button', { name: 'Ajouter : Petite fougère' })
  for (let i = 0; i < 8; i++) await ajouter.click()
  await expect(page.getByRole('status').filter({ hasText: 'Plus de place pour une fougère' })).toBeVisible()
})

test('un bouton bascule entre la vue de face et la vue du dessus', async ({ page }) => {
  await page.goto('/composer')
  await page.getByRole('button', { name: 'Voir du dessus' }).click()
  await page.getByRole('button', { name: 'Revenir de face' }).click()
  await expect(page.getByRole('button', { name: 'Voir du dessus' })).toBeVisible()
})

test('la provenance d’un élément s’affiche à la demande', async ({ page }) => {
  await page.goto('/composer')
  await expect(page.getByText('Quaternius')).toBeHidden()
  await page.getByRole('button', { name: 'Provenance : Petite fougère' }).click()
  await expect(page.getByText(/Quaternius · CC0/)).toBeVisible()
})

test('au clavier, on sélectionne, déplace, tourne et retire une pièce', async ({ page }) => {
  await page.goto('/composer')
  await page.getByRole('button', { name: 'Ajouter : Améthyste' }).click()
  const piece = page.getByRole('button', { name: /^Améthyste/ })
  await piece.focus()
  await expect(piece).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('group', { name: /Pièce sélectionnée/ })).toBeVisible()
  await expect(piece).toContainText('au centre')

  for (let i = 0; i < 12; i++) await page.keyboard.press('ArrowRight')
  await expect(piece).toContainText('à droite')
  await expect(page.getByTestId('description-scene')).toContainText('À droite, une améthyste.')
  await page.keyboard.press('r')
  await page.keyboard.press('Escape')
  await expect(piece).toHaveAttribute('aria-pressed', 'false')

  await page.keyboard.press('Delete')
  await expect(page.getByText('Le bocal attend sa première pièce.')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Dans le bocal' })).toBeFocused()
})

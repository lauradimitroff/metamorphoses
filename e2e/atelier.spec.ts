import { expect, test } from '@playwright/test'

/*
 * Ces tests vérifient l'interface et les règles, pas l'image. Sans carte graphique
 * (comme en CI), le rendu logiciel de la scène sature le navigateur : on la désactive,
 * ce qui vérifie au passage le repli sans WebGL.
 */
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...reste: unknown[]) {
      if (type.includes('webgl')) return null
      return Reflect.apply(original, this, [type, ...reste])
    } as typeof HTMLCanvasElement.prototype.getContext
  })
})

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

test('la provenance d’un élément s’affiche à la demande', async ({ page }) => {
  await page.goto('/composer')
  await expect(page.getByText('Quaternius')).toBeHidden()
  await page.getByRole('button', { name: 'Provenance : Petite fougère' }).click()
  await expect(page.getByText(/Quaternius · CC0/)).toBeVisible()
})

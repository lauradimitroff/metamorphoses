import { expect, test } from '@playwright/test'

test('un envoi incomplet signale les erreurs et place le focus sur la première', async ({ page }) => {
  await page.goto('/contact')
  await page.getByRole('button', { name: 'Confier au cabinet' }).click()
  const nom = page.getByRole('textbox', { name: 'Votre nom' })
  await expect(nom).toBeFocused()
  await expect(nom).toHaveAttribute('aria-invalid', 'true')
  await expect(nom).toHaveAccessibleDescription('Indiquez votre nom.')
  await nom.fill('Charlotte')
  await expect(page.getByText('Indiquez votre nom.')).toBeHidden()
})

test('un envoi valide confirme que rien n’est parti', async ({ page }) => {
  const requetes: string[] = []
  await page.goto('/contact')
  page.on('request', (requete) => {
    if (requete.method() !== 'GET') requetes.push(requete.url())
  })
  await page.getByRole('textbox', { name: 'Votre nom' }).fill('Charlotte')
  await page.getByRole('textbox', { name: 'Votre adresse électronique' }).fill('charlotte@exemple.fr')
  await page.getByRole('combobox', { name: 'L’objet de votre lettre' }).selectOption('Une composition')
  await page.getByRole('textbox', { name: 'Votre message' }).fill('Un bocal pour une amie.')
  await page.keyboard.press('Tab')
  await page.getByRole('button', { name: 'Confier au cabinet' }).click()
  await expect(page.getByRole('heading', { name: /bien arrivée/ })).toBeFocused()
  await expect(page.getByText(/votre message n’a pas été envoyé/)).toBeVisible()
  expect(requetes).toEqual([])
  await page.getByRole('button', { name: 'Écrire une autre lettre' }).click()
  await expect(page.getByRole('textbox', { name: 'Votre nom' })).toHaveValue('')
})

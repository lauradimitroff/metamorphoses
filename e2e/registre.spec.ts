import { expect, test } from '@playwright/test'

test('le registre consigne chaque ressource avec son numéro, son auteur et sa licence', async ({ page }) => {
  await page.goto('/credits')
  await expect(page.getByRole('heading', { level: 1, name: 'Registre d’inventaire' })).toBeVisible()

  const modeles = page.getByRole('region', { name: 'Modèles 3D' })
  const fougere = modeles.getByRole('link', { name: 'Fern, page d’origine (nouvel onglet)' })
  await expect(fougere).toHaveAttribute('href', 'https://poly.pizza/m/jqcanvH7D6')
  await expect(fougere).toHaveAttribute('target', '_blank')
  await expect(modeles.getByText('Quaternius')).toBeVisible()
  await expect(modeles.getByText('N° 001')).toBeVisible()

  await expect(page.getByRole('region', { name: 'Pièces façonnées au cabinet' }).getByText('Améthyste')).toBeVisible()
  await expect(page.getByRole('region', { name: 'Les licences' }).getByRole('link', { name: 'CC0' })).toBeVisible()
})

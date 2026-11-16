export const NOM_DU_SITE = 'Métamorphoses'

/** Titre de l'onglet : le nom de la page d'abord, pour qu'il reste lisible dans un onglet étroit. */
export function formaterTitre(page?: string): string {
  const nom = page?.trim()
  return nom ? `${nom} — ${NOM_DU_SITE}` : `${NOM_DU_SITE} — Cabinet de terrariums à composer`
}

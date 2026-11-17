import { LISTE_ELEMENTS } from '../catalogue/catalogue.ts'

/**
 * Les pièces façonnées au cabinet : tout ce qui est créé dans le code, sans ressource
 * externe. Partagé par la page /credits et par CREDITS.md, pour qu'ils restent identiques.
 */
export const PIECES_ORIGINALES: readonly string[] = [
  'Le bocal, en verre clair et en verre ambré',
  ...LISTE_ELEMENTS.filter((element) => element.creditIds.length === 0).map((element) => element.nom),
  'Le logo au papillon de nuit',
]

import type { DefinitionChaudron, DefinitionElement, ElementId, FamilleId } from '../domaine/types'

/*
 * Les données du catalogue. Ajouter un élément revient à ajouter une entrée ici,
 * puis son générateur 3D. Les rayons d'encombrement sont provisoires : ils seront
 * ajustés à l'écran quand chaque élément aura sa forme définitive (étape 2b).
 */

export const CHAUDRON: DefinitionChaudron = {
  rayonSol: 0.605,
  hauteurSol: 0.76,
  matieres: {
    fonte: { nom: 'Fonte', prixCentimes: 5400 },
    cuivre: { nom: 'Cuivre', prixCentimes: 6400 },
  },
}

export const FAMILLES: ReadonlyArray<{ id: FamilleId; nom: string }> = [
  { id: 'vegetal', nom: 'Végétal' },
  { id: 'mineral', nom: 'Minéral' },
  { id: 'champignons', nom: 'Champignons' },
]

export const ELEMENTS: Readonly<Record<ElementId, DefinitionElement>> = {
  mousse: {
    id: 'mousse',
    nom: 'Touffe de mousse',
    description: 'Un coussin vert et dense, qui garde l’humidité du sol.',
    famille: 'vegetal',
    prixCentimes: 300,
    rayonEncombrement: 0.09,
    creditIds: [],
  },
  fougere: {
    id: 'fougere',
    nom: 'Petite fougère',
    description: 'Ses frondes se déploient en éventail au-dessus de la mousse.',
    famille: 'vegetal',
    prixCentimes: 800,
    rayonEncombrement: 0.2,
    creditIds: ['modele-fougere'],
  },
  galets: {
    id: 'galets',
    nom: 'Galets de rivière',
    description: 'Trois pierres polies par l’eau, aux teintes de schiste.',
    famille: 'mineral',
    prixCentimes: 200,
    rayonEncombrement: 0.08,
    creditIds: [],
  },
  amethyste: {
    id: 'amethyste',
    nom: 'Améthyste',
    description: 'Une pointe de quartz violet, qui retient la lumière de la bougie.',
    famille: 'mineral',
    prixCentimes: 1200,
    rayonEncombrement: 0.11,
    creditIds: [],
  },
  'champignons-luminescents': {
    id: 'champignons-luminescents',
    nom: 'Champignons luminescents',
    description: 'Trois chapeaux pâles le jour, qui s’éveillent d’une lueur verte à la nuit tombée.',
    famille: 'champignons',
    prixCentimes: 700,
    rayonEncombrement: 0.1,
    creditIds: [],
  },
}

/** Les éléments dans l'ordre d'affichage du catalogue. */
export const LISTE_ELEMENTS: readonly DefinitionElement[] = Object.values(ELEMENTS)

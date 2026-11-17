/*
 * Vocabulaire du domaine. Les identifiants sont des types littéraux :
 * une faute de frappe ('fougerre') devient une erreur de compilation, et ajouter
 * un élément en V2 fait signaler par TypeScript tous les endroits à compléter.
 */

export type MatiereId = 'verre-clair' | 'verre-ambre'

export type FamilleId = 'vegetal' | 'mineral' | 'champignons'

export type ElementId = 'mousse' | 'fougere' | 'galets' | 'amethyste' | 'champignons-luminescents'

export interface DefinitionBocal {
  /** Rayon du disque de sol, en unités de scène. */
  rayonSol: number
  /** Hauteur du sol dans le repère du bocal. */
  hauteurSol: number
  matieres: Readonly<Record<MatiereId, { nom: string; prixCentimes: number }>>
}

/** Comment nommer l'élément dans une phrase : « une fougère », « trois touffes de mousse ». */
export interface Appellation {
  singulier: string
  pluriel: string
  genre: 'masculin' | 'feminin'
}

export interface DefinitionElement {
  id: ElementId
  nom: string
  appellation: Appellation
  /** Courte phrase pour la fiche du catalogue, dans la voix du cabinet. */
  description: string
  famille: FamilleId
  /** Prix en centimes, toujours un entier (D4). */
  prixCentimes: number
  /** Rayon du cercle occupé au sol, en unités de scène (D1). */
  rayonEncombrement: number
  /** Ressources externes utilisées. Vide pour un élément entièrement généré dans le code. */
  creditIds: readonly string[]
}

/** Le catalogue est passé en paramètre aux règles : on peut ainsi les tester avec des données inventées. */
export interface Catalogue {
  bocal: DefinitionBocal
  elements: Readonly<Record<ElementId, DefinitionElement>>
}

export interface ElementPose {
  /** Identifiant unique de cette pose : deux mousses ont deux uid différents. */
  uid: string
  elementId: ElementId
  /** Position au sol, en millièmes d'unité de scène (entier). */
  x: number
  z: number
  /** Rotation en crans de 15° : de 0 à 23. */
  rotation: number
}

export interface Composition {
  matiere: MatiereId
  elements: readonly ElementPose[]
}

export type Moment = 'jour' | 'nuit'
export type Hdri = 'workshop' | 'vestibule' | 'moon_lab'
export type Matiere = 'fonte' | 'cuivre'

/**
 * État de l'ambiance, lu à chaque image par les objets de la scène.
 * On le garde dans une ref (et non dans un état React) : il change 60 fois
 * par seconde pendant la transition, et un rendu React à chaque image
 * serait inutilement coûteux.
 */
export interface Ambiance {
  /** Avancement linéaire de la transition, de 0 (jour) à 1 (nuit). */
  progression: number
  /** Même valeur adoucie par une courbe : c'est elle qu'on utilise pour doser les lumières. */
  nuit: number
}

export const HDRIS: ReadonlyArray<{ id: Hdri; nom: string }> = [
  { id: 'workshop', nom: 'Atelier' },
  { id: 'vestibule', nom: 'Vestibule' },
  { id: 'moon_lab', nom: 'Laboratoire' },
]

export const MATIERES: ReadonlyArray<{ id: Matiere; nom: string }> = [
  { id: 'fonte', nom: 'Fonte' },
  { id: 'cuivre', nom: 'Cuivre' },
]

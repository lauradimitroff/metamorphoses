import { createContext, useContext, type RefObject } from 'react'

export type Moment = 'jour' | 'nuit'

/**
 * État de l'ambiance, lu à chaque image par les objets de la scène.
 * On le garde dans une ref (et non dans un état React) : il change 60 fois
 * par seconde pendant la transition, et un rendu React à chaque image
 * serait inutilement coûteux.
 */
export interface Ambiance {
  /** Avancement linéaire de la transition, de 0 (jour) à 1 (nuit). */
  progression: number
  /** Même valeur adoucie par une courbe en S : c'est elle qui dose les lumières. */
  nuit: number
}

export const AmbianceContexte = createContext<RefObject<Ambiance> | null>(null)

/** L'ambiance partagée par la Vitrine. À n'utiliser qu'à l'intérieur de celle-ci. */
export function useAmbiance(): RefObject<Ambiance> {
  const ambiance = useContext(AmbianceContexte)
  if (!ambiance) throw new Error('useAmbiance doit être utilisé à l’intérieur de <Vitrine>.')
  return ambiance
}

/** Couleurs de la scène : les mêmes que les jetons CSS (src/styles/jetons.css). */
export const COULEURS = {
  encreDeNuit: '#12161a',
  laiton: '#b89b5e',
  lueur: '#9fe3c9',
  velin: '#e9dfc8',
} as const

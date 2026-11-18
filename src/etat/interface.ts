import { create } from 'zustand'
import type { Moment } from '../scene/ambiance'

interface EtatInterface {
  moment: Moment
  couvercleOuvert: boolean
  /** Message d'information de l'atelier, ou null. */
  message: string | null
  basculerMoment: () => void
  basculerCouvercle: () => void
  afficherMessage: (message: string | null) => void
}

/** Ce qui concerne l'affichage de l'atelier, et non le terrarium lui-même. */
export const useInterface = create<EtatInterface>((set) => ({
  moment: 'jour',
  // On compose bocal ouvert : le couvercle attend sur la table.
  couvercleOuvert: true,
  message: null,
  basculerMoment: () => set(({ moment }) => ({ moment: moment === 'jour' ? 'nuit' : 'jour' })),
  basculerCouvercle: () => set(({ couvercleOuvert }) => ({ couvercleOuvert: !couvercleOuvert })),
  afficherMessage: (message) => set({ message }),
}))

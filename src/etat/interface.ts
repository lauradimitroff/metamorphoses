import { create } from 'zustand'
import type { Moment } from '../scene/ambiance'
import type { DemandeVue } from '../scene/PiloteCamera'

interface EtatInterface {
  moment: Moment
  couvercleOuvert: boolean
  demandeVue: DemandeVue | null
  /** Message d'information de l'atelier, ou null. */
  message: string | null
  basculerMoment: () => void
  basculerCouvercle: () => void
  basculerVue: () => void
  afficherMessage: (message: string | null) => void
}

/** Ce qui concerne l'affichage de l'atelier, et non le terrarium lui-même. */
export const useInterface = create<EtatInterface>((set) => ({
  moment: 'jour',
  // On compose bocal ouvert : le couvercle attend sur la table.
  couvercleOuvert: true,
  demandeVue: null,
  message: null,
  basculerMoment: () => set(({ moment }) => ({ moment: moment === 'jour' ? 'nuit' : 'jour' })),
  basculerCouvercle: () => set(({ couvercleOuvert }) => ({ couvercleOuvert: !couvercleOuvert })),
  basculerVue: () =>
    set(({ demandeVue, couvercleOuvert }) => {
      const vue = demandeVue?.vue === 'dessus' ? 'face' : 'dessus'
      return {
        demandeVue: { vue, numero: (demandeVue?.numero ?? 0) + 1 },
        // Vu du dessus, un couvercle fermé cacherait tout l'intérieur.
        couvercleOuvert: vue === 'dessus' ? true : couvercleOuvert,
      }
    }),
  afficherMessage: (message) => set({ message }),
}))

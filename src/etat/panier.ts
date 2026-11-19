import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import { CATALOGUE } from '../catalogue/catalogue'
import { lirePanier, type BocalAuPanier } from '../domaine/panier'
import type { Composition } from '../domaine/types'

interface EtatPanier {
  bocaux: BocalAuPanier[]
  ajouter: (composition: Composition) => void
  retirer: (id: string) => void
  vider: () => void
}

/**
 * Le stockage du navigateur peut être indisponible (navigation privée, réglages) :
 * dans ce cas, le panier fonctionne quand même, mais ne survit pas au rechargement.
 */
const stockageSur: StateStorage = {
  getItem: (cle) => {
    try {
      return globalThis.localStorage?.getItem(cle) ?? null
    } catch {
      return null
    }
  },
  setItem: (cle, valeur) => {
    try {
      globalThis.localStorage?.setItem(cle, valeur)
    } catch {
      // Stockage plein ou interdit : on garde le panier en mémoire.
    }
  },
  removeItem: (cle) => {
    try {
      globalThis.localStorage?.removeItem(cle)
    } catch {
      // Rien à faire.
    }
  },
}

let compteur = 0
const nouvelId = () => `bocal-${Date.now().toString(36)}-${(compteur++).toString(36)}`

/** Le panier, conservé dans ce navigateur seulement : rien ne part sur un serveur. */
export const usePanier = create<EtatPanier>()(
  persist(
    (set) => ({
      bocaux: [],
      ajouter: (composition) => set(({ bocaux }) => ({ bocaux: [...bocaux, { id: nouvelId(), composition }] })),
      retirer: (id) => set(({ bocaux }) => ({ bocaux: bocaux.filter((bocal) => bocal.id !== id) })),
      vider: () => set({ bocaux: [] }),
    }),
    {
      name: 'metamorphoses-panier',
      version: 1,
      storage: createJSONStorage(() => stockageSur),
      partialize: ({ bocaux }) => ({ bocaux }),
      // Ce qui revient du stockage est relu par le domaine avant d'être utilisé.
      merge: (enregistre, actuel) => ({
        ...actuel,
        bocaux: lirePanier((enregistre as { bocaux?: unknown } | undefined)?.bocaux, CATALOGUE),
      }),
    },
  ),
)

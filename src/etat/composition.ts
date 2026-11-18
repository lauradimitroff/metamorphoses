import { create } from 'zustand'
import { CATALOGUE } from '../catalogue/catalogue'
import { trouverPlaceLibre } from '../domaine/encombrement'
import { normaliserGravure } from '../domaine/gravure'
import type { Composition, ElementId, MatiereId } from '../domaine/types'

interface EtatComposition {
  composition: Composition
  choisirMatiere: (matiere: MatiereId) => void
  /** Dépose l'élément sur une place libre. Renvoie false s'il n'y en a pas. */
  ajouter: (elementId: ElementId) => boolean
  /** Retire le dernier élément de ce type qui a été posé. */
  retirerUn: (elementId: ElementId) => void
  graver: (texte: string) => void
}

export const COMPOSITION_VIDE: Composition = { matiere: 'verre-clair', elements: [], gravure: null }

let prochainUid = 1

/**
 * La composition en cours, partagée par le panneau et la scène 3D.
 * Chaque action passe par les règles du domaine : l'état reste toujours valide.
 */
export const useComposition = create<EtatComposition>((set, get) => ({
  composition: COMPOSITION_VIDE,

  choisirMatiere: (matiere) => set(({ composition }) => ({ composition: { ...composition, matiere } })),

  ajouter: (elementId) => {
    const { composition } = get()
    const place = trouverPlaceLibre(composition, elementId, CATALOGUE)
    if (!place) return false
    const pose = { uid: `element-${prochainUid++}`, elementId, ...place, rotation: 0 }
    set({ composition: { ...composition, elements: [...composition.elements, pose] } })
    return true
  },

  retirerUn: (elementId) =>
    set(({ composition }) => {
      const dernier = composition.elements.findLast((pose) => pose.elementId === elementId)
      if (!dernier) return { composition }
      return { composition: { ...composition, elements: composition.elements.filter((pose) => pose !== dernier) } }
    }),

  graver: (texte) =>
    set(({ composition }) => ({
      composition: { ...composition, gravure: normaliserGravure(texte, CATALOGUE.gravure.longueurMax) },
    })),
}))

import { create } from 'zustand'
import { CATALOGUE } from '../catalogue/catalogue'
import { normaliserRotation, rejoindreEmplacement, trouverPlaceLibre, type Emplacement } from '../domaine/encombrement'
import { normaliserGravure } from '../domaine/gravure'
import type { Composition, ElementId, MatiereId } from '../domaine/types'

interface EtatComposition {
  composition: Composition
  choisirMatiere: (matiere: MatiereId) => void
  /** Dépose l'élément sur une place libre. Renvoie false s'il n'y en a pas. */
  ajouter: (elementId: ElementId) => boolean
  /** Retire le dernier élément de ce type qui a été posé. */
  retirerUn: (elementId: ElementId) => void
  /** Déplace un élément vers `cible`, jusqu'au premier obstacle. Renvoie false s'il n'a pas bougé. */
  deplacer: (uid: string, cible: Emplacement) => boolean
  /** Tourne un élément d'un nombre de crans de 15°. */
  tourner: (uid: string, crans: number) => void
  retirer: (uid: string) => void
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

  deplacer: (uid, cible) => {
    const { composition } = get()
    const pose = composition.elements.find((element) => element.uid === uid)
    if (!pose) return false
    const arrivee = rejoindreEmplacement(composition, pose, cible, CATALOGUE)
    if (arrivee.x === pose.x && arrivee.z === pose.z) return false
    set({
      composition: {
        ...composition,
        elements: composition.elements.map((element) => (element === pose ? { ...pose, ...arrivee } : element)),
      },
    })
    return true
  },

  tourner: (uid, crans) =>
    set(({ composition }) => ({
      composition: {
        ...composition,
        elements: composition.elements.map((element) =>
          element.uid === uid ? { ...element, rotation: normaliserRotation(element.rotation + crans) } : element,
        ),
      },
    })),

  retirer: (uid) =>
    set(({ composition }) => ({
      composition: { ...composition, elements: composition.elements.filter((element) => element.uid !== uid) },
    })),

  graver: (texte) =>
    set(({ composition }) => ({
      composition: { ...composition, gravure: normaliserGravure(texte, CATALOGUE.gravure.longueurMax) },
    })),
}))

import { normaliserGravure } from './gravure'
import { calculerTotal, detaillerPrix } from './prix'
import type { Catalogue, Composition, ElementPose } from './types'

export interface BocalAuPanier {
  id: string
  composition: Composition
}

export function totalPanier(bocaux: readonly BocalAuPanier[], catalogue: Catalogue): number {
  return bocaux.reduce((total, { composition }) => total + calculerTotal(composition, catalogue), 0)
}

/** Ce qu'on affiche d'un bocal dans le panier : son verre, sa gravure et ses pièces. */
export function resumerBocal(composition: Composition, catalogue: Catalogue) {
  const [bocal, ...lignes] = detaillerPrix(composition, catalogue)
  return {
    titre: bocal?.libelle ?? '',
    gravure: composition.gravure,
    pieces: lignes
      .filter((ligne) => ligne.libelle !== 'Gravure personnalisée')
      .map((ligne) => (ligne.quantite > 1 ? `${ligne.libelle} × ${ligne.quantite}` : ligne.libelle)),
  }
}

const estObjet = (valeur: unknown): valeur is Record<string, unknown> =>
  typeof valeur === 'object' && valeur !== null

function lirePose(donnee: unknown, catalogue: Catalogue): ElementPose | null {
  if (!estObjet(donnee)) return null
  const { uid, elementId, x, z, rotation } = donnee
  const entiers = [x, z, rotation].every(Number.isInteger)
  if (typeof uid !== 'string' || typeof elementId !== 'string' || !entiers) return null
  if (!Object.hasOwn(catalogue.elements, elementId) || (rotation as number) < 0 || (rotation as number) > 23) return null
  return { uid, elementId: elementId as ElementPose['elementId'], x: x as number, z: z as number, rotation: rotation as number }
}

/**
 * Relit un panier conservé dans le navigateur. Ces données peuvent être anciennes,
 * abîmées ou modifiées à la main : tout ce qui ne correspond pas au catalogue est écarté.
 */
export function lirePanier(donnees: unknown, catalogue: Catalogue): BocalAuPanier[] {
  if (!Array.isArray(donnees)) return []
  return donnees.flatMap((donnee): BocalAuPanier[] => {
    if (!estObjet(donnee) || typeof donnee.id !== 'string' || !estObjet(donnee.composition)) return []
    const { matiere, elements, gravure } = donnee.composition
    if (typeof matiere !== 'string' || !Object.hasOwn(catalogue.bocal.matieres, matiere)) return []
    if (!Array.isArray(elements)) return []
    const poses = elements.map((element) => lirePose(element, catalogue))
    if (poses.some((pose) => pose === null)) return []
    return [
      {
        id: donnee.id,
        composition: {
          matiere: matiere as Composition['matiere'],
          elements: poses as ElementPose[],
          gravure: typeof gravure === 'string' ? normaliserGravure(gravure, catalogue.gravure.longueurMax) : null,
        },
      },
    ]
  })
}

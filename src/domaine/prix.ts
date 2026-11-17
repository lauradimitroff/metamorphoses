import type { Catalogue, Composition, ElementId } from './types'

/*
 * Tous les montants sont des centimes entiers (D4) : 5400 et non 54.00.
 * En virgule flottante, 0.1 + 0.2 vaut 0.30000000000000004 ; en entiers, les sommes sont exactes.
 */

export interface LigneDePrix {
  libelle: string
  quantite: number
  prixUnitaireCentimes: number
  sousTotalCentimes: number
}

/** Le récapitulatif : le bocal d'abord, puis chaque élément regroupé, dans l'ordre du catalogue. */
export function detaillerPrix(composition: Composition, catalogue: Catalogue): LigneDePrix[] {
  const matiere = catalogue.bocal.matieres[composition.matiere]
  const lignes: LigneDePrix[] = [
    {
      libelle: `Bocal en ${matiere.nom.toLowerCase()}`,
      quantite: 1,
      prixUnitaireCentimes: matiere.prixCentimes,
      sousTotalCentimes: matiere.prixCentimes,
    },
  ]

  const quantites = new Map<ElementId, number>()
  for (const { elementId } of composition.elements) {
    quantites.set(elementId, (quantites.get(elementId) ?? 0) + 1)
  }

  for (const element of Object.values(catalogue.elements)) {
    const quantite = quantites.get(element.id)
    if (!quantite) continue
    lignes.push({
      libelle: element.nom,
      quantite,
      prixUnitaireCentimes: element.prixCentimes,
      sousTotalCentimes: element.prixCentimes * quantite,
    })
  }

  return lignes
}

export function calculerTotal(composition: Composition, catalogue: Catalogue): number {
  return detaillerPrix(composition, catalogue).reduce((total, ligne) => total + ligne.sousTotalCentimes, 0)
}

const FORMAT_EUROS = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

/** 9000 → « 90,00 € », avec l'espace insécable que demande la typographie française. */
export function formaterPrix(centimes: number): string {
  return FORMAT_EUROS.format(centimes / 100)
}

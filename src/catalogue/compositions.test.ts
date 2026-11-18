import { describe, expect, it } from 'vitest'
import { emplacementValide, OCCUPATION_MAXIMALE, tauxOccupation } from '../domaine/encombrement'
import { CATALOGUE } from './catalogue'
import { COMPOSITION_VITRINE } from './compositions'

describe('COMPOSITION_VITRINE', () => {
  it('respecte les règles de place, comme une composition faite par un visiteur', () => {
    for (const pose of COMPOSITION_VITRINE.elements) {
      expect(emplacementValide(COMPOSITION_VITRINE, pose.elementId, pose, CATALOGUE, pose.uid), pose.uid).toBe(true)
    }
    expect(tauxOccupation(COMPOSITION_VITRINE, CATALOGUE)).toBeLessThanOrEqual(OCCUPATION_MAXIMALE)
  })
})

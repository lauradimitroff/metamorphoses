import { describe, expect, it } from 'vitest'
import { filtrerSaisie, normaliserGravure } from './gravure'

describe('filtrerSaisie', () => {
  it('garde les accents, le « œ » et la ponctuation simple', () => {
    expect(filtrerSaisie('Cœur de Zoé, 2026 !', 24)).toBe('Cœur de Zoé, 2026 !')
  })

  it('retire ce que la police ne sait pas dessiner', () => {
    expect(filtrerSaisie('Pour 🌿 Charlotte 你好', 24)).toBe('Pour  Charlotte ')
  })

  it('limite la longueur, en laissant les espaces pendant la saisie', () => {
    expect(filtrerSaisie('Pour ', 24)).toBe('Pour ')
    expect(filtrerSaisie('abcdef', 4)).toBe('abcd')
  })
})

describe('normaliserGravure', () => {
  it('retire les espaces superflus et pose une vraie apostrophe', () => {
    expect(normaliserGravure("  L'herbier   de Charlotte ", 24)).toBe('L’herbier de Charlotte')
  })

  it('renvoie null quand il ne reste rien à graver', () => {
    expect(normaliserGravure('   ', 24)).toBeNull()
    expect(normaliserGravure('🌿', 24)).toBeNull()
  })
})

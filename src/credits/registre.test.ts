import { readdirSync, existsSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import { LISTE_ELEMENTS } from '../catalogue/catalogue'
import { genererMarkdown } from './markdown'
import { REGISTRE } from './registre'

const DOSSIER_PUBLIC = join(import.meta.dirname, '../../public')
/** Dossiers de public/ qui contiennent des ressources venues d'ailleurs. */
const DOSSIERS_DE_RESSOURCES = ['models', 'hdri', 'textures', 'photos']

function listerFichiers(dossier: string): string[] {
  if (!existsSync(dossier)) return []
  return readdirSync(dossier).flatMap((nom) => {
    const chemin = join(dossier, nom)
    return statSync(chemin).isDirectory() ? listerFichiers(chemin) : [chemin]
  })
}

describe('registre des crédits', () => {
  it('n’a pas deux crédits avec le même identifiant', () => {
    const ids = REGISTRE.map((credit) => credit.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('contient chaque crédit cité par un élément du catalogue', () => {
    const ids = new Set(REGISTRE.map((credit) => credit.id))
    for (const element of LISTE_ELEMENTS) {
      for (const creditId of element.creditIds) {
        expect(ids, `${element.id} cite « ${creditId} »`).toContain(creditId)
      }
    }
  })

  it('ne cite que des fichiers qui existent', () => {
    for (const credit of REGISTRE) {
      for (const fichier of credit.fichiers) {
        expect(existsSync(join(DOSSIER_PUBLIC, fichier)), `${credit.id} : ${fichier}`).toBe(true)
      }
    }
  })

  it('crédite chaque ressource externe présente dans public/', () => {
    const fichiersCredites = new Set(REGISTRE.flatMap((credit) => credit.fichiers))
    const ressources = DOSSIERS_DE_RESSOURCES.flatMap((dossier) => listerFichiers(join(DOSSIER_PUBLIC, dossier)))
    for (const chemin of ressources) {
      const fichier = relative(DOSSIER_PUBLIC, chemin).split('\\').join('/')
      expect(fichiersCredites, `${fichier} n’a pas de crédit`).toContain(fichier)
    }
  })
})

describe('genererMarkdown', () => {
  const markdown = genererMarkdown(REGISTRE, ['Touffe de mousse'])

  it('mentionne chaque crédit avec son auteur et sa licence', () => {
    for (const credit of REGISTRE) {
      expect(markdown).toContain(`[${credit.titre}](${credit.source})** — ${credit.auteur} · ${credit.licence}`)
    }
  })

  it('liste les pièces façonnées au cabinet', () => {
    expect(markdown).toContain('## Pièces façonnées au cabinet')
    expect(markdown).toContain('- Touffe de mousse')
  })

  it('n’affiche que les rubriques qui ont au moins un crédit', () => {
    expect(genererMarkdown([], [])).not.toContain('## Modèles 3D')
  })
})

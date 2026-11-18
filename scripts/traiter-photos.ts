/*
 * Prépare les photos d'ambiance : même traitement pour toutes (couleurs un peu éteintes,
 * ombres vers l'encre de nuit, grain discret), puis AVIF et WebP en deux largeurs.
 *
 *   node scripts/traiter-photos.ts <dossier des originaux>
 *
 * Les originaux restent hors du dépôt. Chaque fichier produit doit figurer au registre.
 */
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const PHOTOS = ['mousse', 'champignons', 'papillon-fougere', 'papillon-lumiere']
const LARGEURS = [800, 1400]
const SORTIE = join(import.meta.dirname, '..', 'public', 'photos')
const [source] = process.argv.slice(2)
if (!source) throw new Error('Indiquez le dossier des photos originales.')

mkdirSync(SORTIE, { recursive: true })

for (const nom of PHOTOS) {
  const original = join(source, `${nom}.jpg`)
  for (const largeur of LARGEURS) {
    let image
    try {
      image = await sharp(original)
        .rotate()
        .resize({ width: largeur, withoutEnlargement: true })
        .modulate({ saturation: 0.82, brightness: 0.92 })
        .linear(0.94, 3)
        .toBuffer({ resolveWithObject: true })
    } catch {
      continue // Cette photo n'est pas encore téléchargée : elle sera traitée à son étape.
    }
    const { width, height } = image.info
    const grain = await sharp({
      create: { width, height, channels: 3, background: '#808080', noise: { type: 'gaussian', mean: 128, sigma: 7 } },
    })
      .png()
      .toBuffer()
    const traitee = sharp(image.data).composite([{ input: grain, blend: 'soft-light' }])
    await traitee.clone().avif({ quality: 52, effort: 6 }).toFile(join(SORTIE, `${nom}-${largeur}.avif`))
    await traitee.clone().webp({ quality: 74, effort: 6 }).toFile(join(SORTIE, `${nom}-${largeur}.webp`))
  }
}

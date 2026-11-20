/*
 * Compresse les textures du plateau en WebP, à la taille utile (1024 px).
 * Les originaux de Poly Haven, exportés en JPEG presque sans perte, pesaient 1,3 Mo à eux trois.
 *
 *   node scripts/compresser-textures.ts <dossier des originaux>
 *
 * La carte de normales garde une qualité plus haute : ses couleurs sont des directions,
 * et la moindre bavure s'y verrait comme un relief faux. La rugosité n'a qu'un canal : niveaux de gris.
 */
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const TAILLE = 1024
const TEXTURES = [
  { nom: 'couleur', qualite: 82, gris: false },
  { nom: 'normale', qualite: 90, gris: false },
  { nom: 'rugosite', qualite: 82, gris: true },
]
const SORTIE = join(import.meta.dirname, '..', 'public', 'textures', 'noyer')
const [source] = process.argv.slice(2)
if (!source) throw new Error('Indiquez le dossier des textures originales.')

mkdirSync(SORTIE, { recursive: true })

for (const { nom, qualite, gris } of TEXTURES) {
  let image = sharp(join(source, `${nom}.jpg`)).resize({ width: TAILLE, withoutEnlargement: true })
  if (gris) image = image.greyscale()
  const { size } = await image.webp({ quality: qualite }).toFile(join(SORTIE, `${nom}.webp`))
  console.log(`${nom}.webp : ${Math.round(size / 1024)} Ko`)
}

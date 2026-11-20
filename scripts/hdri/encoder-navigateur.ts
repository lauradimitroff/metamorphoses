/*
 * Exécuté dans le navigateur (l'encodage a besoin de WebGL).
 * Transforme un HDRI .hdr en JPEG « Ultra HDR » : une image ordinaire, plus une « carte de gain »
 * qui indique, pixel par pixel, de combien la lumière dépasse ce qu'un JPEG sait montrer.
 * drei sait relire ce format directement (<Environment files="….jpg" />).
 */
import { compress, encode, findTextureMinMax } from '@monogrid/gainmap-js/encode'
import { encodeJPEGMetadata } from '@monogrid/gainmap-js/libultrahdr'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'

declare global {
  interface Window {
    resultatEncodage?: { base64: string } | { erreur: string }
  }
}

const parametres = new URLSearchParams(window.location.search)
const source = parametres.get('source') ?? ''
const qualite = Number(parametres.get('qualite') ?? '0.85')

async function encoder() {
  const image = await new HDRLoader().loadAsync(source)
  // Toute la plage de lumière est conservée : le maximum de l'image fixe l'amplitude de la carte de gain.
  const resultat = encode({ image, maxContentBoost: Math.max(...findTextureMinMax(image)) })
  const versImageData = (rendu: Pick<typeof resultat.sdr, 'toArray' | 'width' | 'height'>) => new ImageData(rendu.toArray(), rendu.width, rendu.height)

  const [sdr, gainMap] = await Promise.all([
    compress({ source: versImageData(resultat.sdr), mimeType: 'image/jpeg', quality: qualite, flipY: true }),
    compress({ source: versImageData(resultat.gainMap), mimeType: 'image/jpeg', quality: qualite, flipY: true }),
  ])
  const jpeg = encodeJPEGMetadata({ ...resultat.getMetadata(), sdr, gainMap })
  resultat.sdr.dispose()
  resultat.gainMap.dispose()

  // Le fichier repart vers Node en base64, par morceaux pour ne pas dépasser la taille d'un argument.
  let binaire = ''
  for (let debut = 0; debut < jpeg.length; debut += 0x8000) {
    binaire += String.fromCharCode(...jpeg.subarray(debut, debut + 0x8000))
  }
  return btoa(binaire)
}

encoder().then(
  (base64) => (window.resultatEncodage = { base64 }),
  (erreur: unknown) => (window.resultatEncodage = { erreur: String(erreur) }),
)

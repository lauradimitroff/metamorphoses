/*
 * Le registre des crédits : la SOURCE UNIQUE de toutes les attributions du projet.
 * Il produit la page /credits, le fichier CREDITS.md (scripts/generer-credits.ts)
 * et les icônes ⓘ du configurateur. On ne modifie jamais CREDITS.md à la main.
 *
 * Ce fichier n'importe que des types : Node peut ainsi l'exécuter directement
 * depuis le script de génération, sans étape de compilation.
 */

export type Nature = 'modèle 3D' | 'environnement' | 'texture' | 'photo' | 'police' | 'bibliothèque'

export type Licence = 'CC0' | 'Licence Unsplash' | 'OFL 1.1' | 'MIT' | 'Zlib'

export interface Credit {
  id: string
  titre: string
  nature: Nature
  auteur: string
  /** Page d'origine de la ressource. */
  source: string
  licence: Licence
  /** Ce qui a été changé par rapport à l'original, ou null. */
  modifications: string | null
  /** Fichiers du dossier public/ qui proviennent de cette ressource. */
  fichiers: readonly string[]
}

export const LICENCES: Readonly<Record<Licence, { resume: string; lien: string }>> = {
  CC0: {
    resume: 'Domaine public : usage libre, sans obligation de citer l’auteur.',
    lien: 'https://creativecommons.org/publicdomain/zero/1.0/deed.fr',
  },
  'Licence Unsplash': {
    resume: 'Usage libre, y compris commercial ; la citation de l’auteur est appréciée.',
    lien: 'https://unsplash.com/license',
  },
  'OFL 1.1': {
    resume: 'Licence libre des polices de caractères : usage, modification et diffusion autorisés.',
    lien: 'https://openfontlicense.org/',
  },
  MIT: {
    resume: 'Licence libre : usage autorisé à condition de conserver la mention de l’auteur.',
    lien: 'https://opensource.org/license/mit',
  },
  Zlib: {
    resume: 'Licence libre, proche de MIT : usage autorisé, sans se présenter comme l’auteur.',
    lien: 'https://opensource.org/license/zlib',
  },
}

export const REGISTRE: readonly Credit[] = [
  // Modèles 3D
  {
    id: 'modele-fougere',
    titre: 'Fern',
    nature: 'modèle 3D',
    auteur: 'Quaternius',
    source: 'https://poly.pizza/m/jqcanvH7D6',
    licence: 'CC0',
    modifications:
      'Couleurs par sommet ignorées, transparence remplacée par un seuil, aspect métallique retiré, mise à l’échelle.',
    fichiers: ['models/fougere.glb'],
  },

  // Environnement lumineux (HDRI), retenu à l'étape 2a
  {
    id: 'hdri-workshop',
    titre: 'Workshop',
    nature: 'environnement',
    auteur: 'Dimitrios Savva et Jarod Guest',
    source: 'https://polyhaven.com/a/workshop',
    licence: 'CC0',
    modifications: null,
    fichiers: ['hdri/workshop_1k.hdr'],
  },
  // Textures
  {
    id: 'texture-noyer',
    titre: 'Smoked Walnut Veneer',
    nature: 'texture',
    auteur: 'Jenelle van Heerden',
    source: 'https://polyhaven.com/a/smoked_walnut_veneer',
    licence: 'CC0',
    modifications: 'Teinte assombrie à l’affichage pour obtenir un noyer foncé.',
    fichiers: ['textures/noyer/couleur.jpg', 'textures/noyer/normale.jpg', 'textures/noyer/rugosite.jpg'],
  },

  // Photographies (fichiers ajoutés à leur intégration, étapes 4a et 4b)
  {
    id: 'photo-mousse',
    titre: 'Mousse à contre-jour',
    nature: 'photo',
    auteur: 'Lucas van Oort',
    source: 'https://unsplash.com/fr/photos/une-photo-floue-dun-oiseau-sur-une-colline-herbeuse-upq1bkSh9Ww',
    licence: 'Licence Unsplash',
    modifications: null,
    fichiers: [],
  },
  {
    id: 'photo-champignons',
    titre: 'Champignons luminescents',
    nature: 'photo',
    auteur: 'Igor Omilaev',
    source: 'https://unsplash.com/fr/photos/un-groupe-de-champignons-rougeoyant-dans-la-foret-sombre-qu-upKvvRHg',
    licence: 'Licence Unsplash',
    modifications: null,
    fichiers: [],
  },
  {
    id: 'photo-papillon-fougere',
    titre: 'Papillon de nuit sur une fougère',
    nature: 'photo',
    auteur: 'Erik Karits',
    source: 'https://unsplash.com/fr/photos/un-gros-plan-dune-feuille-avec-un-insecte-dessus-zaj4z_atuZA',
    licence: 'Licence Unsplash',
    modifications: null,
    fichiers: [],
  },
  {
    id: 'photo-papillon-lumiere',
    titre: 'Papillon dans la lumière',
    nature: 'photo',
    auteur: 'Jack Chen',
    source: 'https://unsplash.com/fr/photos/papillon-dans-la-lumiere-JWKW9LOsdUg',
    licence: 'Licence Unsplash',
    modifications: null,
    fichiers: [],
  },

  // Polices
  {
    id: 'police-cormorant',
    titre: 'Cormorant Garamond',
    nature: 'police',
    auteur: 'Christian Thalmann (Catharsis Fonts)',
    source: 'https://github.com/CatharsisFonts/Cormorant',
    licence: 'OFL 1.1',
    modifications: null,
    fichiers: [],
  },
  {
    id: 'police-alegreya-sans',
    titre: 'Alegreya Sans',
    nature: 'police',
    auteur: 'Huerta Tipográfica',
    source: 'https://github.com/huertatipografica/Alegreya-Sans',
    licence: 'OFL 1.1',
    modifications: null,
    fichiers: [],
  },
  {
    id: 'police-pinyon-script',
    titre: 'Pinyon Script',
    nature: 'police',
    auteur: 'Nicole Fally (Sorkin Type)',
    source: 'https://github.com/SorkinType/Pinyon',
    licence: 'OFL 1.1',
    modifications: null,
    fichiers: [],
  },

  // Bibliothèques
  {
    id: 'bibliotheque-three',
    titre: 'three.js',
    nature: 'bibliothèque',
    auteur: 'Ricardo Cabello (mrdoob) et les contributeurs de three.js',
    source: 'https://github.com/mrdoob/three.js',
    licence: 'MIT',
    modifications: null,
    fichiers: [],
  },
  {
    id: 'bibliotheque-r3f',
    titre: 'React Three Fiber, drei et @react-three/postprocessing',
    nature: 'bibliothèque',
    auteur: 'Poimandres',
    source: 'https://github.com/pmndrs/react-three-fiber',
    licence: 'MIT',
    modifications: null,
    fichiers: [],
  },
  {
    id: 'bibliotheque-postprocessing',
    titre: 'postprocessing',
    nature: 'bibliothèque',
    auteur: 'Raoul van Rüschen',
    source: 'https://github.com/pmndrs/postprocessing',
    licence: 'Zlib',
    modifications: null,
    fichiers: [],
  },
  {
    id: 'bibliotheque-react',
    titre: 'React',
    nature: 'bibliothèque',
    auteur: 'Meta et les contributeurs de React',
    source: 'https://github.com/facebook/react',
    licence: 'MIT',
    modifications: null,
    fichiers: [],
  },
  {
    id: 'bibliotheque-react-router',
    titre: 'React Router',
    nature: 'bibliothèque',
    auteur: 'Remix Software',
    source: 'https://github.com/remix-run/react-router',
    licence: 'MIT',
    modifications: null,
    fichiers: [],
  },
]

/** Ordre de présentation des rubriques, dans le registre comme dans CREDITS.md. */
export const ORDRE_DES_NATURES: readonly Nature[] = [
  'modèle 3D',
  'environnement',
  'texture',
  'photo',
  'police',
  'bibliothèque',
]

export const INTITULES_DES_NATURES: Readonly<Record<Nature, string>> = {
  'modèle 3D': 'Modèles 3D',
  environnement: 'Environnements lumineux',
  texture: 'Textures',
  photo: 'Photographies',
  police: 'Polices de caractères',
  bibliothèque: 'Bibliothèques logicielles',
}

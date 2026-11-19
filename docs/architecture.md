# Métamorphoses — Architecture (V1)

> Version 1.4 · 19/11/2026 · validée par Laura Dimitroff
> S'appuie sur le [cahier des charges](cahier-des-charges.md) (v2.4) et le [journal de décisions](decisions.md) (D1 à D14).
> 1.1 : quatre pages, un produit, cinq éléments ; partage et étiquette reportés en V2.
> 1.2 : le bocal remplace le chaudron (D9), HDRI « Workshop » (D10).
> 1.3 : gravure personnalisée (D11).
> 1.4 : panier fictif et page `/panier` (D14).

---

## 1. Le principe directeur : trois couches qui ne se mélangent pas

```
┌──────────────────────────────────────────────────────────────┐
│  Interface (DOM)            Scène 3D (React Three Fiber)     │
│  catalogue, prix, jauge       bocal, éléments, lumière       │
│            ╲                     ╱                           │
│             ╲   lisent / agissent  ╱                         │
│              ▼                   ▼                           │
│         État partagé (Zustand) : la composition              │
│                        │                                     │
│                        ▼  appelle                            │
│   Domaine (TypeScript pur) : prix, place, description        │
│   aucune dépendance à React, à Three.js ou au navigateur     │
└──────────────────────────────────────────────────────────────┘
```

- **Le domaine** contient les règles du métier : prix, place disponible, chevauchements, description textuelle. Ce sont des fonctions pures : mêmes entrées, même résultat, sans effet de bord. On les teste avec Vitest, sans navigateur et sans 3D.
- **L'état** garde la composition en cours. Il appelle le domaine pour valider chaque action : « ajouter une améthyste » ne réussit que si le domaine trouve une place libre.
- **L'interface et la scène** affichent l'état et transmettent les actions. La scène 3D ne décide de rien : elle dessine.

**Pour défendre ce choix** : « La 3D est la partie la plus difficile à tester. J'en ai sorti toute la logique, que je teste donc entièrement sans WebGL. Et pour enrichir le catalogue, on ajoute des données et un générateur, sans toucher aux règles. »

Les pages À propos, Contact et Crédits n'utilisent ni l'état ni la scène : ce sont des pages React classiques.

## 2. Pile technique

| Besoin | Choix | Pourquoi | Alternative écartée |
|---|---|---|---|
| Interface | React 19 + TypeScript strict | Déjà en place, et React Three Fiber en a besoin | — |
| Outillage | Vite 8 | Démarrage instantané, déjà en place | — |
| 3D | Three.js + React Three Fiber 9 + drei | La scène s'écrit en composants React, comme le reste | Three.js seul : plus de code pour synchroniser la scène et l'interface |
| Post-traitement | @react-three/postprocessing | Halo et rendu AgX, validés par l'essai (D7) | — |
| État | **Zustand** | Un petit magasin (*store*) lisible depuis la scène **sans** provoquer de rendu React à chaque image | Context React : chaque changement relancerait le rendu de tout l'arbre, y compris la scène |
| Routes | **React Router 8** (mode déclaratif) | Standard connu, pages chargées à la demande | wouter : plus léger, mais moins connu en entretien |
| Styles | **CSS Modules** + jetons en variables CSS | Styles isolés par composant, fournis par Vite, sans dépendance | Tailwind : ne sert pas un design aussi singulier ; CSS-in-JS : coût à l'exécution |
| Polices | **@fontsource** (polices hébergées dans le projet) | Aucun appel à Google, donc pas de transmission d'adresse IP : un argument RGPD | Google Fonts en lien direct |
| Apparitions au défilement | `IntersectionObserver` + transitions CSS | Natif, léger, facile à couper pour `prefers-reduced-motion` | Une bibliothèque d'animation : inutile pour des fondus discrets |
| Formulaire de contact | Validation écrite à la main, attributs HTML natifs | Quatre champs : une bibliothèque serait disproportionnée | React Hook Form |
| Tests unitaires | Vitest | Même configuration que Vite | — |
| Tests de bout en bout | Playwright | Vrai navigateur, WebGL compris | Cypress : plus lourd |
| Compression | gltf-transform (modèles), sharp (photos en AVIF et WebP) | Standards actuels | — |

**Dépendances à ajouter** : `zustand`, `react-router`, `@fontsource/cormorant-garamond`, `@fontsource/alegreya-sans`, `@fontsource/pinyon-script`. En développement : `vitest`, `@playwright/test`, `@gltf-transform/cli`, `sharp`.

## 3. Structure des dossiers

```
metamorphoses/
├─ docs/                     cahier des charges, architecture, décisions, repérage
├─ public/
│  ├─ models/                fougère compressée
│  ├─ hdri/                  l'HDRI « Workshop » (D10)
│  ├─ textures/              noyer, terre
│  └─ photos/                photos d'ambiance retraitées (AVIF + WebP)
├─ scripts/
│  ├─ generer-credits.ts     produit CREDITS.md à partir du registre
│  └─ optimiser-ressources.sh  compresse modèles et photos
├─ e2e/                      tests Playwright
├─ src/
│  ├─ main.tsx · App.tsx     point d'entrée et routes
│  ├─ pages/                 Accueil, Composer, APropos, Contact, Registre, Panier, Introuvable
│  ├─ domaine/               TypeScript pur, testé (*.test.ts à côté de chaque fichier)
│  │  ├─ types.ts            Composition, ElementPose…
│  │  ├─ prix.ts             total, sous-totaux, formatage
│  │  ├─ encombrement.ts     jauge, chevauchements, recherche de place libre
│  │  ├─ description.ts      description textuelle (lecteurs d'écran)
│  │  └─ panier.ts           total du panier, relecture sûre du stockage
│  ├─ catalogue/             DONNÉES : bocal, éléments
│  ├─ credits/registre.ts    source unique des crédits (F5)
│  ├─ etat/                  magasins Zustand : composition, interface, panier
│  ├─ scene/                 tout ce qui est 3D
│  │  ├─ Vitrine.tsx         Canvas, éclairage, table, caméra, post-traitement
│  │  ├─ ambiance/           jour/nuit, bougie, lucioles (repris de l'essai)
│  │  ├─ Bocal.tsx            verre, substrat, couvercle et devise
│  │  ├─ elements/           un composant par élément + table id → composant
│  │  ├─ generateurs/        géométries procédurales (profils, cristaux, bruit)
│  │  └─ interaction/        sélection, glisser au sol
│  ├─ interface/             composants DOM : EnTete, PiedDePage, Logo, BandeauDemo,
│  │                         Catalogue, Recapitulatif, Jauge, ChampFormulaire, Apparition
│  └─ styles/                jetons.css (palette, typographies, espacements), base.css
├─ CREDITS.md                généré, jamais modifié à la main
└─ vercel.json               redirige toutes les routes vers index.html
```

Le dossier `src/essai/` disparaîtra à l'étape 2a : son contenu sera repris dans `scene/`.

## 4. Modèle de données

### 4.1 Le catalogue (données fixes)

```ts
type MatiereId = 'verre-clair' | 'verre-ambre'
type FamilleId = 'vegetal' | 'mineral' | 'champignons'
type ElementId = 'mousse' | 'fougere' | 'galets' | 'amethyste' | 'champignons-luminescents'

interface DefinitionBocal {
  rayonSol: number             // rayon du disque de sol, en unités de scène
  hauteurSol: number
  matieres: Record<MatiereId, { nom: string; prixCentimes: number }>
}

interface DefinitionElement {
  id: ElementId
  nom: string
  famille: FamilleId
  prixCentimes: number         // 1200
  rayonEncombrement: number    // l'emprise du pied au sol (D1)
  rayonVisuel: number          // la forme vue de dessus, qui ne doit pas toucher le verre (D12)
  creditIds: string[]          // renvoie vers le registre des crédits
}
```

Les identifiants sont des **types littéraux** et non de simples chaînes : une faute de frappe devient une erreur de compilation. Ajouter un élément en V2, c'est ajouter un identifiant à `ElementId` : TypeScript signale alors tous les endroits à compléter, comme la table qui associe un identifiant à son composant 3D.

### 4.2 La composition (ce que l'utilisateur crée)

```ts
interface ElementPose {
  uid: string          // identifiant unique de cette pose (deux mousses = deux uid)
  elementId: ElementId
  x: number            // position au sol, en millièmes d'unité (entier)
  z: number
  rotation: number     // en crans de 15° : de 0 à 23
}

interface Composition {
  matiere: MatiereId
  elements: ElementPose[]
  gravure: string | null   // texte gravé sous la devise (D11), null s'il n'y en a pas
}
```

**Pourquoi des entiers** pour les positions et la rotation : c'est le même raisonnement que pour les prix en centimes (D4). On évite les erreurs d'arrondi, et la V2 pourra encoder la composition dans une URL courte et exacte.

### 4.3 Le registre des crédits

```ts
interface Credit {
  id: string
  titre: string
  nature: 'modèle 3D' | 'texture' | 'environnement' | 'photo' | 'police' | 'bibliothèque'
  auteur: string
  source: string        // URL
  licence: 'CC0' | 'Licence Unsplash' | 'OFL' | 'MIT'
  modifications: string | null
}
```

Ce même tableau produit la page `/credits`, le fichier `CREDITS.md` (par `scripts/generer-credits.ts`, que Node 24 exécute directement en TypeScript) et les icônes ⓘ. La CI régénère `CREDITS.md` et **échoue s'il diffère** du fichier commité.

## 5. Les règles du domaine

### 5.1 Encombrement (D1, D4)

- **Dans le bocal** : `distance(centre) + rayonVisuel ≤ rayonSol`.
- **Pas de chevauchement** : pour chaque autre élément, `distance(a, b) ≥ rayonA + rayonB`.
- **Jauge** : `Σ rayon² / rayonSol² ≤ 0,50`. C'est un rapport de surfaces : les π se simplifient. Elle n'affiche 100 % que si plus aucun élément ne trouve de place (D13).
- **Place libre** pour le dépôt automatique : on essaie des points sur une **spirale de Vogel** (des points répartis selon l'angle d'or, comme les graines d'un tournesol), du centre vers le bord, et on garde le premier valide. Le résultat est déterministe et bien réparti. Si aucun point ne convient, on renvoie `null` et l'interface affiche « Plus de place dans le bocal ».

### 5.2 Description textuelle (accessibilité)

`decrireComposition()` produit par exemple : « Bocal en verre clair. Au centre, une fougère. À l'avant gauche, trois touffes de mousse. À l'arrière, une améthyste. » Le texte est annoncé par une zone `aria-live` à chaque changement. Le test de bout en bout s'en sert aussi pour vérifier la scène **sans comparer de pixels**.

## 6. L'état (Zustand)

Deux petits magasins, parce qu'ils ne changent pas au même rythme :

| Magasin | Contenu | Actions |
|---|---|---|
| `composition` | la `Composition` | `choisirMatiere`, `ajouter`, `deplacer`, `tourner`, `retirer` |
| `interface` | élément sélectionné, moment (jour ou nuit), message en cours | `selectionner`, `basculerMoment`, `afficherMessage` |

Chaque action de `composition` passe par le domaine. `deplacer` refuse une position invalide et garde la dernière position valide : l'élément « bute » contre ses voisins.

**Le cas particulier de la 3D** : pendant un glisser, la position change à chaque image. La scène lit alors le magasin **sans s'y abonner** (`useComposition.getState()` dans `useFrame`), pour ne pas déclencher 60 rendus React par seconde. C'est la raison principale du choix de Zustand.

## 7. La scène 3D

- **Une seule `Vitrine`** (Canvas, éclairage, table, caméra, post-traitement), utilisée par l'accueil (de nuit, avec une rotation lente et une composition fixe) et par le configurateur.
- **L'ambiance** reprend l'essai : une valeur `nuit` partagée par contexte, animée dans `useFrame`, que lisent la bougie, les champignons et les lucioles.
- **Les générateurs** sont des fonctions qui renvoient des géométries. Chacune est calculée une fois et **partagée** : dix mousses utilisent la même géométrie.
- **Instanciation** pour les éléments répétés (mousses, galets) : un seul appel de dessin pour toutes les copies.
- **Interaction** : les évènements de pointeur de React Three Fiber donnent directement le point touché sur le sol. Le glisser utilise `setPointerCapture` pour ne pas « perdre » l'élément si la souris va trop vite.
- **Caméra** : bornée comme dans l'essai.
- **Performance** : `PerformanceMonitor` (drei) baisse la résolution si l'appareil peine. La scène ne calcule plus d'images quand l'onglet est caché.

## 8. Pages et chargement

| Route | Chargement | Three.js |
|---|---|---|
| `/` | à la demande (`React.lazy`) | oui : la scène d'ouverture |
| `/composer` | à la demande | oui |
| `/a-propos` | à la demande | **non** |
| `/contact` | à la demande | **non** |
| `/credits` | à la demande | **non** |
| `/panier` | à la demande | **non** |

Three.js, qui représente l'essentiel du poids du site, n'est chargé que par l'accueil et le configurateur. Les autres pages s'ouvrent instantanément.

- **Écran d'attente** : le papillon gravé qui se dessine trait par trait, branché sur `useProgress` de drei.
- **Repli sans WebGL** : on teste la création d'un contexte WebGL avant de monter la scène. En cas d'échec, un message remplace la scène, et le reste de la page fonctionne.
- **Photos** : servies en AVIF avec une version WebP de secours (`<picture>`), en plusieurs tailles (`srcset`), et chargées en différé (`loading="lazy"`) hors de l'écran visible.

## 9. Qualité

- **Vitest** : tout `domaine/`, et le registre (chaque élément du catalogue doit avoir son crédit).
- **Playwright** : un parcours principal, de l'accueil à une composition terminée, au clavier, avec le passage à la nuit.
- **CI GitHub Actions**, à chaque envoi : lint, types, Vitest, construction, Playwright, vérification de `CREDITS.md`.
- **Déploiement** : Vercel, branché sur `main`, avec une prévisualisation pour chaque branche.

## 10. Découpage en sous-étapes

Chaque sous-étape se termine par une vérification dans le navigateur, une section « À regarder en local » et **ta validation avant le commit**.

| | Sous-étape | Estimation |
|---|---|---|
| **1 · Fondations** | | |
| 1a | Outillage : Vitest, Playwright, CI, routes et pages vides, jetons CSS, polices, bandeau de démonstration | 2 h 30 |
| 1b | Identité : logo du papillon en SVG, en-tête avec navigation, pied de page | 2 h |
| 1c | Catalogue et crédits : données, registre, `CREDITS.md` généré, page `/credits` | 1 h 30 |
| 1d | Domaine : prix, encombrement, place libre, description, avec leurs tests | 2 h |
| **2 · La scène** | | |
| 2a | Vitrine : reprise de l'essai, écran d'attente, HDRI définitive, bocal d'apothicaire (D9) et devise gravée | 1 h 30 + 2 h 30 |
| 2b | Éléments : mousse, galets, améthyste, et la fougère compressée | 3 h |
| **3 · Composer** | | |
| 3a | Catalogue, dépôt automatique, prix, jauge et récapitulatif ; gravure personnalisée (règles, champ, texte gravé en direct) | 3 h + 2 h |
| 3b | Sélection, glisser au sol, rotation, suppression, clavier, description `aria-live` | 3 h 30 |
| **4 · Les pages** | | |
| 4a | Accueil vitrine | 4 h à 5 h |
| 4b | À propos : rédaction du lore et mise en page | 2 h à 3 h |
| 4c | Contact : formulaire et validation accessible | 1 h 30 à 2 h |
| 4d | Panier fictif : règles et relecture sûre du stockage, compteur, aperçu latéral, page `/panier` et confirmation de démonstration | 4 h |
| **5 · Finitions** | | |
| 5a | Mobile, repli sans WebGL, réduction des animations, test Playwright | 2 h |
| 5b | README, captures, mise en ligne sur Vercel | 1 h |
| | **Total** | **environ 30 h** |

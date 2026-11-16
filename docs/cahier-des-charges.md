# Métamorphoses — Cahier des charges (V1)

> Version 1.1 · 16/11/2026 · validé par Laura Dimitroff (1.1 : origine des modèles après repérage, décision D6)
> Boutique de démonstration : aucun produit n'est réellement vendu.

---

## 1. Présentation

**Métamorphoses** est une boutique fictive de terrariums qu'on **compose soi-même en 3D**, dans l'univers d'un cabinet de curiosités sans rien de macabre.

Les boutiques existantes, comme La Green Touch (terrariums de 37 € à 119 €), proposent un catalogue de modèles tout faits. Ici, le visiteur choisit son contenant, pose chaque élément là où il le souhaite, puis découvre sa création à la tombée de la nuit, quand la bougie s'allume et que les champignons se mettent à luire.

- **URL** : https://metamorphoses-shop.vercel.app/
- **Cadre** : projet n° 3 de la section « Lab » du portfolio. Il montre une maîtrise de la 3D temps réel sur le web et un niveau de finition visuelle élevé.
- **Devise** : *Vulnerant omnes, ultima necat* (« Toutes blessent, la dernière tue »), une devise de cadran solaire. Elle n'est pas le nom de la boutique : elle apparaît **gravée** dans l'univers (socle de la cloche, sablier, étiquette de spécimen).

## 2. Objectifs

| Pour qui | Objectif |
|---|---|
| Le visiteur | Composer un terrarium en quelques minutes, sans mode d'emploi, et avoir envie de partager le résultat. |
| Le recruteur ou le client qui regarde le portfolio | Voir en moins de 30 secondes une scène 3D soignée, fluide et accessible, et un moment « wahou » (le passage à la nuit). |
| Laura | Apprendre la 3D (Three.js / React Three Fiber) et savoir expliquer chaque choix technique. |

**Ce que le projet n'est pas** : ni une vraie boutique (pas de paiement, pas de compte), ni un tableau de bord, ni un catalogue.

## 3. Décisions structurantes

Le détail et les raisons de chaque décision se trouvent dans [`decisions.md`](decisions.md).

1. **Placement** : dépôt automatique sur une place libre, puis ajustement libre, l'élément restant collé au sol ; rotation par crans, aucun chevauchement, commandes complètes au clavier.
2. **Style 3D** : stylisé soigné, avec des formes simplifiées et des matières physiquement réalistes (PBR).
3. **Direction artistique** : cabinet nocturne, avec bois sombre, laiton, verre et vélin (voir § 6).
4. **Prix** : contenant + éléments, stockés en centimes ; limite de place calculée à partir de la surface du sol (voir § 7).
5. **Périmètre V1** : 2 formes de contenant (3 choix) et 13 éléments (voir § 4).

## 4. Périmètre fonctionnel de la V1

### 4.1 Pages

| Route | Contenu |
|---|---|
| `/` | Accueil court : le chaudron en vedette, de nuit, une phrase d'introduction et le bouton « Composer mon terrarium ». |
| `/composer` | Le configurateur. Accepte une composition encodée dans l'URL. |
| `/credits` | Le **registre d'inventaire du cabinet** : la liste de tous les modèles, textures et polices, avec leur auteur, leur source, leur licence et les modifications apportées. |

Sur toutes les pages : une mention discrète mais permanente « Boutique de démonstration — rien n'est vendu ».

### 4.2 Contenants

| Contenant | Particularité | Prix |
|---|---|---|
| Chaudron en fonte (par défaut) | Forme tournée générée dans le code, métal mat et rugueux | 54 € |
| Chaudron en cuivre | Même forme, matière cuivrée et brillante | 64 € |
| Cloche en verre sur socle en noyer | Verre transparent qui réfracte la lumière, devise gravée sur le socle | 48 € |

Le prix du contenant comprend le sol (terre et substrat). Changer de contenant conserve les éléments qui tiennent dans le nouveau. Les autres sont retirés et listés dans un message, avec la possibilité d'annuler.

### 4.3 Éléments à placer

| Famille | Élément | Origine | Prix |
|---|---|---|---|
| Végétal | Touffe de mousse | Générée | 3 € |
| | Lichen | Généré | 3 € |
| | Petite fougère | Téléchargée | 8 € |
| | Plante grasse (rosette en phyllotaxie) | Générée | 7 € |
| Minéral | Galets | Générés | 2 € |
| | Pointe de quartz | Générée | 9 € |
| | Améthyste | Générée | 12 € |
| | Géode ouverte | Générée | 14 € |
| Champignons | Champignon simple | Généré | 5 € |
| | Groupe luminescent (lueur la nuit) | Généré | 7 € |
| Cabinet | Sablier gravé de la devise | Généré | 12 € |
| | Clé ancienne | Générée | 9 € |
| | Loupe en laiton | Générée | 15 € |

Exemples de compositions : la cloche avec une mousse, des galets et un quartz coûte 62 € ; le chaudron en fonte avec trois mousses, une fougère, une améthyste, un groupe luminescent et le sablier coûte 102 €.

Les **lucioles** ne se placent pas : elles font partie de l'ambiance de nuit.

### 4.4 Fonctionnalités et critères d'acceptation

**F1. Visionneuse 3D**
- Rotation autour du terrarium et zoom entre deux limites. La caméra ne passe jamais sous la table ni à travers le contenant.
- Quand on sélectionne un élément, la caméra se rapproche doucement de lui.
- Le décor (table en noyer, bougie, fond sombre) est toujours présent. L'ombre au sol est douce.
- Pendant le chargement, un écran d'attente reste dans l'univers du cabinet ; jamais de page blanche.

**F2. Composition**
- Un catalogue organisé par famille. Chaque fiche montre une vignette, un nom, un prix et une icône ⓘ (auteur et licence).
- Un clic sur une fiche pose l'élément sur une place libre (décision 1). Si aucune place ne convient, un message l'explique.
- On fait glisser l'élément pour le déplacer : il reste collé au sol, ne sort pas du contenant et ne chevauche aucun autre élément.
- Rotation par crans de 15° (boutons, molette, touche R), suppression (bouton, touche Suppr) et annulation de la dernière action.
- Au clavier : Tab pour parcourir les éléments posés, les flèches pour déplacer, R pour tourner, Suppr pour retirer, Échap pour désélectionner.

**F3. Jauge, prix et récapitulatif**
- La jauge « Place restante » compare la surface occupée au sol disponible, avec un maximum de 70 %.
- Le prix total est mis à jour à chaque action et affiché au format français (« 102,00 € »).
- Le récapitulatif liste le contenant, puis les éléments regroupés avec leur quantité et leur sous-total.

**F4. Passage du jour à la nuit**
- Un bouton bascule l'ambiance, avec une transition animée d'environ 2,5 secondes.
- La nuit : la lumière ambiante baisse, la bougie s'allume et vacille, les champignons luminescents brillent, une trentaine de lucioles apparaissent et un halo (*bloom*) ne touche que les sources lumineuses.
- Si le visiteur a activé « réduire les animations » dans son système, la bascule est instantanée et les lucioles ne bougent pas.

**F5. Étiquette de spécimen**
- Un numéro (« Spécimen n° 042 ») calculé à partir de la composition : la même composition donne toujours le même numéro.
- Un nom poétique proposé automatiquement (par exemple « Jardin des brumes »), modifiable, de 32 caractères maximum.
- Le contenu : le contenant, les éléments principaux et la devise en italique.
- Un téléchargement en PNG haute définition.

**F6. Partage**
- La composition est encodée dans l'URL : format compact, numéro de version, vérification à la lecture. Un lien abîmé ou ancien ouvre une composition vide avec un message, jamais une erreur.
- Un bouton copie le lien de partage.
- Une capture de la scène se télécharge en PNG.

**F7. Registre des crédits**
- Une seule source de données dans le code génère à la fois la page `/credits`, le fichier `CREDITS.md` et les icônes ⓘ du configurateur.
- L'auteur est mentionné pour chaque élément sous licence CC-BY.

**F8. Qualité transversale**
- Responsive : sur mobile, le panneau d'options devient un tiroir en bas de l'écran et la scène occupe le reste.
- Si WebGL est indisponible, une page de repli présente des images de compositions et explique la situation.

## 5. Contraintes techniques

### 5.1 Stack (à détailler dans le document d'architecture)

- **React + TypeScript (strict) + Vite** : une application cliente, sans rendu côté serveur.
- **Three.js via React Three Fiber**, avec **drei** et **@react-three/postprocessing** pour le halo.
- **Zustand** pour l'état de la composition, partagé entre la scène et l'interface.
- Modèles au format **glTF/GLB**, compressés avec gltf-transform (Meshopt ou Draco, textures en KTX2 ou WebP).
- Pas de backend. Déploiement sur Vercel.

### 5.2 Performance

| Indicateur | Objectif |
|---|---|
| Fluidité sur ordinateur | 60 images/s |
| Fluidité sur un mobile de milieu de gamme | 30 images/s minimum |
| Poids total des modèles et textures (compressés) | Moins de 3 Mo |
| Scène affichée sur une connexion 4G | Moins de 3 s |
| Appels de dessin (*draw calls*) par image | Moins de 100, grâce à l'instanciation des mousses et des galets |

### 5.3 Accessibilité

- Interface conforme **WCAG 2.2 niveau AA** : contrastes, focus visible en laiton, cibles tactiles d'au moins 44 px.
- La scène 3D est doublée d'une **description textuelle** de la composition, mise à jour en direct pour les lecteurs d'écran (`aria-live`).
- Toutes les actions se font au clavier.
- Respect de `prefers-reduced-motion`.

### 5.4 Compatibilité

Les deux dernières versions de Chrome, Firefox, Safari et Edge, ainsi que Safari iOS 16 et suivants.

## 6. Direction artistique

### 6.1 Palette

| Nom | Code | Usage |
|---|---|---|
| Encre de nuit | `#12161A` | Fond général |
| Noyer | `#2B1F18` | Panneaux, table, socle |
| Mousse | `#4F6B3E` | Décor uniquement, jamais pour du texte |
| Laiton | `#B89B5E` | **Seule couleur d'accent** de l'interface : actions, sélection, focus |
| Ambre | `#B8702A` | Lumière de la bougie, verre ambré |
| Vélin | `#E9DFC8` | Texte principal, étiquette |
| Lueur | `#9FE3C9` | **Uniquement la nuit** : champignons, lucioles |

Contrastes : vélin sur encre de nuit environ 14:1, laiton sur encre de nuit environ 7:1.

### 6.2 Typographies (Google Fonts, hébergées dans le projet)

- **Cormorant Garamond** pour les titres, en petites capitales espacées, avec les chiffres anciens sur l'étiquette.
- **Alegreya Sans** pour l'interface et les textes.
- **Pinyon Script** uniquement pour le nom calligraphié de l'étiquette.

### 6.3 Logo

Un papillon de nuit gravé au trait, couleur laiton, dont les ailes dessinent un **M**, accompagné du mot « MÉTAMORPHOSES » en Cormorant, en capitales espacées. C'est un SVG dessiné à la main, net à toutes les tailles et animable.

### 6.4 Exigence de finition

Le site doit être **ultra soigné**, avec l'aspect d'un objet artisanal et non d'un gabarit générique.

- **Interdits** : dégradés décoratifs, cartes arrondies à ombre portée répétées partout, emojis, icônes génériques, textes creux (« Découvrez notre univers unique »), contenu de remplissage.
- **Typographie française** : espaces insécables avant `: ; ! ?` et dans les guillemets « », vrais apostrophes ’ et tirets.
- **Détails faits main** : filets doubles, ornements gravés en SVG, grain de papier très discret sur l'étiquette, animations avec des courbes d'accélération étudiées.
- **Scène 3D éclairée comme une photographie** : éclairage composé, carte d'environnement (HDRI), verre avec vraie transmission, post-traitement dosé.
- **Textes écrits dans la voix du cabinet**, qui reste sobre, précise et un peu mystérieuse.
- **Chaque sous-étape est vérifiée en capture** dans le navigateur, avec une passe de finition avant validation.

## 7. Système de prix

- **Prix total** = prix du contenant + somme des prix des éléments posés.
- **Stockage en centimes**, en nombres entiers, pour éviter les erreurs d'arrondi des nombres à virgule.
- **Affichage** avec `Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })`.
- **Limite de place** : chaque élément occupe un cercle d'encombrement au sol. La somme de ces surfaces ne peut pas dépasser 70 % de la surface du sol du contenant.
- L'étiquette de spécimen est **incluse** dans le prix.

## 8. Modèles 3D, crédits et licences

- **Générés dans le code** (12 éléments sur 13) : les contenants, le sol, la mousse, le lichen, la plante grasse, les minéraux, les champignons, le sablier, la clé et la loupe.
- **Téléchargés** : la fougère seulement ([Fern de Quaternius](https://poly.pizza/m/jqcanvH7D6), CC0), plus une HDRI Poly Haven et 2 ou 3 textures (noyer, terre), toutes CC0. Le modèle est allégé et compressé.
- Le repérage est fait (voir [`reperage.md`](reperage.md) et la décision D6). Reste l'**essai d'éclairage**, de jour et de nuit, pour choisir l'HDRI et les textures avant l'architecture.

## 9. Qualité et livrables

- **README** structuré : présentation, captures, choix techniques, lancement en local, crédits.
- **Intégration continue** (GitHub Actions) : lint, vérification des types, tests unitaires Vitest, tests de bout en bout Playwright.
- **Tests unitaires** : calcul du prix, jauge de place, détection des chevauchements, encodage et décodage de l'URL, numéro de spécimen.
- **Tests de bout en bout** : composer un terrarium, partager le lien et le rouvrir, parcours au clavier, passage à la nuit, page de repli sans WebGL.
- **Journal de décisions** (`docs/decisions.md`) tenu pendant tout le développement.
- **Git** : commits sous l'identité de Laura Dimitroff, sans ligne de co-auteur.

## 10. Hors périmètre V1

- Autres contenants : fiole ambrée, tasse en porcelaine, lanterne.
- Ammonite fossile et autres éléments supplémentaires.
- Panier fictif et tunnel de commande.
- Réalité augmentée sur mobile.
- Comparaison de deux compositions, mode « avant/après ».
- Sons d'ambiance.

## 11. Critères de réussite

1. Un visiteur compose un terrarium complet et le partage en moins de 3 minutes, sans aide.
2. Le passage à la nuit provoque un effet « wahou » sur mobile comme sur ordinateur.
3. Les objectifs de performance (§ 5.2) et d'accessibilité (§ 5.3) sont tenus et mesurés.
4. Chaque modèle et chaque texture est crédité dans le registre.
5. Laura sait expliquer et défendre chaque choix technique.

## 12. Prochaines étapes

1. ~~Repérage des modèles~~ (fait), puis **essai d'éclairage**, à valider.
2. **Architecture** : structure des dossiers, modèle de données, état, format de l'URL, découpage en sous-étapes.
3. **Développement** par petites sous-étapes (1a, 1b…), chacune vérifiée puis validée avant d'être commitée.

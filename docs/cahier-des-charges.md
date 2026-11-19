# Métamorphoses — Cahier des charges (V1)

> Version 2.4 · 19/11/2026 · validé par Laura Dimitroff
> 1.1 : origine des modèles après repérage (D6). 1.2 : page d'accueil vitrine.
> **2.0 : périmètre recentré (D8)** sur un site vitrine avec un produit à configurer, pour environ 30 heures de travail.
> 2.1 : le bocal d'apothicaire remplace le chaudron (D9) ; HDRI « Workshop » retenue (D10).
> 2.2 : devise gravée à l'acide sur le verre ; gravure personnalisée en V1 (D11).
> 2.3 : jauge calée sur la place réellement disponible (D13).
> 2.4 : panier fictif en V1 (D14).
> Boutique de démonstration : aucun produit n'est réellement vendu.

---

## 1. Présentation

**Métamorphoses** est une boutique fictive de terrariums qu'on **compose soi-même en 3D**, dans l'univers d'un cabinet de curiosités sans rien de macabre.

Les boutiques existantes, comme La Green Touch (terrariums de 37 € à 119 €), proposent un catalogue de modèles tout faits. Ici, le visiteur pose chaque élément là où il le souhaite dans un bocal d'apothicaire, puis découvre sa création à la tombée de la nuit, quand la bougie s'allume et que les champignons se mettent à luire.

- **URL** : https://metamorphoses-shop.vercel.app/
- **Cadre** : projet n° 3 de la section « Lab » du portfolio. Il montre une maîtrise de la 3D temps réel sur le web, un niveau de finition visuelle élevé et un site complet, pensé comme une vraie marque.
- **Devise** : *Vulnerant omnes, ultima necat* (« Toutes blessent, la dernière tue »), une devise de cadran solaire. Elle n'est pas le nom de la boutique : elle apparaît **gravée** dans l'univers (sur la collerette du couvercle, dans le lore, dans le pied de page).

## 2. Objectifs

| Pour qui | Objectif |
|---|---|
| Le visiteur | Être séduit par l'univers dès l'accueil, puis composer un terrarium en quelques minutes, sans mode d'emploi. |
| Le recruteur ou le client qui regarde le portfolio | Voir en moins de 30 secondes un site soigné, une scène 3D fluide et accessible, et un moment « wahou » (le passage à la nuit). |
| Laura | Apprendre la 3D (Three.js / React Three Fiber) et savoir expliquer chaque choix technique. |

**Ce que le projet n'est pas** : ni une vraie boutique (pas de paiement, pas de compte, pas d'envoi de message), ni un catalogue de produits tout faits.

**La règle de hiérarchie** : le configurateur est le cœur du site. Chaque page y mène, l'accueil s'ouvre sur la 3D et non sur une photo, et les photos évoquent l'univers, jamais le produit.

## 3. Décisions structurantes

Le détail et les raisons de chaque décision se trouvent dans [`decisions.md`](decisions.md).

1. **Placement** : dépôt automatique sur une place libre, puis ajustement libre, l'élément restant collé au sol ; rotation par crans, aucun chevauchement, commandes au clavier (D1).
2. **Style 3D** : stylisé soigné, avec des formes simplifiées et des matières physiquement réalistes (D2).
3. **Direction artistique** : cabinet nocturne, avec bois sombre, laiton et vélin, dans une mise en page contemporaine (D3, § 6).
4. **Prix** : contenant + éléments, stockés en centimes ; limite de place calculée à partir de la surface du sol (D4, § 7).
5. **Origine des modèles** : tout est généré dans le code, sauf la fougère (D6).
6. **Direction visuelle de la scène** validée par l'essai d'éclairage (D7).
7. **Périmètre** recentré : quatre pages, un produit et cinq éléments pour commencer (D8).
8. **Le produit** : un bocal d'apothicaire en verre, à couvercle de laiton (D9), éclairé par l'HDRI « Workshop » (D10).
9. **La gravure** : la devise gravée à l'acide sur le verre, et une gravure personnalisée en option (D11).

## 4. Périmètre fonctionnel de la V1

### 4.1 Pages

| Route | Contenu |
|---|---|
| `/` | **Accueil vitrine** (F6) |
| `/composer` | **Le configurateur** (F1 à F4) |
| `/a-propos` | **Le lore du cabinet** (F7) |
| `/contact` | **Le formulaire de contact** (F8) |
| `/credits` | Le **registre d'inventaire du cabinet** : les modèles, textures, photos et polices, avec leur auteur, leur source, leur licence et les modifications apportées (F5) |
| `*` | « Ce spécimen n'existe pas », avec un retour vers l'accueil |

Sur toutes les pages :
- un en-tête avec le logo et la navigation, et le bouton « Composer » toujours visible ;
- un pied de page avec la devise et les liens ;
- la mention discrète mais permanente « Boutique de démonstration — rien n'est vendu ».

### 4.2 Le produit : le bocal d'apothicaire

Un bocal élancé, généré dans le code : panse haute et droite sur un fond de verre épais, épaule arrondie, col resserré, lèvre évasée. Un couvercle en laiton, en dôme, surmonté d'un fleuron. La devise est gravée à l'acide sur le haut de la panse, en lettres dépolies. À travers le verre, on voit les couches du terrarium : drainage, puis terre.

| Verre | Particularité | Prix |
|---|---|---|
| Clair (par défaut) | À peine verdi, comme le verre ancien | 54 € |
| Ambré | Le verre des flacons d'apothicaire ; la teinte s'intensifie avec l'épaisseur | 64 € |

Le prix comprend le substrat. Changer de verre conserve tous les éléments posés, puisque la forme est la même. Pour composer, le couvercle se soulève et se pose sur la table, à côté du bocal.

**Gravure personnalisée (option, 6 €)** : une ligne de texte libre (un prénom, une date, « Pour Charlotte, 2026 »), gravée dans le verre sous la devise, de 24 caractères au plus.

### 4.3 Les éléments à placer (catalogue de départ)

| Famille | Élément | Origine | Prix |
|---|---|---|---|
| Végétal | Touffe de mousse | Générée | 3 € |
| | Petite fougère | Téléchargée ([Quaternius](https://poly.pizza/m/jqcanvH7D6), CC0) | 8 € |
| Minéral | Galets | Générés | 2 € |
| | Améthyste | Générée | 12 € |
| Champignons | Groupe luminescent (lueur la nuit) | Généré | 7 € |

Exemple : le bocal en verre clair avec trois mousses, une fougère, une améthyste et un groupe luminescent coûte 90 €.

Les **lucioles** ne se placent pas : elles font partie de l'ambiance de nuit. Le catalogue est pensé pour **s'enrichir ensuite** : ajouter un élément revient à ajouter une ligne de données et un générateur.

### 4.4 Fonctionnalités et critères d'acceptation

**F1. Visionneuse 3D**
- Rotation autour du bocal et zoom entre deux limites. La caméra ne passe jamais sous la table ni à travers le bocal.
- Le décor (table en noyer, bougie, fond sombre) est toujours présent. L'ombre au sol est douce.
- Pendant le chargement, un écran d'attente reste dans l'univers du cabinet ; jamais de page blanche.

**F2. Composition**
- Un catalogue organisé par famille. Chaque fiche montre une vignette, un nom, un prix et une icône ⓘ (auteur et licence).
- Un clic sur une fiche pose l'élément sur une place libre (D1). Si aucune place ne convient, un message l'explique.
- On fait glisser l'élément pour le déplacer : il reste collé au sol, ne sort pas du bocal et ne chevauche aucun autre élément.
- Rotation par crans de 15° (boutons, touche R) et suppression (bouton, touche Suppr).
- Au clavier : Tab pour parcourir les éléments posés, les flèches pour déplacer, R pour tourner, Suppr pour retirer, Échap pour désélectionner.
- Une description textuelle de la composition est annoncée aux lecteurs d'écran à chaque changement.
- **Gravure personnalisée** : un champ de texte, avec un compteur des caractères restants (24 au plus). Le texte se grave dans le verre en direct, pendant la saisie. Les espaces superflus sont retirés ; un champ vide retire la gravure et son prix. Le texte gravé est repris dans la description textuelle.

**F3. Jauge, prix et récapitulatif**
- La jauge « Place occupée » compare la surface occupée à un maximum de 50 % du sol. Elle n'annonce « Bocal plein » que lorsque plus aucun élément ne trouve de place.
- Le prix total est mis à jour à chaque action et affiché au format français (« 90,00 € »).
- Le récapitulatif liste le verre du bocal, la gravure personnalisée s'il y en a une, puis les éléments regroupés avec leur quantité et leur sous-total.

**F4. Passage du jour à la nuit**
- Un bouton bascule l'ambiance, avec une transition animée d'environ 2,5 secondes.
- La nuit : la lumière ambiante baisse, la bougie s'allume et vacille, les champignons luminescents brillent, une trentaine de lucioles apparaissent, et un halo ne touche que les sources lumineuses.
- Si le visiteur a activé « réduire les animations » dans son système, la bascule est instantanée et les lucioles ne bougent pas.

**F5. Registre des crédits**
- Une seule source de données dans le code génère à la fois la page `/credits`, le fichier `CREDITS.md` et les icônes ⓘ du configurateur.
- La CI échoue si `CREDITS.md` ne correspond plus au registre.

**F6. Page d'accueil vitrine**
- **Ouverture** : un bocal composé, de nuit, en vraie 3D. La caméra tourne lentement autour, sans interaction obligatoire. Par-dessus : le logo, une phrase d'accroche et le bouton « Composer mon terrarium ».
- **« Comment naît un spécimen »** : trois temps (choisir sa matière, y déposer mousses, cristaux et champignons, attendre la nuit), illustrés par les photos d'ambiance retenues et de petites gravures en SVG.
- **Un aperçu du lore**, avec un lien vers la page À propos.
- **Mise en page éditoriale** : grandes typographies, beaucoup d'espace, apparitions discrètes au défilement (désactivées si le système demande de réduire les animations).
- **Performance** : une seule scène 3D sur la page.

**F7. Page À propos : le lore**
- Le récit du cabinet, de son fondateur ou sa fondatrice imaginaire et de la devise, mis en page comme un récit illustré de photos et de gravures.
- Tous les personnages et les lieux sont fictifs, et la page le dit.
- Un lien final vers le configurateur.

**F8. Page Contact**
- Un formulaire : nom, adresse électronique, objet (liste), message.
- Une validation accessible : messages d'erreur clairs, reliés à leur champ et annoncés aux lecteurs d'écran ; le focus revient sur le premier champ en erreur.
- À l'envoi : un message de confirmation précise « Boutique de démonstration : votre message n'a pas été envoyé ». Aucune donnée ne quitte le navigateur.

**F10. Panier fictif**
- Un bouton « Ajouter au panier » dans l'atelier ajoute la composition en cours ; on peut continuer à composer.
- Un compteur dans l'en-tête ouvre un aperçu latéral : chaque bocal (verre, gravure, pièces, prix), son retrait, le total et « Voir mon panier ».
- La page `/panier` détaille chaque bocal ligne à ligne, avec son retrait, et un récapitulatif avec le total et « Valider la commande ».
- La validation vide le panier et affiche une confirmation : un numéro de commande, le récapitulatif, la mention « rien n'est vendu, aucun paiement n'a eu lieu », et deux suites (composer un autre bocal, revenir à l'accueil).
- Le panier est conservé dans le navigateur ; ce qui en est relu est vérifié, et rien ne part sur un serveur.

**F9. Qualité transversale**
- Responsive : sur mobile, le panneau du configurateur devient un tiroir en bas de l'écran, et la scène occupe le reste.
- Si WebGL est indisponible, un message dans l'esprit du cabinet remplace la scène, et le reste du site fonctionne normalement.

## 5. Contraintes techniques

### 5.1 Stack (détaillée dans [`architecture.md`](architecture.md))

- **React + TypeScript (strict) + Vite** : une application cliente, sans rendu côté serveur.
- **Three.js via React Three Fiber**, avec **drei** et **@react-three/postprocessing**.
- **Zustand** pour l'état de la composition, partagé entre la scène et l'interface.
- **React Router** pour les pages, chargées à la demande.
- Modèles au format **glTF/GLB**, compressés avec gltf-transform.
- Pas de backend. Déploiement sur Vercel.

### 5.2 Performance

| Indicateur | Objectif |
|---|---|
| Fluidité sur ordinateur | 60 images/s |
| Fluidité sur un mobile de milieu de gamme | 30 images/s minimum |
| Poids total des modèles, textures et HDRI (compressés) | Moins de 3 Mo |
| Scène affichée sur une connexion 4G | Moins de 3 s |
| Pages À propos, Contact et Crédits | Sans Three.js : affichage immédiat |

### 5.3 Accessibilité

- Interface conforme **WCAG 2.2 niveau AA** : contrastes, focus visible en laiton, cibles tactiles d'au moins 44 px.
- La scène 3D est doublée d'une description textuelle, mise à jour en direct (`aria-live`).
- Toutes les actions se font au clavier.
- Respect de `prefers-reduced-motion`.

### 5.4 Compatibilité

Les deux dernières versions de Chrome, Firefox, Safari et Edge, ainsi que Safari iOS 16 et suivants.

## 6. Direction artistique

### 6.1 Palette

| Nom | Code | Usage |
|---|---|---|
| Encre de nuit | `#12161A` | Fond général |
| Noyer | `#2B1F18` | Panneaux, table |
| Mousse | `#4F6B3E` | Décor uniquement, jamais pour du texte |
| Laiton | `#B89B5E` | **Seule couleur d'accent** de l'interface : actions, sélection, focus |
| Ambre | `#B8702A` | Lumière de la bougie |
| Vélin | `#E9DFC8` | Texte principal |
| Lueur | `#9FE3C9` | **Uniquement la nuit** : champignons, lucioles |

Contrastes : vélin sur encre de nuit environ 14:1, laiton sur encre de nuit environ 7:1.

### 6.2 Typographies (hébergées dans le projet)

- **Cormorant Garamond** pour les titres, en petites capitales espacées ou en grands titres éditoriaux.
- **Alegreya Sans** pour l'interface et les textes.
- **Pinyon Script** pour de rares touches calligraphiées.

### 6.3 Logo

Un papillon de nuit gravé au trait, couleur laiton, dont les ailes dessinent un **M**, accompagné du mot « MÉTAMORPHOSES » en Cormorant, en capitales espacées. C'est un SVG dessiné à la main, net à toutes les tailles.

### 6.4 Moderne et ancien

Un **artisanat contemporain** : mise en page épurée, beaucoup d'espace, grandes typographies éditoriales, transitions fluides. L'ancien n'apparaît que par touches : gravures, filets, devise.

### 6.5 Photos d'ambiance

Quatre photos Unsplash retenues (voir [`reperage.md`](reperage.md), § 7). Elles reçoivent un traitement commun : légère désaturation, ombres vers l'encre de nuit, grain discret. Elles ne montrent ni personne, ni marque, ni le produit.

### 6.6 Exigence de finition

Le site doit être **ultra soigné**, avec l'aspect d'un objet artisanal et non d'un gabarit générique.

- **Interdits** : dégradés décoratifs, cartes arrondies à ombre portée répétées partout, emojis, icônes génériques, textes creux, contenu de remplissage.
- **Typographie française** : espaces insécables avant `: ; ! ?` et dans les guillemets « », vraies apostrophes ’ et vrais tirets.
- **Détails faits main** : filets doubles, ornements gravés en SVG, animations avec des courbes d'accélération étudiées.
- **Textes écrits dans la voix du cabinet**, qui reste sobre, précise et un peu mystérieuse.
- **Chaque sous-étape est vérifiée en capture** dans le navigateur, avec une passe de finition avant validation.

## 7. Système de prix

- **Prix total** = prix du bocal + gravure personnalisée éventuelle (6 €) + somme des prix des éléments posés.
- **Stockage en centimes**, en nombres entiers.
- **Affichage** avec `Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })`.
- **Limite de place** : la surface des cercles d'encombrement ne peut pas dépasser 50 % du sol.

## 8. Ressources et crédits

- **Générés dans le code** : le bocal et son couvercle, le substrat, la mousse, les galets, l'améthyste et les champignons.
- **Téléchargés** : la fougère (CC0), l'HDRI « Workshop » et la texture de noyer de Poly Haven (CC0), et quatre photos Unsplash.
- Tout est crédité dans le registre (F5), même quand la licence ne l'exige pas.

## 9. Qualité et livrables

- **README** structuré : présentation, captures, choix techniques, lancement en local, crédits.
- **CI** (GitHub Actions) : lint, types, Vitest, construction, Playwright, vérification de `CREDITS.md`.
- **Tests unitaires** : prix, jauge, chevauchements, place libre, description textuelle, cohérence du registre.
- **Test de bout en bout** : le parcours principal, de l'accueil à une composition terminée, au clavier.
- **Journal de décisions** tenu pendant tout le développement.
- **Git** : commits sous l'identité de Laura Dimitroff, sans ligne de co-auteur.

## 10. Reporté en V2

- **Catalogue** : d'autres contenants (le chaudron, dont le code reste dans l'historique Git, la cloche, la fiole, la lanterne) ; le lichen, la plante grasse, le quartz, la géode, le champignon simple, le sablier, la clé, la loupe, l'ammonite.
- **Composition** : l'annulation, la caméra qui suit l'élément sélectionné.
- **Partage** : la composition dans l'URL, le lien de partage, la capture PNG.
- **Étiquette de spécimen** (numéro, nom, PNG) : la première à ajouter.
- **Accueil** : les spécimens tout faits.
- Plus tard : réalité augmentée, comparaison de compositions, sons d'ambiance.

## 11. Critères de réussite

1. Un visiteur arrive sur l'accueil, comprend le concept et compose un terrarium complet en moins de 3 minutes, sans aide.
2. Le passage à la nuit provoque un effet « wahou » sur mobile comme sur ordinateur.
3. Les objectifs de performance (§ 5.2) et d'accessibilité (§ 5.3) sont tenus et mesurés.
4. Chaque ressource est créditée dans le registre.
5. Laura sait expliquer et défendre chaque choix technique.

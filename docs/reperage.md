# Repérage des modèles 3D, textures et environnement

> 16/11/2026 · Étape prévue au § 8 du cahier des charges, avant tout développement.
> Rien n'a encore été téléchargé.

## 1. Les 4 éléments prévus en téléchargement

| Élément | Meilleur candidat | Licence | Constat | Recommandation |
|---|---|---|---|---|
| Petite fougère | [Fern — Quaternius](https://poly.pizza/m/jqcanvH7D6), issue du *Stylized Nature MegaKit* | **CC0** | 288 triangles, frondes texturées avec transparence, rendu peint et cohérent avec le stylisé soigné | **À retenir** |
| Plante grasse | [Succulent — Isa Lousberg](https://poly.pizza/m/3Wh5uc4bdL) | CC0 | Facettes très marquées (« low poly » anguleux) : détonnerait à côté des formes lisses générées | **Générer dans le code** |
| | [Succulent 01 — Alex G](https://poly.pizza/m/51lsZP1KvUY) | CC-BY 3.0 | Vendue dans un pot, mêmes facettes | Écartée |
| Clé ancienne | [Golden Skeleton Key — VR XRTIST](https://poly.pizza/m/7TRBdMDM-0S), [GOLDEN.KEY](https://poly.pizza/m/eFPxBQQrstn) | CC-BY 3.0 | Modèles Google Poly de 2017, simplistes, aucune version CC0 trouvée ; les clés détaillées sont payantes (CGTrader) | **Générer dans le code** |
| Loupe en laiton | [Magnifying Glass — Gabriel Valdivia](https://poly.pizza/m/c8HQVCBMIMR), [Poly by Google](https://poly.pizza/m/bcdkW7a4AG5) | CC-BY 3.0 | Même constat : rudimentaires, style « icône » | **Générer dans le code** |

### Pourquoi générer la plante grasse, la clé et la loupe

- **Plante grasse** : une échévérie est une rosette de feuilles disposées selon l'**angle d'or** (137,5°), la *phyllotaxie*, qu'on retrouve dans les pommes de pin et les tournesols. On génère une feuille, puis on la répète en tournant et en réduisant sa taille. Le résultat est lisse, paramétrable (nombre de feuilles, teinte) et très léger. C'est aussi un beau sujet à présenter.
- **Loupe** : un tore (l'anneau), un cylindre tourné (le manche) et un disque de verre. Trois formes simples auxquelles on applique notre propre laiton PBR.
- **Clé** : un anneau ornemental (tore ou forme extrudée), une tige (cylindre) et un panneton (forme 2D extrudée). Là aussi, notre laiton.
- **Cohérence** : les modèles CC-BY trouvés ont un style « Google Poly 2017 » qui contredit l'exigence de finition (§ 6.4). Des objets générés partagent exactement les mêmes matières que les contenants et le sablier.
- **Licences** : il ne reste qu'**un seul modèle téléchargé, en CC0**, donc aucune attribution obligatoire. On le crédite quand même dans le registre, par élégance.

**Ce que ça coûte** : 3 générateurs de plus à écrire. Ce sont des formes simples, du même type que le sablier et les contenants.

## 2. Environnement lumineux (HDRI)

Une **HDRI** est une photo panoramique à 360° qui contient de vraies valeurs de lumière. On s'en sert pour les **reflets** du laiton, du cuivre et du verre, et pour une lumière ambiante douce. L'éclairage principal reste nos propres lumières (bougie, lumière d'appoint). En 1K, elle suffit, puisqu'on ne la voit jamais en fond.

Candidats Poly Haven (tous **CC0**) à comparer lors de l'essai d'éclairage :

- [Workshop](https://polyhaven.com/a/workshop) : un atelier, pour des reflets chauds et variés ;
- [Vestibule](https://polyhaven.com/a/vestibule) : un intérieur à la lumière naturelle douce ;
- [Glass Passage](https://polyhaven.com/a/glass_passage) : faible contraste, avec des lampes ;
- [Moon Lab](https://polyhaven.com/a/moon_lab) : à tester pour l'ambiance de nuit.

## 3. Textures (fonte, cuivre, noyer, sol)

| Matière | Approche proposée | Sources CC0 |
|---|---|---|
| Fonte | Matière unie et rugueuse, avec un bruit généré dans le code pour la rugosité | ambientCG (catégorie *Metal*) si une texture apporte vraiment quelque chose |
| Cuivre | Métal brillant, avec une légère patine générée | ambientCG |
| Noyer (table, socle) | **Une vraie texture de bois en 1K** : c'est la matière la plus visible du décor | [ShareTextures — American Walnut](https://sharetextures.com/textures/wood/american_walnut_1), ambientCG, Poly Haven |
| Terre et substrat | Texture de sol fin en 1K | ambientCG, Poly Haven |

Le choix exact de chaque texture se fera pendant l'essai d'éclairage, en les comparant à l'écran plutôt que sur catalogue.

## 4. Bilan

| | Avant le repérage | Après |
|---|---|---|
| Éléments générés | 9 | **12** |
| Éléments téléchargés | 4 | **1** (fougère, CC0) |
| Modèles CC-BY à créditer obligatoirement | jusqu'à 4 | **0** |
| Autres ressources | — | 1 HDRI et 2 à 3 textures, toutes CC0 |

## 5. Étape suivante : l'essai d'éclairage

Une petite scène de test (le chaudron en fonte, un sol, la fougère, une bougie) pour valider le rendu **de jour et de nuit** avant l'architecture. On y choisira l'HDRI et les textures.

C'est le premier code du projet : il faudra donc créer le dépôt (Vite + React + TypeScript) et télécharger la fougère, l'HDRI et les textures, avec ton accord.

## 6. Ressources téléchargées pour l'essai (16/11/2026)

Toutes sont en CC0. Ce sont des fichiers bruts, à compresser avant la mise en ligne. Les HDRI non retenues seront supprimées après l'essai.

| Fichier dans `public/` | Origine | Auteur | Licence | Poids |
|---|---|---|---|---|
| `models/fougere.glb` | [Poly Pizza — Fern](https://poly.pizza/m/jqcanvH7D6) | Quaternius | CC0 | 693 Ko |
| `hdri/workshop_1k.hdr` | [Poly Haven — Workshop](https://polyhaven.com/a/workshop) | Poly Haven | CC0 | 1,8 Mo |
| `hdri/vestibule_1k.hdr` | [Poly Haven — Vestibule](https://polyhaven.com/a/vestibule) | Poly Haven | CC0 | 1,7 Mo |
| `hdri/moon_lab_1k.hdr` | [Poly Haven — Moon Lab](https://polyhaven.com/a/moon_lab) | Poly Haven | CC0 | 1,8 Mo |
| `textures/noyer/{couleur,normale,rugosite}.jpg` | [Poly Haven — Smoked Walnut Veneer](https://polyhaven.com/a/smoked_walnut_veneer) (1K) | Poly Haven | CC0 | 1,3 Mo |

Ces lignes alimenteront la source unique des crédits (F7) lors de l'architecture.

## 7. Photos d'ambiance retenues (16/11/2026)

Licence Unsplash : usage libre, y compris commercial, sans obligation de crédit. On les crédite quand même dans le registre. Elles ne montrent ni personne ni marque. **Pas encore téléchargées** : elles le seront au moment de leur intégration, retraitées pour s'accorder à la palette (désaturation légère, ombres vers l'encre de nuit, grain discret).

| Photo | Auteur | Usage pressenti |
|---|---|---|
| [Mousse à contre-jour](https://unsplash.com/fr/photos/une-photo-floue-dun-oiseau-sur-une-colline-herbeuse-upq1bkSh9Ww) | [Lucas van Oort](https://unsplash.com/fr/@switch_dtp_fotografie) | Accueil |
| [Papillon de nuit sur une fougère](https://unsplash.com/fr/photos/un-gros-plan-dune-feuille-avec-un-insecte-dessus-zaj4z_atuZA) | [Erik Karits](https://unsplash.com/fr/@erik_karits) | À propos |
| [Champignons luminescents](https://unsplash.com/fr/photos/un-groupe-de-champignons-rougeoyant-dans-la-foret-sombre-qu-upKvvRHg) | [Igor Omilaev](https://unsplash.com/fr/@omilaev) | Accueil, temps « attendre la nuit » |
| [Papillon dans la lumière](https://unsplash.com/fr/photos/papillon-dans-la-lumiere-JWKW9LOsdUg) | [Jack Chen](https://unsplash.com/fr/@silverarrow) | À propos ou Contact |

**Règle** : les photos évoquent l'univers, jamais le produit. Le chaudron n'existe qu'en 3D.

Écartées : la bougie près de la fenêtre (sous licence Unsplash+, donc payante), ainsi que l'herbe ensoleillée, les bougies de Noël et les bouteilles à étiquettes (moins cohérentes). D'autres photos (minéral, bougie) seront cherchées seulement si un emplacement l'exige.

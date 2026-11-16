# Journal de décisions

Chaque entrée indique le contexte, la décision, les raisons et ce que l'on accepte de perdre. Les entrées les plus récentes sont ajoutées en bas.

---

## D1 · Placement des éléments — 16/11/2026

**Options étudiées** : emplacements prévus, placement totalement libre à la souris, compromis.

**Décision** : le compromis.
- Un clic sur une fiche pose l'élément sur une place libre du sol.
- On l'ajuste ensuite en le faisant glisser. Il reste collé au sol grâce au *raycasting* (un rayon lancé depuis le pointeur pour trouver le point visé sur le sol) et ne sort jamais du contenant.
- La rotation se fait par crans.
- Chaque élément a un **cercle d'encombrement**. Avant de poser un élément, on vérifie par un simple calcul de distance en 2D qu'il ne touche aucun autre cercle, sans moteur physique.
- Au clavier : Tab, flèches, R, Suppr.

**Pourquoi** : les emplacements prévus ramèneraient au catalogue, contraire au concept. Le placement totalement libre provoque des chevauchements, marche mal sur mobile et n'est pas accessible au clavier. Le compromis donne un bon résultat dès le premier clic tout en laissant la liberté de composer.

**Conséquence positive** : les cercles d'encombrement servent aussi à calculer la limite de place (D4).

## D2 · Style 3D — 16/11/2026

**Options étudiées** : réaliste, stylisé simple, stylisé soigné.

**Décision** : le stylisé soigné, c'est-à-dire des formes simplifiées avec des matières physiquement réalistes (PBR : laiton, verre, fonte).

**Pourquoi** :
- La moitié des éléments est générée dans le code, avec des formes forcément simplifiées. En style réaliste, ils jureraient à côté de modèles scannés.
- Le halo de la nuit est plus magique sur des formes épurées.
- Les sources gratuites stylisées (Quaternius, Kenney, Poly Pizza) sont plus faciles à harmoniser.
- Les fichiers sont plus légers, ce qui aide à tenir les objectifs sur mobile.

**Ce qu'on accepte de perdre** : les scans du Smithsonian et les objets très détaillés de Poly Haven ne seront pas utilisés tels quels.

**Comment le défendre** : « Des formes stylisées avec des matières physiquement réalistes : la scène reste cohérente entre les éléments générés et les éléments téléchargés, elle reste légère, et elle met en valeur la lumière. »

## D3 · Direction artistique — 16/11/2026

**Décision** :
- **Palette** : encre de nuit, noyer, mousse, laiton (seul accent de l'interface), ambre, vélin, et lueur (réservée à la nuit).
- **Typographies** : Cormorant Garamond pour les titres, Alegreya Sans pour l'interface, Pinyon Script uniquement pour le nom de l'étiquette.
- **Logo** : un papillon de nuit dont les ailes forment un M.

Le détail est au § 6 du cahier des charges.

**Pourquoi** :
- L'ambiance doit être plus sombre et plus mystérieuse que L'Encre & le Grain, et distincte d'Atollo et de Pocki.
- Un fond très sombre met la scène 3D en valeur, comme une vitrine.
- Une seule couleur d'accent garde l'interface lisible.
- Réserver la lueur à la nuit rend la bascule surprenante.
- Le papillon de nuit incarne la métamorphose et le monde nocturne, sans rien de macabre.

**Exigence associée** : une finition « ultra soignée », sans motif générique (§ 6.4 du cahier des charges).

## D4 · Système de prix — 16/11/2026

**Décision** :
- Prix total = contenant (sol inclus) + éléments, pour un panier typique de 45 à 110 €. Ce repère vient de La Green Touch (37 à 119 €).
- Prix stockés en **centimes**, en entiers, et affichés avec `Intl.NumberFormat`.
- La limite de place vient de la géométrie : la surface des cercles d'encombrement ne doit pas dépasser 70 % du sol.
- L'étiquette de spécimen est incluse.

**Pourquoi** :
- Les nombres à virgule de JavaScript produisent des erreurs d'arrondi (`0.1 + 0.2 !== 0.3`), d'où les centimes.
- Une limite tirée de la surface est juste pour chaque contenant, alors qu'un « 12 éléments maximum » serait arbitraire.
- L'étiquette est la signature de la boutique : elle ne doit pas être une option payante.

## D5 · Périmètre de la V1 — 16/11/2026

**Décision** :
- **Contenants** : chaudron en fonte, chaudron en cuivre, cloche en verre sur socle en noyer.
- **Éléments** : 13, dont 4 téléchargés.
- **Fonctionnalités** : F1 à F8 du cahier des charges.

**Pourquoi** :
- « Peu de fonctionnalités, mais abouties. »
- Chaque contenant montre une technique différente : forme tournée, variante de matière, verre.
- La fiole est reportée, car son col étroit complique le placement et un deuxième contenant en verre double le coût de rendu.
- Avec seulement 4 modèles à trouver, il y a moins de licences à vérifier et moins de risques d'incohérence visuelle.

## D6 · Origine des modèles après repérage — 16/11/2026

**Contexte** : D5 prévoyait 4 éléments téléchargés (fougère, plante grasse, clé, loupe). Le repérage ([`reperage.md`](reperage.md)) montre qu'un seul candidat gratuit atteint le niveau de finition voulu.

**Décision** :
- On télécharge uniquement la **fougère** ([Fern de Quaternius](https://poly.pizza/m/jqcanvH7D6), CC0, 288 triangles).
- La **plante grasse**, la **clé** et la **loupe** seront générées dans le code.

**Pourquoi** :
- La plante grasse gratuite est taillée en facettes anguleuses, incompatibles avec les formes lisses générées. Générée en *phyllotaxie* (des feuilles réparties selon l'angle d'or, 137,5°), elle sera lisse, paramétrable et légère.
- Les clés et les loupes gratuites sont des modèles CC-BY rudimentaires de 2017, et les versions soignées sont payantes. Faites de formes simples (tores, cylindres tournés, profils extrudés), elles partageront le même laiton PBR que le reste de la scène.
- Il ne reste aucun modèle CC-BY, donc aucune attribution obligatoire, ce qui simplifie la gestion des licences.

**Ce qu'on accepte** : trois générateurs de plus à écrire, simples et du même type que le sablier.

## D7 · Direction visuelle validée par l'essai d'éclairage — 16/11/2026

**Contexte** : une scène d'essai (`src/essai/`) avec le chaudron généré, la fougère, trois champignons luminescents, une bougie et des lucioles, pour juger le rendu avant l'architecture.

**Décision** : la direction visuelle est validée. On retient :
- la table en noyer, dont les bords se perdent dans un brouillard couleur encre de nuit (effet vitrine) ;
- une lumière principale de jour (une « fenêtre » haute à gauche) et une HDRI qui ne sert qu'aux reflets et à l'ambiance ;
- la nuit : HDRI presque éteinte, un soupçon de bleu venu d'en haut, la bougie comme source principale, avec des ombres portées ;
- un halo (*bloom*) réservé aux éléments dont la luminosité dépasse 1, puis le mappage des tons AgX ;
- une transition de 2,5 s, instantanée si le système demande de réduire les animations.

**Pourquoi** : la bougie qui sculpte le chaudron et la lueur des champignons créent l'effet « wahou » visé, sans effet tape-à-l'œil.

**Reste à régler pendant le développement** :
- les lueurs paraissent trop blanches : il faut des verts plus saturés et une intensité légèrement plus basse ;
- le sol est encore uni et plat ;
- un écran d'attente est nécessaire, car le chargement est perceptible ;
- le choix définitif de l'HDRI (Atelier par défaut pour l'instant).

**Leçon technique** : le fichier de la fougère contenait des couleurs par sommet presque noires, qui assombrissaient la texture. Il faudra toujours inspecter un modèle téléchargé (matériaux, couleurs, échelle) avant de l'intégrer.

## D8 · Périmètre recentré : un site vitrine avec un produit à configurer — 16/11/2026

**Contexte** : le périmètre de D5, complété par l'accueil vitrine, représentait environ 60 heures. C'est trop pour le temps disponible.

**Décision** : la V1 devient un **site vitrine complet** autour d'**un seul produit à configurer**.
- **Quatre pages** : un accueil soigné, le configurateur, une page À propos avec un lore, une page Contact, plus le registre des crédits.
- **Le produit** : le chaudron, en fonte ou en cuivre.
- **Cinq éléments** pour commencer : mousse, fougère, galets, améthyste, champignons luminescents.
- On garde le placement de D1, le prix, la jauge et le passage à la nuit.
- **Reporté en V2** : la cloche et les huit autres éléments, l'annulation, la caméra qui suit l'élément sélectionné, le partage par URL, l'étiquette de spécimen, les spécimens de l'accueil.
- Estimation : **environ 30 heures**.

**Pourquoi** :
- Les pages À propos et Contact montrent le travail de design et d'interface, qui est le point fort de Laura.
- Cinq éléments suffisent à prouver le concept. Le catalogue s'enrichira ensuite en ajoutant des données et un générateur par élément, sans réécrire l'architecture.

**La règle qui protège le concept** : le configurateur reste le cœur du site. L'accueil s'ouvre sur la 3D et non sur une photo, chaque page mène au configurateur, et les photos évoquent l'univers sans jamais montrer le produit.

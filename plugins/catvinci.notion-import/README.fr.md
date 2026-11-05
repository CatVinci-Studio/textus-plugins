# Import Notion

Apporte un export Notion dans Textus sous forme de fichiers Markdown ordinaires : pages et sous-pages, images et pièces jointes, liens entre elles, et bases de données.

1. Dans Notion, choisissez **Paramètres › Exporter tout le contenu de l’espace de travail**, au format **Markdown et CSV**, sous-pages comprises. Placez le .zip obtenu (ou le dossier décompressé) dans le dossier ouvert dans Textus.
2. Choisissez **Extensions › Importer depuis Notion…** (ou faites un clic droit sur le .zip dans la barre latérale) et sélectionnez l’export. Un gros export découpé en Part-1.zip, Part-2.zip… dans un même zip est ouvert comme un seul. Un .zip de plus de 256 Mo est trop gros pour être lu d’un coup : décompressez-le, avec les Part zip qu’il contient, dans un même dossier du dossier ouvert, puis choisissez ce dossier.
3. Tout va dans un nouveau dossier, **Import Notion** suivi de la date ; rien de ce qui existe n’est modifié. Une page de rapport s’ouvre à la fin.

Ce que cela donne :

- **Pages** : `Projets 1a2b….md` et son dossier deviennent `Projets.md` et `Projets/`, la structure que le plugin Pages affiche en arbre. Deux pages du même nom reçoivent « 2 ».
- **Liens** entre pages, vers les images et les pièces jointes suivent les nouveaux noms. Les liens vers des pages non exportées restent tels quels et figurent dans le rapport.
- **Propriétés** sous le titre de la page d’une ligne de base de données vont dans son front matter ; sur les autres pages, ces lignes restent du texte.
- **Bases de données** : chaque ligne devient un document dans un dossier, ses propriétés dans le front matter : dates en 2026-01-04 (formats anglais, chinois, japonais, coréen, allemand, français, espagnol, portugais et ISO), cases à cocher en true/false, nombres, sélections multiples en listes, relations en liens vers les lignes. À côté, une page affiche la base en tableau, plus un tableau de cartes si elle a un statut et un calendrier si elle a des dates.
- **Encadrés** (callouts) deviennent des notes (`> [!NOTE]`), emoji conservé. Les blocs repliables restent en `<details>`.

Ce qui ne suit pas : l’export de Notion ne contient ni icônes ni couvertures de page, ni commentaires, ni les vues enregistrées des bases (filtres, tris) ; ils ne sont donc pas importés. Les propriétés de formule et de rollup gardent la valeur qu’elles avaient, les colonnes se suivent, une base de données intégrée devient un lien vers sa page, et les mentions de personnes et de dates sont du texte simple.

Le rapport compte ce qui a été importé, liste les liens introuvables et les blocs modifiés, et suggère les plugins utiles pour ce que vous avez apporté : Pages pour les sous-pages, Vues de base de données pour les bases, Rétroliens et Aperçu rapide pour les pages liées, etc. **Extensions › Plugins utiles après un import Notion…** propose d’en installer un ; Textus demande d’abord. Rien ne s’installe tout seul.

Tout se passe sur votre ordinateur : le plugin ne lit et n’écrit que dans le dossier ouvert, et n’utilise jamais le réseau.

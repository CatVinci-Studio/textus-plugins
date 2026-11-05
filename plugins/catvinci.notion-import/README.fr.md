# Import Notion

Apporte un export Notion dans Textus sous forme de fichiers Markdown ordinaires : pages et sous-pages, images et pièces jointes, liens entre elles, et bases de données.

1. Dans Notion, choisissez **Paramètres › Exporter tout le contenu de l’espace de travail**, au format **Markdown et CSV**, sous-pages comprises. Placez le .zip obtenu (ou le dossier décompressé) dans le dossier ouvert dans Textus.
2. Choisissez **Extensions › Importer depuis Notion…** (ou faites un clic droit sur le .zip dans la barre latérale) et sélectionnez l’export. Un gros export découpé en Part-1.zip, Part-2.zip… dans un même zip est ouvert comme un seul.
3. Tout va dans un nouveau dossier, **Import Notion** suivi de la date ; rien de ce qui existe n’est modifié. Une page de rapport s’ouvre à la fin.

Ce que cela donne :

- **Pages** : `Projets 1a2b….md` et son dossier deviennent `Projets.md` et `Projets/`, la structure que le plugin Pages affiche en arbre. Deux pages du même nom reçoivent « 2 ».
- **Liens** entre pages, vers les images et les pièces jointes suivent les nouveaux noms. Les liens vers des pages non exportées restent tels quels et figurent dans le rapport.
- **Propriétés** sous le titre d’une page vont dans son front matter.
- **Bases de données** : chaque ligne devient un document dans un dossier, ses propriétés dans le front matter : dates en 2026-01-04 (formats anglais, ISO et chinois), cases à cocher en true/false, nombres, sélections multiples en listes, relations en liens vers les lignes. À côté, une page affiche la base en tableau, plus un tableau de cartes si elle a un statut et un calendrier si elle a des dates.
- **Encadrés** (callouts) deviennent des notes (`> [!NOTE]`), emoji conservé. Les blocs repliables restent en `<details>`.

Le rapport compte ce qui a été importé, liste les liens introuvables et les blocs modifiés, et suggère les plugins utiles pour ce que vous avez apporté : Pages pour les sous-pages, Vues de base de données et Kanban pour les bases, Rétroliens et Aperçu rapide pour les pages liées, etc. **Extensions › Plugins utiles après un import Notion…** propose d’en installer un ; Textus demande d’abord. Rien ne s’installe tout seul.

Tout se passe sur votre ordinateur : le plugin ne lit et n’écrit que dans le dossier ouvert, et n’utilise jamais le réseau.

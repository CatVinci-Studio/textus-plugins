# Import Notion

Transforme un export Notion en simples fichiers Markdown dans le dossier ouvert, qu’Obsidian lit aussi.

Les pages et sous-pages, les images et pièces jointes, les liens entre elles et les bases de données au format Bases d’Obsidian, tout est repris.

1. Dans Notion, choisissez **Settings › Export all workspace content**, avec **Markdown & CSV** et les sous-pages incluses. Placez le .zip obtenu (ou le dossier qu’il donne une fois décompressé) dans le dossier ouvert dans Textus.
2. Choisissez **Extensions › Importer depuis Notion…** (ou faites un clic droit sur le .zip dans la barre latérale) et choisissez l’export. Un gros export découpé en Part-1.zip, Part-2.zip… dans un même zip est ouvert comme un seul. Un .zip de plus de 256 Mo est trop gros pour être lu d’un coup : décompressez-le dans le dossier ouvert et choisissez ce dossier.
3. Nommez le dossier où va l’import (**Notion** sauf si vous tapez un autre nom) ; rien de ce qui s’y trouve déjà n’est changé. Une barre de progression permet d’annuler ; ce qui est déjà écrit reste. Une page de rapport s’ouvre à la fin, et avec **Wiki** installé, la barre latérale montre l’import en arbre de pages.

## Ce que ça devient

- **Pages** : une page avec des sous-pages - une ligne de base de données avec des sous-pages aussi - devient un dossier contenant la page, `Plans/Plans.md`, ses sous-pages à côté ; une page sans sous-pages devient un fichier, `Plans.md`. Les identifiants de Notion quittent les noms ; la page d’une ligne de base de données prend son titre entier, que Notion raccourcit dans les noms de fichiers.
- **Bases de données** : chaque base de données devient un dossier avec une page qui contient un bloc `base`, les vues à un clic l’une de l’autre - son tableau kanban quand elle a un statut, son tableau, et son calendrier quand elle a des dates. Chaque ligne est une note dans ce dossier, ses propriétés dans son front matter : dates en 2026-01-04, cases à cocher, nombres, listes, relations en liens. Là où une autre page montre une base de données, elle la montre aussi, triée comme le dit l’export. Les lignes et pages vides « Untitled » de Notion sont laissées de côté.
- **Images et pièces jointes** vont dans un dossier `assets` à côté de la page qui les montre ; les images collées prennent le nom de leur page.
- **Les liens** entre pages, vers les images et vers les pièces jointes suivent les nouveaux noms. Les liens vers des pages qui n’ont pas été exportées sont listés dans le rapport.
- **Liens entre pages** : demandé au début : liens standard (recommandé), `[Page](Page.md)`, comme Notion les exporte et comme toute app les ouvre, ou des liens wiki, `[[wiki links]]`, comme Obsidian les écrit. Le dossier importé garde ce choix : une page créée plus tard dedans lie de la même façon.
- **Les encadrés** deviennent des notes (`> [!NOTE]`), leur emoji gardé. Les blocs dépliables restent en `<details>`.

**Icônes de page** : l’export Markdown de Notion les laisse de côté. Exportez aussi les mêmes pages en HTML et choisissez cet export quand l’import le demande : les icônes emoji des pages sont reprises.

**Ce qui reste derrière** : l’export de Notion n’a ni couvertures, ni commentaires, ni les filtres des vues enregistrées : ils ne sont donc pas repris ; le tri d’une vue, si. Les propriétés de formule et de rollup gardent la valeur qu’elles avaient, et les mentions de personnes et de dates deviennent du texte simple.

## Le rapport

Le rapport compte ce qui est arrivé, liste les liens introuvables, les fichiers qu’il n’a pas pu lire ou écrire et les blocs qu’il a changés, et suggère les plugins qui aident pour le reste - Wiki d’abord, pour l’arbre des pages et les bases de données ; puis Liens bidirectionnels, Aperçu rapide, Tâches, Cartes de lien, Lecteur PDF et Modèles, chacun seulement quand l’import contient de quoi l’utiliser. **Extensions › Plugins utiles après un import Notion…** propose d’en installer un ; Textus demande d’abord, et rien ne s’installe tout seul.

## Autorisations

Tout se passe sur votre appareil : le plugin ne lit et n’écrit des fichiers que dans le dossier ouvert, et n’utilise jamais le réseau. Il demande Textus 1.3.10 ou plus récent.

## Changements

- **0.7.12** - Its page is in every language Textus speaks. In Chinese, a database is 数据库, and 知识库 is only the Wiki plugin's name. Every language calls the Wiki plugin by its current name.
- **0.7.11** - Its package lists the libraries it carries, with their licenses.
- **0.7.10** - The database code it shares with Database brought up to date (its file columns filled).
- **0.7.9** - Databases it makes keep a view another plugin draws (Textus 1.4.6).
- **0.7.8** - The import report gets a free name as it is written (Textus 1.4.3).
- **0.7.7** - Bundles the Wiki plugin's newer base code; importing works as before.
- **0.7.6** - Importing a database with many rows is quicker.
- **0.7.5** - Page icons now come through from an unzipped HTML export too, and such an export shows up when you pick where the icons come from.
- **0.7.4** - Shares the database's updated filter code: a filter ticking several values reads the same in both. Shorter help and empty-state text.
- **0.7.3** - Once imported, the sidebar goes into the new folder (Textus 1.3.12) and shows its pages tree. Notion's blank rows and pages - no title, nothing written, only the "Not started" status Notion fills in - are left out.
- **0.7.2** - A database that sits under a page (as in Notion) stays a link on that page, no longer also shown there as a table; its own page shows it. Its code is split into smaller files by what each part does.
- **0.7.1** - Shares Two-way Links' fix for working out how a note links.
- **0.7.0** - asks how the pages link: standard links (recommended), as Notion exports them, or [[wiki links]] - a path shown by the page's name; the imported folder keeps the choice for pages made in it later
- **0.6.1** - Calls Workspace by its name in the import report and in the suggested plugins.
- **0.6.0** - Dates written by Textus itself; needs Textus 1.3.10.
- **0.5.0** - Page emoji icons, from Notion's HTML export of the same pages.
- **0.4.0** - Its own plugin again: pages with sub-pages as folders, databases as Obsidian bases, empty "Untitled" pages left out, and the import opened in Workspace's pages tree.
- **0.3.0** - Merged into Workspace for a while; this version only pointed there.
- **0.2.2** - One database block per database, opening on the board when there is a status.
- **0.2.1** - Asks what to name the import's folder; pasted pictures are named after their page.
- **0.2.0** - Reads Notion's newer exports: no doubled pages or rows, rows keep their whole titles, attachments go beside the page that uses them, databases shown on other pages keep their sort.
- **0.1.1** - The report suggests Two-way Links by its new name.
- **0.1.0** - First version: a Notion export (.zip or folder) into a folder of Markdown, ids out of names, links rewritten, databases as notes with front matter, callouts as notes, a report with plugins that help.

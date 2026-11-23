# Wiki

Des pages dans des pages, et des bases de données de vos notes en tableaux, tableaux kanban, calendriers, galeries et listes, le tout dans de simples fichiers Markdown.

Les bases de données s’écrivent au **format Bases d’Obsidian** (blocs ` ```base ` et fichiers `.base`) : Obsidian ouvre donc les mêmes bases de données.

## Pages

- **Une page avec des sous-pages est un dossier** : `Plans/Plans.md` est la page, et ses sous-pages sont à côté dans `Plans/` - comme les notes de dossier d’Obsidian. Tapez `/` et choisissez **Nouvelle sous-page…**, ou utilisez **Extensions › Nouvelle sous-page…**. La première sous-page déplace `Plans.md` dans son dossier pour vous, et les liens vers elle suivent.
- **L’onglet Pages** de la barre latérale montre le dossier en arbre de pages. Faites un clic droit sur une page pour créer une sous-page, la renommer, lui donner une icône ou la mettre à la corbeille (avec les pages en dessous, après confirmation). Faites glisser une page sur une autre pour en faire sa sous-page. Les liens suivent chaque déplacement.
- **Icônes de page** : **Définir l’icône de la page…** (dans le menu Extensions, ou d’un clic droit sur un document dans l’onglet Fichiers) choisit un emoji, gardé comme `icon` dans le front matter de la page.
- **Pages ou Fichiers ?** L’onglet Pages montre les pages et ce qu’il y a en dessous, comme Notion ; l’onglet Fichiers montre chaque fichier et dossier tels qu’ils sont sur le disque. Utilisez l’un ou l’autre : ce sont les mêmes fichiers.
- **Où vous êtes** : dans une sous-page, la barre d’état montre les pages au-dessus - `Life › 2026 Calendar › Week 1`.
- **Renommer le dossier d’une page** dans l’onglet Fichiers renomme sa page avec lui : elle reste une page avec des sous-pages.
- **Ancienne disposition** : `Plans.md` avec ses sous-pages dans un dossier `Plans/` à côté se lit de la même façon. **Extensions › Ranger les pages dans des dossiers…** déplace d’un coup chacune de ces pages dans son dossier, après en avoir montré la liste.

## Bases de données

Une base de données est un bloc `base` dans une page, ou un fichier `.base` ouvert dans un onglet. Ses filtres choisissent les notes : chaque note est une ligne, et les propriétés de son front matter sont les colonnes. Tapez `/` et choisissez **Nouvelle base de données…** (ou **Extensions › Nouvelle base de données…**) : cela crée un dossier pour la base de données avec une page qui contient le bloc.

````markdown
```base
filters:
  and:
    - file.inFolder(this.file.folder)
    - file.path != this.file.path
views:
  - type: kanban
    name: Board
    groupBy:
      property: status
    groupOrder: [To read, Reading, Read]
  - type: table
    name: Table
    limit: 25
```
````

- **Les vues** sont des onglets en haut du bloc : Tableau, Kanban, Calendrier, Galerie (les `cards` de Bases) et Liste. Faites un clic droit sur une vue pour son menu : sa disposition, renommer, supprimer. **+** ajoute une vue. Calendrier est propre à Textus ; Obsidian l’affiche comme une vue qu’il ne connaît pas.
- **Chaque ligne est une note.** Cliquez sur une cellule pour la changer ; la propriété est écrite dans le front matter de cette note. **Nouvelle** crée une note dans le dossier de la base de données. Une ligne s’ouvre dans un onglet, comme un fichier.
- **Colonnes** : cliquez sur l’en-tête d’une colonne pour trier par elle, la filtrer, changer son type, la renommer, la masquer ou supprimer la propriété de toutes les lignes ; **+** ajoute une propriété. Faites glisser un en-tête pour déplacer la colonne, et son bord droit pour régler sa largeur (double-cliquez sur le bord pour l’ajuster de nouveau). L’ordre et les largeurs sont gardés dans la base de données, les largeurs comme le `columnSize` d’Obsidian.
- **Kanban** : faites glisser une carte vers une autre liste pour changer sa valeur. Faites glisser une liste par son en-tête pour mettre les listes dans l’ordre voulu (`groupOrder`).
- **Calendrier** : les lignes sont placées selon une propriété de date ; cliquez sur un jour pour créer une ligne à cette date.
- **Filtrer**, **Trier** et les menus des colonnes sont gardés dans la vue comme Bases les écrit : `status == "Read"`, `tags.contains("ml")`, `due.isEmpty()`. Les filtres que Textus ne sait pas encore lire restent tels quels, signalés sous la barre.
- **Taille dans un document** : une base de données est aussi large que le texte (ou que le panneau, avec **Affichage large**) et défile de côté quand ses colonnes sont plus larges ; elle est aussi haute que ses lignes, jusqu’à la limite de Textus pour un bloc (70 % de la fenêtre, 1200 px au plus), puis défile à l’intérieur, son bas s’estompant tant qu’il reste du contenu en dessous.
- **Les longues bases de données** montrent leurs 25 premières lignes (ou la `limit` de la vue) ; faire défiler vers le bas charge le reste, l’en-tête du tableau restant visible. Le chevron à gauche d’un bloc, au survol, le replie sur une ligne ; le repli et la vue où vous le laissez sont gardés sur cet appareil seulement.
- **Les formules** (`formulas:` dans la base de données) sont calculées pour chaque ligne et peuvent servir de colonnes, de filtres et de tris : `(price / pages).toFixed(2)`. Les résumés ne sont pas encore dessinés.
- **Les types de propriétés** sont ceux d’Obsidian, tirés de `.obsidian/types.json`, quand le dossier est un coffre.
- **Dans une note intégrée** (`![[page]]`), une base de données tient sur une ligne ; cliquez dessus pour la dessiner.
- **Depuis Dataview** : placez le curseur dans un bloc ` ```dataview ` et lancez **Extensions › Convertir la requête Dataview en base**. `TABLE` et `LIST` avec `FROM`, `WHERE`, `SORT` et `LIMIT` deviennent la même base de données à la place du bloc ; `TASK`, `GROUP BY`, `FLATTEN` et `dataviewjs` sont refusés avec la raison, et rien ne change.

Les exports Notion arrivent par le plugin **Import Notion**, qui écrit des pages et des bases de données que ce plugin affiche.

## Autorisations

- **Lire et écrire les fichiers du dossier ouvert** : pour lire les notes et leurs propriétés, créer des pages et des bases de données, écrire les modifications des cellules dans le front matter, et déplacer ou renommer des pages avec leurs liens.
- **Lire et modifier le document** : pour insérer une nouvelle base de données ou sous-page et son lien, et transformer un bloc Dataview en base de données.
- **Outils pour Textus AI** : pour que Textus AI puisse créer des bases de données et des pages, lire des lignes et en ajouter.

## Changements

- **0.8.3** - The bar stays on one line when there is room: in a zoomed block on a Mac it folded the view tabs into one button and put the sorts on a line of their own, and measured itself many times on every click. A block taller than Textus lets it be fades at its foot while more rows are below, instead of looking cut off. By touch, a board card or lane lifts after a short hold, so a swipe scrolls instead of dragging. Its page is in every language Textus speaks. Its tools for Textus AI are described in every language, and in Chinese a database is 数据库 while 知识库 is the plugin's name.
- **0.8.2** - The `file.folder`, `file.path` and `file.mtime` columns show each page's folder, path and when it was last changed (they were empty).
- **0.8.1** - Rows and cards make way at the pace of the rest of Textus.
- **0.8.0** - Other plugins can add views beside the table, board, calendar, gallery and list - the Timeline plugin's timeline, for one - in the view menus. Needs Textus 1.4.6 for those.
- **0.7.16** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller. A board's lists move as Textus's own tabs do, and a column's width can also be set with the arrow keys.
- **0.7.15** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.7.14** - A column's grip is placed by Textus's shared rule, the same one as the document's tables. The calendar view and cell editing use Textus's shared page tools. Needs Textus 1.4.3.
- **0.7.13** - A column is pulled by the same grip as the document's tables, and lifts and slides the same way. Needs Textus 1.4.3.
- **0.7.12** - A view tab whose name would be cut short ("Calenda") makes the bar give way a step instead. Menu words match the app's table menu (Title Case; German, Spanish and Portuguese row words).
- **0.7.11** - A filter's verb (is, is not, is empty) is picked from Textus's own menu instead of the system's dropdown, and its option boxes are Textus's own checkboxes.
- **0.7.10** - Renaming a row in a table renames it as the Pages tree does: a page with sub-pages keeps them and stays in its database, and only the page's own title heading changes. An open `.base` file shows changes saved in Textus or written by a plugin, and never writes an older copy over a newer file: a change made meanwhile is refused with a note to make it again. Renaming a property to a name some notes already have asks first and keeps their value.
- **0.7.9** - Tables are denser: every column has one width (the title's wider) and the table scrolls sideways when they don't fit, each row is one line with longer values cut short and shown whole on hover, and rows sit closer. Tags and links no longer run over the next column. A base on screen draws again only when its rows change, not at every save in the folder. A base's bar no longer jumps back and forth between one line and two.
- **0.7.8** - Setting a column's type (number, date, checkbox, list) works again in every folder: the type is kept in the base, and Obsidian's own types are still read. A base in a document draws at the interface's text size, so a wider column shows more of it rather than larger text; Cut, Copy and Paste in a cell's right-click menu work with Textus 1.4.1.
- **0.7.7** - Every button and menu now shows its words in your language, including Japanese, Korean, German, Spanish, French, Portuguese and Russian; a board lane's tooltip no longer shows a raw name. A table now fits its page and wraps long names before it scrolls sideways; a page's icon shows in place of the file icon in the Pages tree. Needs Textus 1.4.0.
- **0.7.6** - In a narrow block the bar keeps to one line: the count goes first, then New's word, then the view tabs fold into a menu; sorts and filters ride in the bar while there's room. A filter on a select, tags or a checkbox is ticked in a list, as in Notion, with Clear selection. A dragged view tab stays where it's let go, and a view wider than the block fades at its edges. With Textus 1.3.13 the block can be shown wide, across the pane, and drawn smaller, from its right-click menu. Shorter help and empty-state text.
- **0.7.5** - A long title or text wraps within a column of a set width instead of stretching the table; a row's right-click menu is laid out as a Markdown table's (insert a row below or a column to the right, then Row and Column); the date month opens and sits under its field in every window, zoomed too; a new row is drafted in the table's own cells; a field's right-click menu is Textus's own; a view's tab can be dragged on a Mac too; needs Textus 1.3.12. Its name is Notion's word for a wiki in each language (Wiki in English); a database is a base, as Obsidian calls it (New Base…).
- **0.7.4** - a table's head stays in view while its rows scroll; more rows load as you scroll down, no Show more; a view's menu is on right-click only; columns start at widths in proportion to the block; the view you leave a block in is kept on this device, not in the note; a block folds with Textus's own caret on its left, no fold arrow of its own; a column is dragged by its head as the sidebar's tabs are, the others sliding aside; a rating column shows the same way all down; a filter added twice is kept once, and one that contradicts another (status is Done, then status is Doing) takes its place; its board, fields and stars are Textus's own controls; a row's right-click menu opens it or moves it to the Trash; view tabs are dragged into a new order; a date is typed or picked from a small month under its field; a new sub-page's link in a page just moved into its folder points from where the page is now; needs Textus 1.3.12
- **0.7.3** - Shares Two-way Links' fix for working out how a note links.
- **0.7.2** - a dragged column stays under the pointer in a zoomed document, and dragging selects no text; a date is edited as it is shown, 2026-11-08, not in the system's order; new pages and databases are linked with standard links, [Week 1](Week%201.md), unless the folder or the page already uses [[wiki links]]
- **0.7.1** - new databases and sub-pages are linked the way the folder writes links; needs Textus 1.3.10
- **0.7.0** - drag column heads to reorder and their edges to resize (`columnSize`); a view's menu on right-click; rows open in a tab; option colors from their words; **Convert Dataview query to base**
- **0.6.0** - databases are Obsidian bases (` ```base ` blocks and `.base` files) with views, filters, sorts, `groupOrder`, `limit`, formulas, folding and **Show more**; the Pages tab can rename, delete to the Trash and drag; page folders follow renames
- **0.5.0** - renamed Workspace: Pages and Notion Import merged in; a page with sub-pages becomes a folder, and **Organize Pages into Folders…** moves older pages
- **0.4.3** - card tags and long values wrap on boards and galleries
- **0.4.1-0.4.2** - Notion dates and relations read better; then the Notion import moves to the Notion Import plugin
- **0.4.0** - tools for Textus AI to read a database's rows and add rows
- **0.3.0** - Textus's own menus for properties, filters and options, and no frame around the block
- **0.2.0** - Notion-style filters and sorts, select options, property types, and columns and pages made in the table
- **0.1.0-0.1.1** - first versions: a folder's documents as a table, board, calendar or gallery, edited in place; a Notion CSV import; a tool for Textus AI to make a database

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `create_database`: Crée une base de données au format Bases d’Obsidian : un dossier de notes dont le front matter porte les propriétés de chacune, et dedans une page avec un bloc ```base qui les montre en tableau, tableau Kanban, calendrier, galerie ou liste. Renvoie un lien vers cette page, à placer où l’utilisateur le veut.
- `query_rows`: Lit les lignes d’une base de données - les notes que choisit sa base, par défaut celles de son dossier -, chacune avec son nom, son chemin et ses propriétés, filtrées et triées.
- `add_row`: Ajoute une ligne à une base de données : un document dans son dossier, au nom de la ligne, avec ses propriétés dans son front matter. Tout bloc qui montre ce dossier l'affiche. Seulement pour le dossier d’une base (create_database, query_rows) ; une simple tâche, c’est add_task.
- `create_page`: Crée une page : un document portant ce titre à la racine du dossier ouvert, ou une sous-page dans le dossier à côté de sa page parente, avec une icône si elle est donnée. Renvoie son chemin et le [[lien]] à mettre dans la page parente.
<!-- /ai-tools -->

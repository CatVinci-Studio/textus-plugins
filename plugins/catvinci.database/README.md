# Wiki

Pages within pages, and bases of your notes as tables, boards, calendars, galleries and lists, all in plain Markdown files.

Bases are written in **Obsidian's Bases format** (` ```base ` blocks and `.base` files), so Obsidian opens the same bases. The plugin runs on the desktop and on iOS.

## Pages

- **0.7.8** - Setting a column's type (number, date, checkbox, list) works again in every folder: the type is kept in the base, and Obsidian's own types are still read. A base in a document draws at the interface's text size, so a wider column shows more of it rather than larger text; Cut, Copy and Paste in a cell's right-click menu work with Textus 1.4.1.
- **A page with sub-pages is a folder**: `Plans/Plans.md` is the page, and its sub-pages sit beside it in `Plans/` - the same as Obsidian's folder notes. Type `/` and choose **New Sub-page…**, or use **Plugins › New Sub-page…**. The first sub-page moves `Plans.md` into its folder for you, and links to it follow.
- **The Pages tab** in the sidebar shows the folder as a tree of pages. Right-click a page to make a sub-page, rename it, give it an icon or move it to the Trash (with the pages under it, after asking). Drag a page onto another to make it that page's sub-page. Links follow every move.
- **Page icons**: **Set Page Icon…** (in the Plugins menu, or right-click a document in the Files tab) picks an emoji, kept as `icon` in the page's front matter.
- **Pages or Files?** The Pages tab shows pages and what is under them, the way Notion does; the Files tab shows every file and folder as they are on disk. Use either: they are the same files.
- **Where you are**: in a sub-page, the status bar shows the pages above it - `Life › 2026 Calendar › Week 1`.
- **Renaming a page's folder** in the Files tab renames its page with it, so it stays a page with sub-pages.
- **Older layout**: `Plans.md` with its sub-pages in a `Plans/` folder beside it reads the same. **Plugins › Organize Pages into Folders…** moves every such page into its folder at once, after showing the list.

## Bases

A base is a `base` block in a page, or a `.base` file opened in a tab. Its filters choose notes: each note is a row, and the properties in its front matter are the columns. Type `/` and choose **New Base…** (or **Plugins › New Base…**): it makes a folder for the base with a page that holds the block.

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

- **Views** are tabs at the block's top: Table, Board, Calendar, Gallery (Bases' `cards`) and List. Right-click a view for its menu: its layout, rename, delete. **+** adds a view. Calendar is Textus's own; Obsidian shows it as a view it doesn't know.
- **Every row is a note.** Click a cell to change it; the property is written to that note's front matter. **New** makes a note in the base's folder. A row opens in a tab, as a file does.
- **Columns**: click a column's head to sort by it, filter it, change its type, rename it, hide it or delete the property from every row; **+** adds a property. Drag a head to move the column, and drag its right edge to set its width (double-click the edge to fit it again). Order and widths are kept in the base, widths as Obsidian's `columnSize`.
- **Board**: drag a card to another list to change its value. Drag a list by its head to put the lists in the order you want (`groupOrder`).
- **Calendar**: rows are placed by a date property; click a day to make a row on that date.
- **Filter**, **Sort** and the column menus are kept in the view as Bases writes them: `status == "Read"`, `tags.contains("ml")`, `due.isEmpty()`. Filters Textus can't read yet are left as they are and said so under the bar.
- **Long bases** show their first 25 rows (or the view's `limit`); scrolling down loads the rest, the table's head staying in view. The caret on a block's left, on hover, folds it to one line; the fold and the view you leave it on are kept on this device only.
- **Formulas** (`formulas:` in the base) are worked out for each row and can be columns, filters and sorts: `(price / pages).toFixed(2)`. Summaries are not drawn yet.
- **Property types** are Obsidian's, from `.obsidian/types.json`, when the folder is a vault.
- **In an embedded note** (`![[page]]`) a base is one line; click it to draw it.
- **From Dataview**: put the caret in a ` ```dataview ` block and run **Plugins › Convert Dataview query to base**. `TABLE` and `LIST` with `FROM`, `WHERE`, `SORT` and `LIMIT` become the same base in the block's place; `TASK`, `GROUP BY`, `FLATTEN` and `dataviewjs` are refused with the reason, and nothing changes.

Notion exports come in through the **Notion Import** plugin, which writes pages and bases this plugin shows.

## Permissions

- **Read and write files in the open folder**: to read notes and their properties, make pages and bases, write cell edits to front matter, and move or rename pages with their links.
- **Read and edit the document**: to insert a new base or sub-page and its link, and to turn a Dataview block into a base.
- **Tools for Textus AI**: so Textus AI can make bases and pages, read rows and add them.

## Changes

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
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `create_database`: Makes a database in Obsidian's Bases format: a folder of notes whose front matter holds each one's properties, and a page in it with a ```base block showing them as a table, board, calendar, gallery or list. Returns a link to that page to put where the user wants it.
- `query_rows`: Reads a database's rows - the notes its base chooses, by default those in its folder - each with its name, path and properties, filtered and sorted.
- `add_row`: Adds a row to a database: a document in its folder, named for the row, with its properties in its front matter. Every block showing that folder shows it. Only for a database folder (create_database, query_rows); a plain to-do is add_task.
- `create_page`: Makes a page: a document titled as given at the top of the open folder, or a sub-page in the folder beside its parent page, with an icon if given. Returns its path and the [[link]] to put in the parent.
<!-- /ai-tools -->

# Workspace

Pages within pages, and databases of your notes as tables, boards, calendars, galleries and lists. Databases are written in **Obsidian's Bases format**, so Obsidian opens the same databases; everything is plain Markdown files.

## Pages

- **A page with sub-pages is a folder**: `Plans/Plans.md` is the page, its sub-pages sit beside it in `Plans/` - the same as Obsidian's folder notes. Type `/page` (or **New Sub-page…**) to make one: the first sub-page moves `Plans.md` into its folder for you, and links to it follow.
- **The Pages tab** in the sidebar shows the folder as a tree of pages. Right-click a page to make a sub-page, rename it, give it an icon or move it to the Trash; drag it onto another page to make it that page's sub-page. Links follow every move.
- **Pages or Files?** The Pages tab shows pages and what is under them, the way Notion does; the Files tab shows every file and folder as they are on disk. Use either: they are the same files.
- **Where you are**: in a sub-page, the status bar shows the pages above it - `Life › 2026 Calendar › Week 1`.
- **Renaming a page's folder** in the Files tab renames its page with it, so it stays a page with sub-pages.
- **Older layout**: `Plans.md` with its sub-pages in a `Plans/` folder beside it reads the same. **Organize Pages into Folders…** moves every such page into its folder at once, after showing the list.

## Databases

A database is a `base` block in a page (or a `.base` file): its filters choose notes, each note a row and the properties in its front matter the columns. Type `/database` or **New Database…**: it makes a folder for the database with a page that holds the block.

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

- **Views** are tabs at the block's top: Table, Board, Calendar, Gallery and List. Click the one in front for its menu (its layout, rename, delete); **+** adds one. Calendar is Textus's own; Obsidian shows it as a view it doesn't know.
- **Every row is a note.** Click a cell to change it; the property is written to that note's front matter. **New** makes a note in the database's folder. Open a row and it opens beside the database.
- **Board**: drag a card between lists to change its value, drag a list's head to put the lists in the order you want (`groupOrder`).
- **Filter**, **Sort** and each column's menu are kept in the view as Bases writes them: `status == "Read"`, `tags.contains("ml")`, `due.isEmpty()`. Filters Textus can't read yet are left as they are and said so under the bar.
- **Long databases** show their first 25 rows (or the view's `limit`); **Show more** under them lets the rest in. The arrow at the bar's left folds a database to its bar, on this computer only.
- **Formulas** (`formulas:` in the base) are worked out for each row and can be columns, filters and sorts: `(price / pages).toFixed(2)`. Summaries are not drawn yet.
- **Property types** are Obsidian's, in `.obsidian/types.json`, when the folder is a vault.
- **In an embedded note** (`![[page]]`) a database is one line; click it to draw it.

Notion exports come in through the **Notion Import** plugin, which writes pages and databases this plugin shows.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `create_database`: Makes a database in Obsidian's Bases format: a folder of notes whose front matter holds each one's properties, and a page in it with a ```base block showing them as a table, board, calendar, gallery or list. Returns a link to that page to put where the user wants it.
- `query_rows`: Reads a database's rows - the notes its base chooses, by default those in its folder - each with its name, path and properties, filtered and sorted.
- `add_row`: Adds a row to a database: a document in its folder, named for the row, with its properties in its front matter. Every block showing that folder shows it. Only for a database folder (create_database, query_rows); a plain to-do is add_task.
- `create_page`: Makes a page: a document titled as given at the top of the open folder, or a sub-page in the folder beside its parent page, with an icon if given. Returns its path and the [[link]] to put in the parent.
<!-- /ai-tools -->

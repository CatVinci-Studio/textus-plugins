# Workspace

Pages within pages, and databases of your documents as tables, boards, calendars and galleries - all kept as plain Markdown files that any other app reads. It can also bring in a whole Notion export as a workspace ready to use.

## Pages

- **A page with sub-pages is a folder**: `Plans/Plans.md` is the page, its sub-pages sit beside it in `Plans/`. Type `/page` (or **New Sub-page…**) to make one: the first sub-page moves `Plans.md` into its folder for you, and links to it follow.
- **The Pages tab** in the sidebar shows the folder as a tree of pages; right-click one for a new sub-page or its icon. **Set Page Icon…** puts an emoji in the page's front matter (`icon: 📅`).
- **Where you are**: in a sub-page, the status bar shows the pages above it - `Life › 2026 Calendar › Week 1`.
- **Older layout**: `Plans.md` with its sub-pages in a `Plans/` folder beside it reads the same. **Organize Pages into Folders…** moves every such page into its folder at once, after showing the list; links follow.

## Databases

A folder of documents is a database: each document a row, the properties in its front matter the columns. Put a `database` block in a page - type `/database` or **New Database…** - and choose Table, Board, Calendar or Gallery at its top:

````markdown
```database
view: board
group: status
rows:
| Name | status | year |
| --- | --- | --- |
| Segment Anything | Read | 2023 |
```
````

- **In its own folder** (`Papers/Papers.md`), a block shows that folder; elsewhere, `from: Papers` names it.
- **Rows with nothing written in them** live in the block itself, as the table under `rows:` - readable in any editor, and no file for each. Open one to write in it and it becomes a page of its own in the folder, its properties in its front matter; each row is only ever in one place.
- **Table**: click a cell to change it. **Board**: lists by a select (a status), drag a card to change it. **Calendar**: each row on its `date`, across to its `end`. **Gallery**: a card per row, with its `cover` or `icon`.
- **Filter**, **Sort** and each column's menu (sort, filter, type, rename, hide, delete) are kept in the block as lines you can read: `sort: -year`, `filter: status = Read`, `group:`, `date:`, `end:`, `types: status=select`.
- **Big databases**: `folders: year` keeps each row's file in a subfolder per value (`folders: date:year` per year of a date); a row moves when its value changes, links following.

## Import from Notion

1. In Notion, choose **Settings › Export all workspace content**, with **Markdown & CSV** and sub-pages included. Put the .zip (or the folder it unzips to) in the folder open in Textus.
2. Choose **Plugins › Import from Notion…** (or right-click the .zip in the sidebar), name the folder it goes into (**Notion** unless you type another), and say whether databases of more than 200 pages go into a folder per year. A .zip over 256 MB: unzip it first and pick the folder.
3. A report page opens at the end: what came in, the links it couldn't find, the blocks it changed, and the plugins that help with the rest.

What it becomes: pages and sub-pages as above, Notion's ids gone from names and whole titles kept; each database a folder unit with one block whose views are a click apart (on its board when it has a status), the rows with written pages as files and the rest in its table; properties as front matter (dates as 2026-01-04, checkboxes, numbers, lists, relations as links); pictures in an `assets` folder beside the page that shows them, named after it; callouts as `> [!NOTE]`; links following everything. Notion's export has no page icons, covers, comments or view filters, so they stay behind; a view's sort comes over. Everything happens on your computer.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `create_database`: Makes a database in Obsidian's Bases format: a folder of notes whose front matter holds each one's properties, and a page in it with a ```base block showing them as a table, board, calendar, gallery or list. Returns a link to that page to put where the user wants it.
- `query_rows`: Reads a database's rows - the notes its base chooses, by default those in its folder - each with its name, path and properties, filtered and sorted.
- `add_row`: Adds a row to a database: a document in its folder, named for the row, with its properties in its front matter. Every block showing that folder shows it. Only for a database folder (create_database, query_rows); a plain to-do is add_task.
- `create_page`: Makes a page: a document titled as given at the top of the open folder, or a sub-page in the folder beside its parent page, with an icon if given. Returns its path and the [[link]] to put in the parent.
<!-- /ai-tools -->

# Notion Import

Brings a Notion export into Textus as plain Markdown files: pages and sub-pages, pictures and attachments, the links between them, and databases.

1. In Notion, choose **Settings › Export all workspace content**, with **Markdown & CSV** and sub-pages included. Put the .zip it gives you (or the folder it unzips to) in the folder open in Textus.
2. Choose **Plugins › Import from Notion…** (or right-click the .zip in the sidebar) and pick the export. A large export split into Part-1.zip, Part-2.zip… inside one zip is opened as one. A .zip over 256 MB is too big to read at once: unzip it, and the Part zips inside it, into one folder in the open folder and pick that folder.
3. Name the folder the import goes into (**Notion** unless you type another); nothing already there is changed. A report page opens at the end.

What it becomes:

- **Pages**: `Plans 1a2b….md` and its folder become `Plans.md` and `Plans/`, the layout the Pages plugin shows as a tree, for Notion's older exports and its newer ones alike. A database row's page takes its whole title, which Notion cuts short in file names. Two pages with one name take their own titles when those differ, else get " 2".
- **Pictures and attachments** go into an `assets` folder beside the page that shows them (newer exports keep them all in one `attachments` folder); one no page uses stays in `attachments`. Notion calls every pasted picture "image": those take their page's name ("Weekly sync.png", "Weekly sync 2.png"), other files keep theirs. Pictures stay on your computer even when Textus uploads new ones to an image host.
- **Links** between pages, to pictures and to attachments follow the new names. Links to pages that weren't exported stay as they were and are listed in the report.
- **Properties** under a database row's title go into its front matter; on other pages such lines stay as text.
- **Databases**: each row becomes a document in a folder, its properties in front matter: dates as 2026-01-04 (English, Chinese, Japanese, Korean, German, French, Spanish, Portuguese and ISO formats), checkboxes as true/false, numbers, multi-selects as lists, relations as links to the rows. Beside it, a page shows the database as a table, plus a board when it has a status and a calendar when it has dates, after what the database's own page said. Where a page shows a database, it shows it there too, sorted as the export says.
- **Callouts** become notes (`> [!NOTE]`), their emoji kept. Toggles stay as `<details>`.

What stays behind: Notion's export has no page icons, covers, comments or the filters of saved database views (only their properties' names), so they don't come over; a view's sort does. Formula and rollup properties keep the value they had, columns come one after another, an inline database becomes a link to its page, and mentions of people and dates are plain text.

The report counts what was imported, lists the links it couldn't find and the blocks it changed, and suggests the plugins that help with what you brought over: Pages for sub-pages, Database Views for databases, Two-way Links and Quick Preview for linked pages, and so on. **Plugins › Plugins That Help After a Notion Import…** offers to install one; Textus asks first. Nothing is installed by itself.

Everything happens on your computer: the plugin reads and writes files in the open folder only, and never uses the network.

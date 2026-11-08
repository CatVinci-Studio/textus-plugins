# Notion Import

Brings a Notion export into Textus as plain Markdown files that Obsidian reads too: pages and sub-pages, pictures and attachments, the links between them, and databases in Obsidian's Bases format.

1. In Notion, choose **Settings › Export all workspace content**, with **Markdown & CSV** and sub-pages included. Put the .zip it gives you (or the folder it unzips to) in the folder open in Textus.
2. Choose **Plugins › Import from Notion…** (or right-click the .zip in the sidebar) and pick the export. A large export split into Part-1.zip, Part-2.zip… inside one zip is opened as one. A .zip over 256 MB is too big to read at once: unzip it into the open folder and pick that folder.
3. Name the folder the import goes into (**Notion** unless you type another); nothing already there is changed. A report page opens at the end, and with **Workspace** installed the sidebar shows the import as a tree of pages.

What it becomes:

- **Pages**: a page with sub-pages - a database row with sub-pages too - becomes a folder with the page inside, `Plans/Plans.md`, its sub-pages beside it; a page without is a file, `Plans.md`. Notion's ids leave the names; a database row's page takes its whole title, which Notion cuts short in file names.
- **Databases**: each database becomes a folder with a page holding a `base` block, the views a click apart - its board when it has a status, its table, and its calendar when it has dates. Every row is a note in that folder, its properties in its front matter: dates as 2026-01-04, checkboxes, numbers, lists, relations as links. Where another page shows a database, it shows it there too, sorted as the export says. Notion's empty "Untitled" rows and pages are left out.
- **Pictures and attachments** go into an `assets` folder beside the page that shows them; pasted pictures take their page's name.
- **Links** between pages, to pictures and to attachments follow the new names. Links to pages that weren't exported are listed in the report.
- **Callouts** become notes (`> [!NOTE]`), their emoji kept. Toggles stay as `<details>`.

What stays behind: Notion's export has no page icons, covers, comments or the filters of saved views, so they don't come over; a view's sort does. Formula and rollup properties keep the value they had, and mentions of people and dates are plain text.

The report counts what came in, lists the links it couldn't find and the blocks it changed, and suggests the plugins that help with the rest - Workspace first, for the pages tree and the databases. **Plugins › Plugins That Help After a Notion Import…** offers to install one; Textus asks first.

Everything happens on your computer: the plugin reads and writes files in the open folder only, and never uses the network.

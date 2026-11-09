# Notion Import

Turns a Notion export into plain Markdown files in the open folder, which Obsidian reads too.

Pages and sub-pages, pictures and attachments, the links between them, and databases in Obsidian's Bases format all come over.

1. In Notion, choose **Settings › Export all workspace content**, with **Markdown & CSV** and sub-pages included. Put the .zip it gives you (or the folder it unzips to) in the folder open in Textus.
2. Choose **Plugins › Import from Notion…** (or right-click the .zip in the sidebar) and pick the export. A large export split into Part-1.zip, Part-2.zip… inside one zip is opened as one. A .zip over 256 MB is too big to read at once: unzip it into the open folder and pick that folder.
3. Name the folder the import goes into (**Notion** unless you type another); nothing already there is changed. A progress bar lets you cancel; what was written so far stays. A report page opens at the end, and with **Workspace** installed the sidebar shows the import as a tree of pages.

## What it becomes

- **Pages**: a page with sub-pages - a database row with sub-pages too - becomes a folder with the page inside, `Plans/Plans.md`, its sub-pages beside it; a page without is a file, `Plans.md`. Notion's ids leave the names; a database row's page takes its whole title, which Notion cuts short in file names.
- **Databases**: each database becomes a folder with a page holding a `base` block, the views a click apart - its board when it has a status, its table, and its calendar when it has dates. Every row is a note in that folder, its properties in its front matter: dates as 2026-01-04, checkboxes, numbers, lists, relations as links. Where another page shows a database, it shows it there too, sorted as the export says. Notion's empty "Untitled" rows and pages are left out.
- **Pictures and attachments** go into an `assets` folder beside the page that shows them; pasted pictures take their page's name.
- **Links** between pages, to pictures and to attachments follow the new names. Links to pages that weren't exported are listed in the report.
- **Links between pages**: asked at the start: standard links (recommended), `[Page](Page.md)`, as Notion exports them and every app opens, or `[[wiki links]]` as Obsidian writes them. The imported folder keeps the choice, so a page made in it later links the same way.
- **Callouts** become notes (`> [!NOTE]`), their emoji kept. Toggles stay as `<details>`.

**Page icons**: Notion's Markdown export leaves them out. Export the same pages as HTML too and pick it when the import asks: the pages' emoji icons come over.

**What stays behind**: Notion's export has no covers, comments or the filters of saved views, so they don't come over; a view's sort does. Formula and rollup properties keep the value they had, and mentions of people and dates are plain text.

## The report

The report counts what came in, lists the links it couldn't find, the files it couldn't read or write and the blocks it changed, and suggests the plugins that help with the rest - Workspace first, for the pages tree and the databases; then Two-way Links, Quick Preview, Tasks, Link Cards, PDF Viewer and Templates, each only when the import has what it helps with. **Plugins › Plugins That Help After a Notion Import…** offers to install one; Textus asks first, and nothing is installed by itself.

## Permissions

Everything happens on your device: the plugin reads and writes files in the open folder only, and never uses the network. It works on desktop and iPhone and needs Textus 1.3.10 or later.

## Changes

- **0.7.2** - Its code is split into smaller files by what each part does; nothing changes in use.
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

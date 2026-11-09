# Zotero

Cite from your Zotero library while you write.

## Before you start

Zotero 7 or later (Zotero 10 too) must be running on the same computer, with **Settings › Advanced › Allow other applications on this computer to communicate with Zotero** turned on. The plugin talks only to Zotero on your computer; nothing leaves it. It runs on the desktop.

## Citing

- Press **Ctrl+Alt+R** (**⌘⌥R** on a Mac), choose **Insert a Citation from Zotero…** in the right-click menu, or **Plugins › Insert a Citation from Zotero…**. The works you cited lately come first, then a search of your library.
- With words selected, they are what is searched for.
- Pick an item and the citation goes in at the caret.
- Rest the pointer on a citation, or on a link to a Zotero item, to see its authors, year, where it appeared and the start of its abstract.
- **Plugins › Insert References List** adds a **References** section at the end with every work the document cites, sorted by first author and year. Run it again and the list is replaced, not added twice.

## How a citation is written

Choose it in the plugin's settings under **A citation is written as**:

- **A Pandoc key: [@key]** (the default). These become formatted references when you export with Pandoc and pick a bibliography (.bib) in **Settings › Editor & Appearance › Export**.
- **Author and year: (Author, 2024)**.
- **An Obsidian note link: [[@key]]**, a link to the item's literature note. If the note doesn't exist yet, the plugin offers to make it.
- **A link that opens Zotero**.

The citation key is the item's Citation Key field (or a `Citation Key:` line in Extra, as Better BibTeX writes it).

## Literature notes

- **Plugins › New Literature Note from Zotero…** makes `@citekey.md` (or opens it if it is there) with the item's title, authors, year, abstract, DOI or URL, and its highlights and notes from Zotero.
- Notes go in **References** in the open folder; change it with **Literature notes folder**.
- **Literature note template** can point to a Markdown file in the folder, such as `Templates/Literature.md`, using `{{title}}`, `{{authors}}`, `{{year}}`, `{{abstract}}`, `{{citekey}}`, `{{DOI}}`, `{{URL}}`, `{{highlights}}`, `{{notes}}` and `{{date:YYYY-MM-DD}}`. Left empty, a plain note with front matter is made.
- In an Obsidian vault, the folder and template set in the Zotero Integration or Citations plugin are followed. A template written for another template language falls back to the plain note.

## Permissions

- **Network, localhost:23119 only**: to reach Zotero's local API on this computer.
- **Read and edit the document**: to insert citations and the references list, and to search for the selected words.
- **Read and write files in the open folder**: to read templates and a vault's Zotero settings, and to make literature notes.
- **Tools for Textus AI**: so Textus AI can search your library.

## Changes

- **0.4.1** - Its code is split into smaller files by what each part does; nothing changes in use.
- **0.4.0** - literature note templates are filled by Textus's own template engine; needs Textus 1.3.10
- **0.3.0** - literature notes from Zotero, with a template and an Obsidian vault's settings; citations as `[[@citekey]]`
- **0.2.1** - the shortcut moves from Ctrl+Alt+C to Ctrl+Alt+R
- **0.2.0** - a tool for Textus AI, `search_library`
- **0.1.3** - listed for the desktop only
- **0.1.2** - works with Zotero 10's local API; the references list is replaced when made again, and code is never read for citations
- **0.1.0-0.1.1** - first versions: citing with recent works first, hover cards for citations, the references list, four citation styles

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `search_library`: Searches the user's Zotero library on this computer (Zotero 7 or later must be running): each item's key, title, authors, year, type, where it appeared, citation key, and the citation to insert in the user's chosen style. Fails with what to do when Zotero can't be reached.
<!-- /ai-tools -->

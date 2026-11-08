# Zotero

Cite from your Zotero library while you write.

- Needs Zotero 7 or later (Zotero 10 too) running, with **Settings › Advanced › Allow other applications on this computer to communicate with Zotero** on.
- **Ctrl+Alt+R** (**⌘⌥R** on a Mac), right-click › **Insert a Citation from Zotero…**, or the Plugins menu: the works you cited lately come first, then a search of your library.
- With words selected, they are what is searched for.
- Pick an item and the citation goes in at the caret.
- **Plugins › Insert References List** adds a list of every work the document cites at its end.
- **Plugins › New Literature Note from Zotero…** makes `@citekey.md` in References (or opens it if it is there) with the item's title, authors, year, abstract, DOI or URL, and its highlights and notes from Zotero. A template file can be set; in an Obsidian vault, Zotero Integration's or Citations' folder and template are followed.
- Citations can also be written Obsidian's way, `[[@citekey]]`: a link to that literature note, which is offered once you cite.
- How a citation is written is in the plugin's settings.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `search_library`: Searches the user's Zotero library on this computer (Zotero 7 or later must be running): each item's key, title, authors, year, type, where it appeared, citation key, and the citation to insert in the user's chosen style. Fails with what to do when Zotero can't be reached.
<!-- /ai-tools -->

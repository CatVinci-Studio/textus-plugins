# Two-way Links

> Links like `[[Note]]` are built into Textus: you can write and follow them without any plugin. This plugin helps you write them, shows what they point to in place, and lists who links to the document in front.

## Linking as you type

- Type `[[` and pick a note in the panel that opens - by its name, its first heading or an `aliases` entry of its front matter. An alias is written as `[[Note|alias]]`.
- After `#`, the note's headings: `[[Note#Heading]]`. `[[#` lists the document's own.
- After `#^`, its blocks: paragraphs, list items, tables, quotes. One without an id gets one at its end in that note (`^1a2b3c`), as Obsidian writes them.
- Select some words and type `[[` to make them a link.
- Links are written the way the folder writes them: in an Obsidian vault, with the vault's link format.

## Embeds

- `![[Note]]` shows the note in place, `![[Note#Heading]]` that section and `![[Note#^id]]` that block - read-only, and up to date when the note changes.
- Put the caret on the line to edit the link itself.

## Backlinks in the sidebar

What links to the document in front, and where it links to - in the **Two-way Links** tab of the sidebar.

- **Linked mentions**: the lines of other notes that link here, with [[wiki links]] or links to this file. Click one to go there.
- **Unlinked mentions**: lines that name this note - by its file name, first heading or `aliases` in its front matter - without a link. Right-click one and choose **Link** to make it a [[link]].
- **Outgoing links**: the notes this one links to, and the ones it links to that don't exist yet.
- The field at the top filters the list.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `list_backlinks`: For a document - the one in front unless a path is given - lists the notes linking to it (path, line, the line's text), the lines naming it without a link, and the notes it links to.
<!-- /ai-tools -->

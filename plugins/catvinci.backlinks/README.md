# Two-way Links

Link notes, headings and blocks as you type `[[`, embed them with `![[`, and see in the sidebar what links to the document in front.

Links like `[[Note]]` are built into Textus: you can write and follow them without any plugin. This plugin helps you write them, shows what they point to in place, and lists the links around the document you are reading. It works on the desktop and on iOS.

## Linking as you type

- Type `[[` and pick a note in the panel that opens - by its file name, its first heading or an `aliases` entry of its front matter. An alias is written as `[[Note|alias]]`.
- After `#`, the note's headings: `[[Note#Heading]]`. `[[#` lists the document's own headings.
- After `#^`, its blocks: paragraphs, list items, tables, quotes. A block without an id gets one at its end in that note (`^1a2b3c`), the way Obsidian writes them.
- Select some words and type `[[` to make them a link.
- Links are written the way the folder writes them: its own choice, or an Obsidian vault's link format; else as the note already links; else a standard link, `[Nov 8](Week45/Nov%208.md)`, which opens in any app. A [[link]] that needs a path shows the note's name.

## Embeds

- `![[Note]]` shows the note in place, `![[Note#Heading]]` that section and `![[Note#^id]]` that block. Embeds are read-only and update when the note changes.
- Put the caret on the line to edit the link itself.

## Links in the sidebar

The **Two-way Links** tab of the sidebar shows what links to the document in front, and where it links to.

- **Linked mentions**: the lines of other notes that link here, with [[wiki links]] or links to this file. Click one to go there.
- **Unlinked mentions**: lines that name this note - by its file name, first heading or `aliases` - without a link. Right-click one and choose **Link** to turn it into a link. If the line uses an alias, the alias stays as the link's text.
- **Outgoing links**: the notes this one links to, including the ones that don't exist yet.
- The field at the top filters the list.

## Standard links or [[wiki links]]

- **Plugins › New Links: Standard or [[Wiki]]…** chooses how new links in the open folder are written. The choice is kept in the folder's `.textus/settings.json`, and Textus and the other plugins follow it.
- **Plugins › Convert Links to Standard…** and **Convert Links to [[Wiki Links]]…** rewrite the links of the document in front or of every note in the folder. They say first how many links will change; each still goes where it went. Code, the front matter, and a link whose note can't be found are left as they are; pictures and other files stay standard links.

## Permissions

- **Read and edit the document**: to complete links as you type and turn a selection into a link.
- **Read and write files in the open folder**: to find links and mentions, add a link to an unlinked mention, and give a block its `^id`.
- **Tools for Textus AI**: so Textus AI can list a document's links.

## Changes

- **0.4.1** - In a note with no links yet, [[ writes a standard link: the [[ being typed was taken for a wiki link the note already had.
- **0.4.0** - New Links: Standard or [[Wiki]]… chooses how the folder writes new links, and Convert Links turns a note's or the whole folder's links from one way into the other; [[ writes the folder's way, a standard link where nothing says otherwise.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - `[[` completion for notes, headings and blocks; `![[` embeds; renamed from Backlinks to Two-way Links
- **0.2.1** - the description says "two-way links", so a store search finds it
- **0.2.0** - a tool for Textus AI, `list_backlinks`
- **0.1.0-0.1.1** - first versions: linked and unlinked mentions with **Link**, outgoing links and a filter; suggested for documents with wiki links

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `list_backlinks`: For a document - the one in front unless a path is given - lists the notes linking to it (path, line, the line's text), the lines naming it without a link, and the notes it links to.
<!-- /ai-tools -->

# Images Follow Document

Keeps each document's pictures in a folder beside it named after it, as Typora and VS Code do: the pictures of `Note.md` go in `Note.assets/`.

There is nothing to turn on or set; it works on its own once installed.

- Paste or drop a picture into a saved document. Textus saves the picture first, then this plugin moves it into the document's folder and changes the link to `Note.assets/picture.png`. A name that is already taken gets a number; nothing is written over. If the link can't be changed, the picture goes back where it was.
- Rename a document within its folder and its picture folder is renamed with it, links included - unless another document also links into that folder, in which case both stay as they are.
- Pictures already in your documents stay where they are.
- In an Obsidian vault that sets an attachment folder, and in a Logseq graph, pictures stay where that app puts them.

It handles PNG, JPEG, GIF, WebP, AVIF, BMP, SVG, ICO, HEIC and TIFF pictures. It works on desktop and needs Textus 1.3.0 or later. It asks to read and write files, to move pictures and rename their folders, and to read and edit the document in front, to change the link to a moved picture.

## Changes

- **0.1.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.2** - Leaves pictures where an Obsidian vault's attachment folder setting or a Logseq graph puts them.
- **0.1.1** - A shorter name: Images Follow Document.
- **0.1.0** - First version: pasted and dropped pictures move into `Note.assets/`, and the folder follows a renamed document.

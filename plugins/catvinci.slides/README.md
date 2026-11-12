# Marp

Presents a document as slides, written the [Marp](https://marp.app) way.

## Making slides

- A new slide starts at each `---`.
- **Plugins › Present as Slides** shows the deck in a tab beside the document, following your writing. ← → (or ↑ ↓, Page Up and Page Down) and Space move between slides; **Full Screen** (or F) presents.
- Marp's directives choose the theme and layout, for example at the top:

```markdown
---
theme: gaia
paginate: true
---
```

- Pictures show in the deck, including Obsidian's `![[photo.png]]`; `![[photo.png|300]]` sets the width (`300x200` both sizes).

## Saving a deck

**Plugins › Export Slides as HTML** (or **Save HTML** in the deck) saves `name.slides.html` beside the document: one file that presents itself in any browser, with the same keys. Pictures are linked from the document's folder, so keep the file beside them. The document must be saved first.

Built on [Marp Core](https://github.com/marp-team/marp-core) (MIT), which brings its themes (default, gaia, uncover), math and code highlighting - and makes this plugin about 4 MB.

## Permissions

- **Read the document**: to draw its slides as you write.
- **Read and write files**: to find the pictures it shows, and to save the HTML deck beside the document.
- **Tools for Textus AI**: so Textus AI can save the deck for you.

It runs on the desktop and on iOS.

## Changes

- **0.3.5** - Writing a deck with many pictures is lighter: the slides are made again only when the text changed, and pictures it no longer shows are let go.
- **0.3.4** - Full Screen works in the tab (presenting in place where the window can't go full screen); the deck renders only while its tab is open; shortcuts leave Cmd/Ctrl/Alt keys alone.
- **0.3.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - pictures in the deck, including Obsidian's `![[picture]]` embeds with a width
- **0.3.0** - a tool for Textus AI, `export_slides`
- **0.2.0** - named Marp in every language; Textus's own buttons and colors; labels follow the interface language
- **0.1.0-0.1.1** - first versions: a live deck beside the document, full screen, and a self-presenting HTML file

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `export_slides`: Saves the document in front as a Marp slide deck - slides apart at each --- line - in one HTML file beside it (name.slides.html) that presents itself in any browser. Returns its path and how many slides it has.
<!-- /ai-tools -->

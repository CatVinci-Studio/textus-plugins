# Mind Map

Draw a Markdown outline of headings and lists as a mind map, in a code block.

Write a code block with the language `markmap` and put an outline in it: headings (`#`, `##`) and list items become the map's branches. The map is drawn below the block; click into the block to see and edit its source again.

- Drag the map to move it and zoom in or out. Click the dot on a branch to fold or unfold it.
- Write `height=400` after the language to set the map's height in pixels (360 by default).
- Branches take your theme's colors, and the map is drawn again when you switch themes.
- An export to HTML, PDF or Word carries the map as a picture, even one scrolled out of sight.

The plugin uses [markmap](https://markmap.js.org). It asks for one permission, to give Textus AI the `check_markmap` tool listed below: it checks a block before Textus AI writes it into a document. It works on the desktop and on iPhone and iPad.

## Example

```markmap
# Project
## Goals
- Ship 1.3
- Write the guide
## People
- Writers
- Reviewers
```

## Changes

- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - A mind map scrolled out of sight exports as its picture instead of its source.
- **0.3.0** - Textus AI can check a `markmap` block before it writes one.
- **0.2.0** - Branch colors come from the theme's tones. Needs Textus 1.3.2.
- **0.1.3** - Uses the theme's document text color and footnote size under their Textus 1.3 names.
- **0.1.0-0.1.2** - First versions: `markmap` code blocks drawn in the document, `height=`, and exports as a picture in the export's colors.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `check_markmap`: Checks the source of a ```markmap block - a Markdown outline whose headings and list items are the mind map's branches - before it goes into a document, without drawing it. Returns ok, or the problems to fix first. Pass the source without its fence.
<!-- /ai-tools -->

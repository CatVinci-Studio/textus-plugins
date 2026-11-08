# Timeline

Draws events as a timeline, one per line: when | what | more.

## Drawing a timeline

- Write a code block in `timeline` with one event per line: when it happened, what happened, and an optional note, split by `|`. The timeline is drawn below the block, and the source shows again when you click into it.
- Events are drawn in the order you write them, down a line with a dot for each. "When" can be any text: a date, a year, "Day 3".
- An empty line is skipped. Text after a third `|` isn't shown.
- `height=400` after the language sets the drawing's height.
- The timeline takes the theme's colors and is drawn again when the theme changes.
- An export - HTML, PDF, Word - carries the timeline as a picture.

## Example

```timeline
2024-03 | First draft | The outline and two chapters
2024-09 | Review | Notes from three readers
2025-01 | Published
```

## Permissions

It asks only for **Tools for Textus AI**, so Textus AI can check a block before it writes one. It reads no files and draws everything on your device, on the desktop and on iOS.

## Changes

- **0.3.0** - a tool for Textus AI, `check_timeline`
- **0.2.0** - the theme's colors, drawn again when the theme changes
- **0.1.3** - text in the theme's colors on Textus 1.3
- **0.1.2** - keeps up with quick edits: an older drawing never replaces a newer one
- **0.1.0-0.1.1** - first versions: events drawn as a timeline, a height setting, pictures in exports

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `check_timeline`: Checks the source of a ```timeline block - one event per line, written when | what | more - before it goes into a document, without drawing it. Returns ok, or the problems to fix first. Pass the source without its fence.
<!-- /ai-tools -->

# Sheet Music (ABC)

Draws sheet music from ABC notation written in a code block.

Write a code block with the language `abc`. The music is engraved right below it, and clicking into the block shows the source again so you can edit it.

- Write `height=400` after `abc` on the opening line to set the drawing's height in pixels.
- The notes take the theme's text color and are drawn again when you switch between light and dark.
- Exports to HTML, PDF and Word carry the music as a picture.

It works on desktop and iPhone and needs Textus 1.3.2 or later. It asks for one permission, Textus AI tools, so that Textus AI can check an `abc` block before writing it into a document.

## Example

```abc
X:1
T:Scale
M:4/4
L:1/4
K:C
C D E F | G A B c |
```

## Changes

- **0.3.0** - Textus AI can check an `abc` block before writing it (`check_abc`).
- **0.2.0** - The notes follow the theme's text color; needs Textus 1.3.2.
- **0.1.3** - Uses Textus's renamed document colors.
- **0.1.2** - Exported pictures keep the music's width and height.
- **0.1.0-0.1.1** - First versions: `abc` blocks drawn under their source, `height=`, pictures in exports; store page and icon.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `check_abc`: Checks the source of a ```abc block - ABC music notation: a header of fields ending in K:, then the notes - before it goes into a document, without drawing it. Returns ok, or the problems to fix first. Pass the source without its fence.
<!-- /ai-tools -->

# Sheet Music (ABC)

Sheet music from ABC notation.

- Write a code block in `abc`: it is drawn below, and its source shows again when you click into it.
- `height=400` after the language sets the drawing's height.
- An export - HTML, PDF, Word - carries the drawing as a picture.

## Example

```abc
X:1
T:Scale
M:4/4
L:1/4
K:C
C D E F | G A B c |
```

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `check_abc`: Checks the source of a ```abc block - ABC music notation: a header of fields ending in K:, then the notes - before it goes into a document, without drawing it. Returns ok, or the problems to fix first. Pass the source without its fence.
<!-- /ai-tools -->

# Function Plot

Graphs of functions, one per line: sin(x), x^2 - 1.

- Write a code block in `function-plot`: it is drawn below, and its source shows again when you click into it.
- `height=400` after the language sets the drawing's height.
- An export - HTML, PDF, Word - carries the drawing as a picture.
- `xmin=-5 xmax=5` (and `ymin`, `ymax`) after the language set the range; it knows + - * / ^, x, pi, e and sin, cos, tan, exp, ln, log, sqrt, abs.

## Example

```function-plot
sin(x)
x^2 / 4 - 1
```

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `check_function_plot`: Checks the source of a ```function-plot block - functions of x, one per line, with + - * / ^, brackets, pi, e and the usual functions - before it goes into a document, without drawing it. Returns ok, or the problems to fix first. Pass the source without its fence.
<!-- /ai-tools -->

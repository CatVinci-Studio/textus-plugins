# Function Plot

Draws graphs of functions of x, one per line, such as sin(x) or x^2 - 1.

## Drawing a graph

- Write a code block in `function-plot` with one function per line. The graph is drawn below it, and the source shows again when you click into the block.
- A line may start with `y =`. `2x` and `3sin(x)` mean multiplication.
- It knows + - * / ^, brackets, x, pi (π), e and sin, cos, tan, asin, acos, atan, sinh, cosh, tanh, exp, ln, log (base 10), sqrt, abs, floor and ceil.
- x runs from -10 to 10. Write `xmin=-5 xmax=5` after the language to change that; `ymin` and `ymax` fix the y range, which otherwise fits the curves.
- `height=400` after the language sets the drawing's height.
- A line it can't read says what is wrong under the block.
- Each curve takes a color from the theme, and the graph is drawn again when the theme changes.
- An export - HTML, PDF, Word - carries the graph as a picture.

## Example

```function-plot xmin=-5 xmax=5
sin(x)
x^2 / 4 - 1
```

## Permissions

It asks only for **Tools for Textus AI**, so Textus AI can check a block before it writes one. It reads no files and draws everything on your device, on the desktop and on iOS.

## Changes

- **0.3.2** - Steep curves like tan(x) keep their shape and break at asymptotes; a function with nothing to draw says so; π and 2xsin(x) are read; Textus AI's check uses the fence's x range.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - a tool for Textus AI, `check_function_plot`
- **0.2.0** - curves and axes in the theme's colors, drawn again when the theme changes
- **0.1.3** - text in the theme's colors on Textus 1.3
- **0.1.2** - -x^2 reads as -(x^2), and a range that ends at 0 is kept
- **0.1.0-0.1.1** - first versions: functions of x drawn as a picture, height and range settings, pictures in exports

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `check_function_plot`: Checks the source of a ```function-plot block - functions of x, one per line, with + - * / ^, brackets, pi, e and the usual functions - before it goes into a document, without drawing it. Returns ok, or the problems to fix first. Pass the source without its fence, and the fence's words (xmin=0 xmax=100) as meta.
<!-- /ai-tools -->

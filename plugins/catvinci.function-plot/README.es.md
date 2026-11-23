# Gráfica de funciones

Dibuja gráficas de funciones de x, una por línea, como sin(x) o x^2 - 1.

## Dibujar una gráfica

- Escribe un bloque de código en `function-plot` con una función por línea. La gráfica se dibuja debajo, y el código vuelve a verse al hacer clic en el bloque.
- Una línea puede empezar con `y =`. `2x` y `3sin(x)` son multiplicaciones.
- Entiende + - * / ^, paréntesis, x, pi (π), e y sin, cos, tan, asin, acos, atan, sinh, cosh, tanh, exp, ln, log (base 10), sqrt, abs, floor y ceil.
- x va de -10 a 10. Escribe `xmin=-5 xmax=5` tras el lenguaje para cambiarlo; `ymin` e `ymax` fijan el rango de y, que si no se ajusta a las curvas.
- `height=400` tras el lenguaje fija la altura del dibujo.
- Si una línea no se puede leer, debajo del bloque se dice qué falla.
- Cada curva toma un color del tema, y la gráfica se vuelve a dibujar al cambiar de tema.
- Al exportar a HTML, PDF o Word, la gráfica va como imagen.

## Ejemplo

```function-plot xmin=-5 xmax=5
sin(x)
x^2 / 4 - 1
```

## Permisos

Solo pide **Herramientas para Textus AI**, para que Textus AI pueda revisar un bloque antes de escribirlo. No lee archivos y lo dibuja todo en tu equipo.

## Cambios

- **0.3.4** - Its page no longer says which devices it runs on: the store shows that.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Steep curves like tan(x) keep their shape and break at asymptotes; a function with nothing to draw says so; π and 2xsin(x) are read; Textus AI's check uses the fence's x range.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - a tool for Textus AI, `check_function_plot`
- **0.2.0** - curves and axes in the theme's colors, drawn again when the theme changes
- **0.1.3** - text in the theme's colors on Textus 1.3
- **0.1.2** - -x^2 reads as -(x^2), and a range that ends at 0 is kept
- **0.1.0-0.1.1** - first versions: functions of x drawn as a picture, height and range settings, pictures in exports

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `check_function_plot`: Revisa el código de un bloque ```function-plot - funciones de x, una por línea, con + - * / ^, paréntesis, pi, e y las funciones habituales - antes de que entre en un documento, sin dibujarlo. Devuelve ok, o los problemas que hay que corregir antes. Pasa el código sin su valla, y las palabras de la valla (xmin=0 xmax=100) como meta.
<!-- /ai-tools -->

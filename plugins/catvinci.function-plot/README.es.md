# Gráfica de funciones

Dibuja gráficas de funciones de x, una por línea, como sin(x) o x^2 - 1.

## Dibujar una gráfica

- Escribe un bloque de código en `function-plot` con una función por línea. La gráfica se dibuja debajo, y el código vuelve a verse al hacer clic en el bloque.
- Una línea puede empezar con `y =`. `2x` y `3sin(x)` son multiplicaciones.
- Entiende + - * / ^, paréntesis, x, pi, e y sin, cos, tan, asin, acos, atan, sinh, cosh, tanh, exp, ln, log (base 10), sqrt, abs, floor y ceil.
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

Solo pide **Herramientas para Textus AI**, para que Textus AI pueda revisar un bloque antes de escribirlo. No lee archivos y lo dibuja todo en tu equipo, en escritorio y en iOS.

## Cambios

- **0.3.1** - Su página dice ahora en una frase qué hace, qué puede hacer y qué cambió en cada versión.
- **0.3.0** - una herramienta para Textus AI, `check_function_plot`
- **0.2.0** - curvas y ejes con los colores del tema, que se redibujan al cambiar de tema
- **0.1.3** - el texto con los colores del tema en Textus 1.3
- **0.1.2** - -x^2 se lee como -(x^2), y un rango que termina en 0 se respeta
- **0.1.0-0.1.1** - primeras versiones: funciones de x dibujadas como imagen, altura y rango ajustables, imágenes al exportar

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `check_function_plot`: Revisa el código de un bloque ```function-plot - funciones de x, una por línea, con + - * / ^, paréntesis, pi, e y las funciones habituales - antes de que entre en un documento, sin dibujarlo. Devuelve ok, o los problemas que hay que corregir antes. Pasa el código sin su valla.
<!-- /ai-tools -->

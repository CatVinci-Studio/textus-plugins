# Partituras (ABC)

Dibuja partituras a partir de notación ABC escrita en un bloque de código.

Escribe un bloque de código con el lenguaje `abc`. La música aparece grabada justo debajo, y al hacer clic en el bloque vuelves a ver el código para editarlo.

- Los compases pasan a la línea siguiente para caber en la columna, así las notas se leen bien en un panel estrecho.
- Las notas usan el color de texto del tema y se dibujan de nuevo al cambiar entre claro y oscuro.
- Al exportar a HTML, PDF o Word, la música va como imagen.

Necesita Textus 1.3.2 o posterior. Pide un solo permiso, herramientas de Textus AI, para que Textus AI pueda revisar un bloque `abc` antes de escribirlo en un documento.

## Ejemplo

```abc
X:1
T:Scale
M:4/4
L:1/4
K:C
C D E F | G A B c |
```

## Cambios

- **0.3.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.3.4** - Its package lists the libraries it carries, with their licenses.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Bars wrap to the column instead of the whole score shrinking; clicking a note no longer turns it red; `check_abc` accepts full mode names, any note length, `+:` lines, `` ` `` and `$`; `height=` is gone.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - Textus AI can check an `abc` block before writing it (`check_abc`).
- **0.2.0** - The notes follow the theme's text color; needs Textus 1.3.2.
- **0.1.3** - Uses Textus's renamed document colors.
- **0.1.2** - Exported pictures keep the music's width and height.
- **0.1.0-0.1.1** - First versions: `abc` blocks drawn under their source, `height=`, pictures in exports; store page and icon.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `check_abc`: Revisa el código de un bloque ```abc - notación musical ABC: una cabecera de campos que termina en K:, y luego las notas - antes de que entre en un documento, sin dibujarlo. Devuelve ok, o los problemas que hay que corregir antes. Pasa el código sin su valla.
<!-- /ai-tools -->

# Partituras (ABC)

Dibuja partituras a partir de notación ABC escrita en un bloque de código.

Escribe un bloque de código con el lenguaje `abc`. La música aparece grabada justo debajo, y al hacer clic en el bloque vuelves a ver el código para editarlo.

- Los compases pasan a la línea siguiente para caber en la columna, así las notas se leen bien en un panel estrecho.
- Las notas usan el color de texto del tema y se dibujan de nuevo al cambiar entre claro y oscuro.
- Al exportar a HTML, PDF o Word, la música va como imagen.

Funciona en escritorio y en iPhone y necesita Textus 1.3.2 o posterior. Pide un solo permiso, herramientas de Textus AI, para que Textus AI pueda revisar un bloque `abc` antes de escribirlo en un documento.

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

- **0.3.2** - Los compases se reparten en líneas según la columna en vez de encoger toda la partitura; hacer clic en una nota ya no la pone roja; `check_abc` acepta nombres de modo completos, cualquier duración de nota, líneas `+:`, `` ` `` y `$`; se quita `height=`.
- **0.3.1** - Su página dice ahora en una frase qué hace, qué puede hacer y qué cambió en cada versión.
- **0.3.0** - Textus AI puede revisar un bloque `abc` antes de escribirlo (`check_abc`).
- **0.2.0** - Las notas siguen el color de texto del tema; necesita Textus 1.3.2.
- **0.1.3** - Usa los colores del documento con sus nuevos nombres en Textus.
- **0.1.2** - Las imágenes exportadas conservan el ancho y el alto de la música.
- **0.1.0-0.1.1** - Primeras versiones: bloques `abc` dibujados bajo su código, `height=`, imágenes al exportar; página en la tienda e icono.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `check_abc`: Revisa el código de un bloque ```abc - notación musical ABC: una cabecera de campos que termina en K:, y luego las notas - antes de que entre en un documento, sin dibujarlo. Devuelve ok, o los problemas que hay que corregir antes. Pasa el código sin su valla.
<!-- /ai-tools -->

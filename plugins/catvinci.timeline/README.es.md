# Cronología

Dibuja hechos como una cronología, uno por línea: cuándo | qué | más.

## Dibujar una cronología

- Escribe un bloque de código en `timeline` con un hecho por línea: cuándo pasó, qué pasó y una nota opcional, separados por `|`. La cronología se dibuja debajo, y el código vuelve a verse al hacer clic en el bloque.
- Los hechos se dibujan en el orden en que los escribes, a lo largo de una línea con un punto para cada uno. "Cuándo" puede ser cualquier texto: una fecha, un año, "Día 3".
- Las líneas vacías se saltan. Lo que va tras un tercer `|` no se muestra.
- `height=400` tras el lenguaje fija la altura del dibujo.
- Usa los colores del tema y se vuelve a dibujar al cambiar de tema.
- Al exportar a HTML, PDF o Word, la cronología va como imagen.

## Ejemplo

```timeline
2024-03 | Primer borrador | El esquema y dos capítulos
2024-09 | Revisión | Notas de tres lectores
2025-01 | Publicado
```

## Permisos

Solo pide **Herramientas para Textus AI**, para que Textus AI pueda revisar un bloque antes de escribirlo. No lee archivos y lo dibuja todo en tu equipo.

## Cambios

- **0.4.1** - Its page no longer says which devices it runs on: the store shows that.
- **0.4.0** - A database can be shown as a timeline: pick Timeline among its views, and its dated rows line up in order; a click opens a row. Needs Textus 1.4.6.
- **0.3.3** - A date no longer breaks in the middle ("2024-0" over "3"); a chart drawn while its block was folded fits once it opens.
- **0.3.2** - long notes and dates wrap to fit a narrow island, the timeline uses the document's font, and an empty block says what to write
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - a tool for Textus AI, `check_timeline`
- **0.2.0** - the theme's colors, drawn again when the theme changes
- **0.1.3** - text in the theme's colors on Textus 1.3
- **0.1.2** - keeps up with quick edits: an older drawing never replaces a newer one
- **0.1.0-0.1.1** - first versions: events drawn as a timeline, a height setting, pictures in exports

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `check_timeline`: Revisa el código de un bloque ```timeline - un suceso por línea, escrito cuándo | qué | más - antes de que entre en un documento, sin dibujarlo. Devuelve ok, o los problemas que hay que corregir antes. Pasa el código sin su valla.
<!-- /ai-tools -->

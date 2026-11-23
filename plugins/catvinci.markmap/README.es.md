# Mapa mental

Dibuja un esquema en Markdown, con títulos y listas, como mapa mental dentro de un bloque de código.

Escribe un bloque de código con el lenguaje `markmap` y pon dentro un esquema: los títulos (`#`, `##`) y los elementos de lista son las ramas del mapa. El mapa se dibuja debajo del bloque; haz clic en el bloque para ver y editar de nuevo su código.

- Arrastra el mapa para moverlo y acércalo o aléjalo con el zoom. Haz clic en el punto de una rama para plegarla o desplegarla.
- Escribe `height=400` después del lenguaje para fijar la altura del mapa en píxeles (360 por defecto).
- Las ramas toman los colores de tu tema, y el mapa se vuelve a dibujar al cambiar de tema.
- Al exportar a HTML, PDF o Word, el mapa va como imagen, aunque esté fuera de la vista.

El plugin usa [markmap](https://markmap.js.org). Pide un solo permiso, para dar a Textus AI la herramienta `check_markmap` que aparece abajo: revisa un bloque antes de que Textus AI lo escriba en un documento. Funciona en el escritorio y en iPhone y iPad.

## Ejemplo

```markmap
# Project
## Goals
- Ship 1.3
- Write the guide
## People
- Writers
- Reviewers
```

## Cambios

- **0.3.8** - The mind map fills its block: a small one grows (up to twice its size) to the block's width and the height you give it, and it follows the note's zoom instead of being cut off on the right. Its page no longer says which devices it runs on: the store shows that.
- **0.3.7** - Its package lists the libraries it carries, with their licenses.
- **0.3.6** - A mind map drawn before its note was laid out no longer shows an error.
- **0.3.5** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.4** - Editing a mind map for a long time no longer makes Textus use more and more memory.
- **0.3.3** - Scrolling over a mind map now scrolls the note; pinch or Ctrl-scroll to zoom. The map uses your theme's font and colors, in dark mode too, and opens fully fitted.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - A mind map scrolled out of sight exports as its picture instead of its source.
- **0.3.0** - Textus AI can check a `markmap` block before it writes one.
- **0.2.0** - Branch colors come from the theme's tones. Needs Textus 1.3.2.
- **0.1.3** - Uses the theme's document text color and footnote size under their Textus 1.3 names.
- **0.1.0-0.1.2** - First versions: `markmap` code blocks drawn in the document, `height=`, and exports as a picture in the export's colors.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `check_markmap`: Revisa el código de un bloque ```markmap - un esquema en Markdown cuyos encabezados y elementos de lista son las ramas del mapa mental - antes de que entre en un documento, sin dibujarlo. Devuelve ok, o los problemas que hay que corregir antes. Pasa el código sin su valla.
<!-- /ai-tools -->

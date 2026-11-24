# Marp

Presenta un documento como diapositivas, escrito al estilo de [Marp](https://marp.app).

## Crear diapositivas

- Cada `---` empieza una diapositiva nueva.
- **Complementos › Presentar como diapositivas** muestra la presentación en una pestaña junto al documento, siguiendo lo que escribes. ← → (o ↑ ↓, Re Pág y Av Pág) y Espacio pasan de una diapositiva a otra; **Pantalla completa** (o F) presenta. Mientras presentas, un toque o clic en el tercio izquierdo de la diapositiva vuelve atrás y en cualquier otro sitio avanza, igual que deslizar; toca la diapositiva o mueve el puntero para ver **Salir**, o pulsa Esc.
- Las directivas de Marp eligen el tema y el diseño, por ejemplo al principio:

```markdown
---
theme: gaia
paginate: true
---
```

- Las imágenes se ven en la presentación, también las `![[photo.png]]` de Obsidian; `![[photo.png|300]]` fija el ancho (`300x200` los dos tamaños).

## Guardar una presentación

**Complementos › Exportar diapositivas como HTML** (o **Guardar HTML** en la presentación) guarda `name.slides.html` junto al documento: un solo archivo que se presenta en cualquier navegador, con las mismas teclas. Las imágenes se enlazan desde la carpeta del documento, así que deja el archivo junto a ellas. Primero hay que guardar el documento.

Hecho con [Marp Core](https://github.com/marp-team/marp-core) (MIT), que trae sus temas (default, gaia, uncover), las fórmulas matemáticas y el resaltado de código, y hace que este plugin ocupe unos 4 MB.

## Permisos

- **Leer el documento**: para dibujar sus diapositivas mientras escribes.
- **Leer y escribir archivos**: para encontrar las imágenes que muestra y guardar la presentación HTML junto al documento.
- **Herramientas para Textus AI**: para que Textus AI pueda guardar la presentación por ti.

## Cambios

- **0.3.13** - The deck no longer stays blank when no document is in front - in Source Mode or Source and Preview, or presented from the plugin's page: it shows the document open in another tab, as last saved, or says to click one. Slides scale to their frame on a Mac, iPhone and iPad, in the tab and in a saved deck opened in Safari.
- **0.3.12** - Presenting on a phone or tablet: tap or swipe to move between slides, and Exit to stop - no keyboard needed. A click moves on in full screen too, as in a saved deck. In a narrow tab, Save HTML goes into the ⋯ menu instead of pushing Full Screen onto a second row. Its page is in every language Textus speaks.
- **0.3.11** - Its package lists the libraries it carries, with their licenses.
- **0.3.10** - Code kept for Textus versions it no longer runs on is gone. From Textus 1.4.4 the deck is also in File › Export, as Slides (HTML).
- **0.3.9** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.3.8** - Present as Slides draws the deck on a phone, where its tab comes to the front alone.
- **0.3.7** - Formulas use KaTeX's own fonts from Textus 1.4.2 on, in the tab and in a saved HTML file; earlier versions keep the system's fonts.
- **0.3.6** - A deck needs nothing from the web: emoji show as text instead of pictures from a CDN, formulas use the system's fonts, and the Gaia theme no longer loads a web font, in the tab and in a saved HTML file.
- **0.3.5** - Writing a deck with many pictures is lighter: the slides are made again only when the text changed, and pictures it no longer shows are let go.
- **0.3.4** - Full Screen works in the tab (presenting in place where the window can't go full screen); the deck renders only while its tab is open; shortcuts leave Cmd/Ctrl/Alt keys alone.
- **0.3.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - pictures in the deck, including Obsidian's `![[picture]]` embeds with a width
- **0.3.0** - a tool for Textus AI, `export_slides`
- **0.2.0** - named Marp in every language; Textus's own buttons and colors; labels follow the interface language
- **0.1.0-0.1.1** - first versions: a live deck beside the document, full screen, and a self-presenting HTML file

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `export_slides`: Guarda el documento al frente como una presentación de Marp - una diapositiva por cada línea --- - en un archivo HTML a su lado (name.slides.html) que se presenta en cualquier navegador. Devuelve su ruta y cuántas diapositivas tiene.
<!-- /ai-tools -->

# Numeración de títulos

Muestra números delante de tus títulos mientras escribes (1, 1.1, 1.2) sin cambiar el texto.

- Cada título muestra su número delante mientras escribes: 1, 1.1, 1.2, 2… Los números solo se dibujan; el texto del documento queda igual.
- La numeración empieza en el nivel de título más alto del documento, o en el siguiente cuando ese nivel solo tiene el título principal.
- Un documento que ya numera sus títulos a mano no recibe números extra. Es así cuando la mayoría de los títulos de primer nivel empiezan con un número como `1.`, `1.2`, `一、`, `第一章` o `(一)`.
- Obsidian: `number headings: off` en las propiedades del documento (el ajuste que usa el plugin Number Headings de Obsidian) quita los números en ese documento.
- **Números en las exportaciones** (**Ajustes › Extensiones › Complementos › Numeración de títulos**, activado por defecto): las exportaciones a HTML y PDF muestran los mismos números.

El plugin lee los títulos del documento abierto (permiso para leer el editor) y da a Textus AI la herramienta `number_headings` de abajo (permiso de herramientas de IA). La herramienta devuelve el texto con los números escritos o quitados; no cambia ningún archivo.

## Cambios

- **0.2.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.2.4** - With two documents open side by side, both show their heading numbers, not only the one you are typing in.
- **0.2.3** - Front matter and code blocks no longer get numbers by mistake, and exports number only top-level headings, like the editor.
- **0.2.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.1** - No numbers on a document numbered by hand, or one whose front matter says `number headings: off`.
- **0.2.0** - Textus AI can write heading numbers into Markdown, or take them out.
- **0.1.3** - Says where it runs: the desktop, iPhone and iPad.
- **0.1.2** - Numbering starts at the document's own top heading level instead of a setting.
- **0.1.0-0.1.1** - First versions: numbers before headings while writing, and in HTML and PDF exports.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `number_headings`: Escribe números en los encabezados de un Markdown - 1, 1.1, 1.2 -, contados como los muestra el editor (un título único no se numera), y sustituye los que ya hubiera; con remove, los quita. Devuelve el texto; no escribe nada.
<!-- /ai-tools -->

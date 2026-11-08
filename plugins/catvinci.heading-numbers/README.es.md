# Numeración de títulos

Muestra números delante de tus títulos mientras escribes (1, 1.1, 1.2) sin cambiar el texto.

- Cada título muestra su número delante mientras escribes: 1, 1.1, 1.2, 2… Los números solo se dibujan; el texto del documento queda igual.
- La numeración empieza en el nivel de título más alto del documento, o en el siguiente cuando ese nivel solo tiene el título principal.
- Un documento que ya numera sus títulos a mano no recibe números extra. Es así cuando la mayoría de los títulos de primer nivel empiezan con un número como `1.`, `1.2`, `一、`, `第一章` o `(一)`.
- Obsidian: `number headings: off` en las propiedades del documento (el ajuste que usa el plugin Number Headings de Obsidian) quita los números en ese documento.
- **Números en las exportaciones** (**Ajustes › Extensiones › Complementos › Numeración de títulos**, activado por defecto): las exportaciones a HTML y PDF muestran los mismos números.

El plugin lee los títulos del documento abierto (permiso para leer el editor) y da a Textus AI la herramienta `number_headings` de abajo (permiso de herramientas de IA). La herramienta devuelve el texto con los números escritos o quitados; no cambia ningún archivo. Funciona en el escritorio y en iPhone y iPad.

## Cambios

- **0.2.1** - Sin números en un documento numerado a mano ni en uno cuyas propiedades dicen `number headings: off`.
- **0.2.0** - Textus AI puede escribir números en los títulos de un Markdown, o quitarlos.
- **0.1.3** - Indica dónde funciona: escritorio, iPhone y iPad.
- **0.1.2** - La numeración empieza en el nivel de título más alto del propio documento en lugar de un ajuste.
- **0.1.0-0.1.1** - Primeras versiones: números delante de los títulos al escribir y en las exportaciones a HTML y PDF.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `number_headings`: Escribe números en los encabezados de un Markdown - 1, 1.1, 1.2 -, contados como los muestra el editor (un título único no se numera), y sustituye los que ya hubiera; con remove, los quita. Devuelve el texto; no escribe nada.
<!-- /ai-tools -->

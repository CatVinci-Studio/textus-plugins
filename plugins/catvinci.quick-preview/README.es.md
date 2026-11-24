# Vista rápida

Lee adónde lleva un enlace sin abrirlo: deja el puntero sobre un enlace a otro documento y una tarjeta muestra su texto.

- Deja el puntero sobre un enlace a otro documento, un enlace Markdown o un [[enlace wiki]].
- Una tarjeta a su lado muestra el comienzo del documento, sin sus propiedades. Para un enlace a un título (`#Título`) muestra esa sección, y para un enlace a un bloque (`#^id`), ese bloque.
- La tarjeta muestra hasta unos 1.500 caracteres, cortados al final de un párrafo. **Abrir** va al documento; **Fijar** mantiene la tarjeta abierta mientras escribes.
- Solo se previsualizan documentos de la carpeta abierta.

El plugin pide leer el editor (para saber qué enlace señalas) y leer archivos (para mostrar el documento enlazado). Nunca cambia un archivo. En una tableta funciona con un ratón o un trackpad conectado.

## Cambios

- **0.2.4** - Its page says that on a tablet it needs a mouse or trackpad, instead of which devices it runs on.
- **0.2.3** - The store description now opens with what the plugin does.
- **0.2.2** - A link to a nested heading (`[[Note#A#B]]`) shows that heading's section, as a click opens it. Needs Textus 1.4.0.
- **0.2.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.0** - A link to a block (`#^id`) shows that block. Needs Textus 1.3.9.
- **0.1.3** - Says where it runs: the desktop, iPhone and iPad.
- **0.1.2** - The card's length is fixed instead of a setting.
- **0.1.0-0.1.1** - First versions: a card for links to documents, with the document's opening or the section the link names, and Open and Pin.

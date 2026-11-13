# Vista rápida

Lee adónde lleva un enlace sin abrirlo: deja el puntero sobre un enlace a otro documento y una tarjeta muestra su texto.

- Deja el puntero sobre un enlace a otro documento, un enlace Markdown o un [[enlace wiki]].
- Una tarjeta a su lado muestra el comienzo del documento, sin sus propiedades. Para un enlace a un título (`#Título`) muestra esa sección, y para un enlace a un bloque (`#^id`), ese bloque.
- La tarjeta muestra hasta unos 1.500 caracteres, cortados al final de un párrafo. **Abrir** va al documento; **Fijar** mantiene la tarjeta abierta mientras escribes.
- Solo se previsualizan documentos de la carpeta abierta.

El plugin pide leer el editor (para saber qué enlace señalas) y leer archivos (para mostrar el documento enlazado). Nunca cambia un archivo. Funciona en el escritorio y en iPhone y iPad.

## Cambios

- **0.2.3** - La descripción de la tienda empieza ahora por lo que hace el plugin.
- **0.2.2** - Un enlace a un encabezado anidado (`[[Nota#A#B]]`) muestra la sección de ese encabezado, la misma que abre un clic. Necesita Textus 1.4.0.
- **0.2.1** - Su página dice ahora en una frase qué hace, qué puede hacer y qué cambió en cada versión.
- **0.2.0** - Un enlace a un bloque (`#^id`) muestra ese bloque. Requiere Textus 1.3.9.
- **0.1.3** - Indica dónde funciona: escritorio, iPhone y iPad.
- **0.1.2** - La longitud de la tarjeta es fija en lugar de un ajuste.
- **0.1.0-0.1.1** - Primeras versiones: una tarjeta para enlaces a documentos, con el comienzo del documento o la sección que nombra el enlace, y Abrir y Fijar.

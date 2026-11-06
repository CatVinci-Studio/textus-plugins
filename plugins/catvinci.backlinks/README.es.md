# Enlaces bidireccionales

> Los enlaces como `[[Nota]]` vienen con Textus: puedes escribirlos y seguirlos sin ningún plugin. Este plugin te ayuda a escribirlos, muestra en su sitio lo que enlazan y lista quién enlaza el documento abierto.

## Enlazar mientras escribes

- Escribe `[[` y elige una nota en el panel que se abre: por su nombre, su primer encabezado o un `aliases` de su front matter. Un alias se escribe `[[Nota|alias]]`.
- Tras `#`, los encabezados de la nota: `[[Nota#Encabezado]]`. `[[#` lista los del propio documento.
- Tras `#^`, sus bloques: párrafos, elementos de lista, tablas, citas. Si eliges uno sin id, se le añade uno al final en esa nota (`^1a2b3c`), como lo escribe Obsidian.
- Selecciona unas palabras y escribe `[[` para convertirlas en enlace.
- Los enlaces se escriben como los escribe la carpeta: en una bóveda de Obsidian, con su formato de enlace.

## Incrustaciones

- `![[Nota]]` muestra la nota en su sitio, `![[Nota#Encabezado]]` esa sección y `![[Nota#^id]]` ese bloque: de solo lectura y al día cuando la nota cambia.
- Pon el cursor en la línea para editar el enlace.

## Enlaces entrantes en la barra lateral

Qué enlaza al documento abierto y a dónde enlaza él, en la pestaña **Enlaces bidireccionales** de la barra lateral.

- **Menciones enlazadas**: las líneas de otras notas que enlazan aquí, con [[enlaces wiki]] o enlaces a este archivo. Haz clic en una para ir allí.
- **Menciones sin enlace**: líneas que nombran esta nota – por su nombre de archivo, su primer encabezado o los `aliases` de su front matter – sin enlace. Haz clic derecho y elige **Enlazar** para convertirla en un [[enlace]].
- **Enlaces salientes**: las notas a las que enlaza esta, incluidas las que aún no existen.
- El campo de arriba filtra la lista.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `list_backlinks`: Para un documento - el que está al frente si no se da ruta - enumera las notas que enlazan a él (ruta, línea y texto de la línea), las líneas que lo nombran sin enlace y las notas a las que enlaza.
<!-- /ai-tools -->

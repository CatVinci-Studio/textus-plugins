# Enlaces bidireccionales

Enlaza notas, encabezados y bloques al escribir `[[`, incrústalos con `![[` y mira en la barra lateral qué enlaza al documento abierto.

Los enlaces como `[[Nota]]` vienen con Textus: puedes escribirlos y seguirlos sin ningún plugin. Este plugin te ayuda a escribirlos, muestra en su sitio lo que enlazan y reúne los enlaces alrededor del documento que estás leyendo. Funciona en escritorio y en iOS.

## Enlazar mientras escribes

- Escribe `[[` y elige una nota en el panel que se abre: por su nombre de archivo, su primer encabezado o una entrada `aliases` de su front matter. Un alias se escribe `[[Nota|alias]]`.
- Después de `#`, los encabezados de la nota: `[[Nota#Encabezado]]`. `[[#` muestra los del propio documento.
- Después de `#^`, sus bloques: párrafos, elementos de lista, tablas, citas. Un bloque sin id recibe uno al final en esa nota (`^1a2b3c`), como lo escribe Obsidian.
- Selecciona unas palabras y escribe `[[` para convertirlas en enlace.
- Los enlaces se escriben como los escribe la carpeta: lo que eligió, o el formato de enlaces de una bóveda de Obsidian; si no, como ya enlaza la nota; si no, un enlace estándar, `[Nov 8](Week45/Nov%208.md)`, que se abre en cualquier app. Un [[enlace]] que necesita una ruta muestra el nombre de la nota.

## Incrustaciones

- `![[Nota]]` muestra la nota en su sitio, `![[Nota#Encabezado]]` esa sección y `![[Nota#^id]]` ese bloque. Son de solo lectura y se actualizan cuando cambia la nota.
- Pon el cursor en la línea para editar el enlace.

## Enlaces en la barra lateral

La pestaña **Enlaces bidireccionales** de la barra lateral muestra qué enlaza al documento abierto y a dónde enlaza él.

- **Menciones enlazadas**: las líneas de otras notas que enlazan aquí, con [[enlaces wiki]] o enlaces a este archivo. Haz clic en una para ir allí.
- **Menciones sin enlace**: líneas que nombran esta nota (por su nombre de archivo, su primer encabezado o `aliases`) sin enlazarla. Haz clic derecho y elige **Enlazar** para convertirla en enlace. Si la línea usa un alias, el alias queda como texto del enlace.
- **Enlaces salientes**: las notas a las que enlaza esta, incluidas las que aún no existen.
- El campo de arriba filtra la lista.

## Enlaces estándar o [[enlaces wiki]]

- **Complementos › Enlaces nuevos: estándar o [[wiki]]…** elige cómo se escriben los enlaces nuevos en la carpeta abierta. La elección se guarda en el `.textus/settings.json` de la carpeta, y Textus y los demás complementos la siguen.
- **Complementos › Convertir enlaces a estándar…** y **Convertir enlaces a [[enlaces wiki]]…** reescriben los enlaces del documento al frente o de todas las notas de la carpeta. Primero dicen cuántos cambiarán; cada uno sigue yendo al mismo sitio. El código, el front matter y un enlace cuya nota no se encuentra quedan como están; las imágenes y otros archivos siguen como enlaces estándar.

## Permisos

- **Leer y editar el documento**: para completar enlaces al escribir y convertir una selección en enlace.
- **Leer y escribir archivos de la carpeta abierta**: para encontrar enlaces y menciones, enlazar una mención sin enlace y dar a un bloque su `^id`.
- **Herramientas para Textus AI**: para que Textus AI pueda listar los enlaces de un documento.

## Cambios

- **0.4.2** - Textos de ayuda y de estado vacío más breves. Su panel lateral y su página siguen el diseño de Textus 1.3.13.
- **0.4.1** - En una nota sin enlaces todavía, [[ escribe un enlace estándar: el [[ que se escribía se tomaba por un enlace wiki que la nota ya tenía.
- **0.4.0** - Enlaces nuevos: estándar o [[wiki]]… elige cómo escribe la carpeta los enlaces nuevos, y Convertir enlaces pasa los de una nota o de toda la carpeta de una forma a la otra; [[ escribe como la carpeta, un enlace estándar si nada dice otra cosa.
- **0.3.1** - Su página dice ahora en una frase qué hace, qué puede hacer y qué cambió en cada versión.
- **0.3.0** - completado de notas, encabezados y bloques con `[[`; incrustaciones con `![[`; el nombre pasa de Enlaces entrantes a Enlaces bidireccionales
- **0.2.1** - la descripción dice "enlaces bidireccionales", para que la búsqueda de la tienda lo encuentre
- **0.2.0** - una herramienta para Textus AI, `list_backlinks`
- **0.1.0-0.1.1** - primeras versiones: menciones enlazadas y sin enlace con **Enlazar**, enlaces salientes y un filtro; se sugiere para documentos con enlaces wiki

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `list_backlinks`: Para un documento - el que está al frente si no se da ruta - enumera las notas que enlazan a él (ruta, línea y texto de la línea), las líneas que lo nombran sin enlace y las notas a las que enlaza.
<!-- /ai-tools -->

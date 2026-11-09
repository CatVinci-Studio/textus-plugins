# Zotero

Cita desde tu biblioteca de Zotero mientras escribes.

## Antes de empezar

Zotero 7 o posterior (también Zotero 10) debe estar abierto en el mismo equipo, con **Ajustes › Avanzado › Permitir que otras aplicaciones de este equipo se comuniquen con Zotero** activado. El plugin solo habla con el Zotero de tu equipo; nada sale de él. Funciona en escritorio.

## Citar

- Pulsa **Ctrl+Alt+R** (**⌘⌥R** en Mac), elige **Insertar una cita de Zotero…** en el menú contextual o **Plugins › Insertar una cita de Zotero…**. Primero aparecen las obras que citaste hace poco y después una búsqueda en tu biblioteca.
- Si hay palabras seleccionadas, se buscan esas palabras.
- Elige un elemento y la cita entra donde está el cursor.
- Deja el puntero sobre una cita, o sobre un enlace a un elemento de Zotero, para ver sus autores, el año, dónde se publicó y el comienzo del resumen.
- **Plugins › Insertar lista de referencias** añade al final una sección **Referencias** con todas las obras que cita el documento, ordenadas por primer autor y año. Si lo repites, la lista se sustituye, no se añade dos veces.

## Cómo se escribe una cita

Elígelo en los ajustes del plugin, en **Una cita se escribe como**:

- **Una clave de Pandoc: [@key]** (la opción por defecto). Se convierten en referencias con formato al exportar con Pandoc si eliges una bibliografía (.bib) en **Ajustes › Editor y aspecto › Exportar**.
- **Autor y año: (Autor, 2024)**.
- **Un enlace a nota de Obsidian: [[@key]]**, que enlaza la nota de lectura del elemento. Si la nota aún no existe, el plugin ofrece crearla.
- **Un enlace que abre Zotero**.

La clave de cita sale del campo Citation Key del elemento (o de una línea `Citation Key:` en Extra, como la escribe Better BibTeX).

## Notas de lectura

- **Plugins › Nueva nota de lectura desde Zotero…** crea `@citekey.md` (o la abre si ya existe) con el título, los autores, el año, el resumen, el DOI o la URL del elemento, y sus resaltados y notas de Zotero.
- Las notas van a **References** dentro de la carpeta abierta; cámbialo en **Carpeta de notas de lectura**.
- **Plantilla de nota de lectura** puede apuntar a un archivo Markdown de la carpeta, como `Templates/Literature.md`, con `{{title}}`, `{{authors}}`, `{{year}}`, `{{abstract}}`, `{{citekey}}`, `{{DOI}}`, `{{URL}}`, `{{highlights}}`, `{{notes}}` y `{{date:YYYY-MM-DD}}`. Si se deja vacía, se crea una nota sencilla con front matter.
- En una bóveda de Obsidian se siguen la carpeta y la plantilla de los plugins Zotero Integration o Citations. Una plantilla escrita para otro lenguaje de plantillas se sustituye por la nota sencilla.

## Permisos

- **Red, solo localhost:23119**: para hablar con la API local de Zotero en este equipo.
- **Leer y editar el documento**: para insertar citas y la lista de referencias, y buscar las palabras seleccionadas.
- **Leer y escribir archivos de la carpeta abierta**: para leer plantillas y los ajustes de Zotero de una bóveda, y crear notas de lectura.
- **Herramientas para Textus AI**: para que Textus AI pueda buscar en tu biblioteca.

## Cambios

- **0.4.1** - Su código se divide en archivos más pequeños según lo que hace cada parte; nada cambia al usarlo.
- **0.4.0** - las plantillas de notas de lectura las rellena el motor de plantillas de Textus; requiere Textus 1.3.10
- **0.3.0** - notas de lectura desde Zotero, con plantilla y los ajustes de una bóveda de Obsidian; citas como `[[@citekey]]`
- **0.2.1** - el atajo pasa de Ctrl+Alt+C a Ctrl+Alt+R
- **0.2.0** - una herramienta para Textus AI, `search_library`
- **0.1.3** - solo para escritorio
- **0.1.2** - funciona con la API local de Zotero 10; la lista de referencias se sustituye al rehacerla y el código ya no se lee como citas
- **0.1.0-0.1.1** - primeras versiones: citar con las obras recientes primero, fichas al pasar sobre una cita, la lista de referencias y cuatro formas de citar

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `search_library`: Busca en la biblioteca de Zotero del usuario en este ordenador (Zotero 7 o posterior debe estar abierto): la clave, el título, los autores, el año, el tipo, dónde se publicó y la clave de cita de cada elemento, y la cita para insertar en el estilo elegido. Falla indicando qué hacer si no se puede llegar a Zotero.
<!-- /ai-tools -->

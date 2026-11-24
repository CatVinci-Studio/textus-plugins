# Wiki

Páginas dentro de páginas y bases de datos de tus notas como tablas, tableros, calendarios, galerías y listas, todo en archivos Markdown normales.

Las bases de datos se escriben en el **formato Bases de Obsidian** (bloques ` ```base ` y archivos `.base`), así que Obsidian abre las mismas bases de datos.

## Páginas

- **Una página con subpáginas es una carpeta**: `Plans/Plans.md` es la página, y sus subpáginas están a su lado en `Plans/`, igual que las notas de carpeta de Obsidian. Escribe `/` y elige **Nueva subpágina…**, o usa **Complementos › Nueva subpágina…**. La primera subpágina mueve `Plans.md` a su carpeta por ti, y los enlaces a ella la siguen.
- **La pestaña Páginas** de la barra lateral muestra la carpeta como un árbol de páginas. Haz clic derecho en una página para crear una subpágina, renombrarla, darle un icono o moverla a la papelera (con las páginas que contiene, tras preguntar). Arrastra una página sobre otra para convertirla en subpágina de esa. Los enlaces siguen cada movimiento.
- **Iconos de página**: **Poner icono de página…** (en el menú Complementos, o con clic derecho en un documento de la pestaña Archivos) elige un emoji, que se guarda como `icon` en el front matter de la página.
- **¿Páginas o Archivos?** La pestaña Páginas muestra las páginas y lo que tienen debajo, como Notion; la pestaña Archivos muestra cada archivo y carpeta tal como están en el disco. Usa la que quieras: son los mismos archivos.
- **Dónde estás**: en una subpágina, la barra de estado muestra las páginas que tiene por encima: `Life › 2026 Calendar › Week 1`.
- **Renombrar la carpeta de una página** en la pestaña Archivos renombra también su página, así que sigue siendo una página con subpáginas.
- **Formato antiguo**: `Plans.md` con sus subpáginas en una carpeta `Plans/` a su lado se lee igual. **Complementos › Organizar páginas en carpetas…** mueve de una vez cada página así a su carpeta, tras mostrar la lista.

## Bases de datos

Una base de datos es un bloque `base` en una página, o un archivo `.base` abierto en una pestaña. Sus filtros eligen las notas: cada nota es una fila, y las propiedades de su front matter son las columnas. Escribe `/` y elige **Nueva base de datos…** (o **Complementos › Nueva base de datos…**): crea una carpeta para la base de datos con una página que contiene el bloque.

````markdown
```base
filters:
  and:
    - file.inFolder(this.file.folder)
    - file.path != this.file.path
views:
  - type: kanban
    name: Board
    groupBy:
      property: status
    groupOrder: [To read, Reading, Read]
  - type: table
    name: Table
    limit: 25
```
````

- **Las vistas** son pestañas en la parte de arriba del bloque: Tabla, Tablero, Calendario, Galería (las `cards` de Bases) y Lista. Haz clic derecho en una vista para ver su menú: su diseño, renombrar, eliminar. **+** añade una vista. Calendario es propia de Textus; Obsidian la muestra como una vista que no conoce.
- **Cada fila es una nota.** Haz clic en una celda para cambiarla; la propiedad se escribe en el front matter de esa nota. **Nueva** crea una nota en la carpeta de la base de datos. Una fila se abre en una pestaña, como un archivo.
- **Columnas**: haz clic en la cabecera de una columna para ordenar por ella, filtrarla, cambiar su tipo, renombrarla, ocultarla o eliminar la propiedad de todas las filas; **+** añade una propiedad. Arrastra una cabecera para mover la columna, y arrastra su borde derecho para fijar su ancho (doble clic en el borde para volver al ancho inicial). Una columna conserva su ancho sea cual sea el ancho de la base de datos. El orden y los anchos se guardan en la base de datos, los anchos como el `columnSize` de Obsidian.
- **Tablero**: arrastra una tarjeta a otra lista para cambiar su valor. Arrastra una lista por su cabecera para poner las listas en el orden que quieras (`groupOrder`).
- **Calendario**: las filas se colocan según una propiedad de fecha; haz clic en un día para crear una fila con esa fecha.
- **Filtrar**, **Ordenar** y los menús de columna se guardan en la vista como los escribe Bases: `status == "Read"`, `tags.contains("ml")`, `due.isEmpty()`. Los filtros que Textus aún no sabe leer se dejan como están, y se indica bajo la barra.
- **Tamaño en un documento**: una base de datos es tan ancha como el texto (o como el panel, con **Vista ancha**) y se desplaza de lado cuando sus columnas son más anchas; es tan alta como sus filas hasta el límite de Textus para un bloque (el 70 % de la ventana, 1200 px como mucho), y luego se desplaza por dentro. Entonces una tabla o una lista termina entre dos filas, nunca a mitad de una; las demás vistas difuminan el pie mientras haya más debajo.
- **Las bases de datos largas** muestran sus primeras 25 filas (o el `limit` de la vista); al desplazarte hacia abajo se carga el resto, con la cabecera de la tabla siempre a la vista. La flecha a la izquierda de un bloque, al pasar el puntero, lo pliega en una línea; el plegado y la vista en la que lo dejas se guardan solo en este dispositivo.
- **Las fórmulas** (`formulas:` en la base de datos) se calculan para cada fila y pueden ser columnas, filtros y criterios de orden: `(price / pages).toFixed(2)`. Los resúmenes aún no se dibujan.
- **Los tipos de propiedad** son los de Obsidian, de `.obsidian/types.json`, cuando la carpeta es una bóveda.
- **En una nota incrustada** (`![[page]]`) una base de datos ocupa una línea; haz clic en ella para dibujarla.
- **Desde Dataview**: pon el cursor en un bloque ` ```dataview ` y ejecuta **Complementos › Convertir consulta de Dataview en base**. `TABLE` y `LIST` con `FROM`, `WHERE`, `SORT` y `LIMIT` se convierten en la misma base de datos en el lugar del bloque; `TASK`, `GROUP BY`, `FLATTEN` y `dataviewjs` se rechazan con el motivo, y no cambia nada.

Las exportaciones de Notion entran con el plugin **Importar de Notion**, que escribe páginas y bases de datos que este plugin muestra.

## Permisos

- **Leer y escribir archivos de la carpeta abierta**: para leer las notas y sus propiedades, crear páginas y bases de datos, escribir en el front matter lo que editas en las celdas, y mover o renombrar páginas con sus enlaces.
- **Leer y editar el documento**: para insertar una base de datos o una subpágina nueva y su enlace, y para convertir un bloque de Dataview en base de datos.
- **Herramientas para Textus AI**: para que Textus AI pueda crear bases de datos y páginas, leer filas y añadirlas.

## Cambios

- **0.8.3** - The bar stays on one line when there is room: in a zoomed block on a Mac it folded the view tabs into one button and put the sorts on a line of their own, and measured itself many times on every click. A table or list taller than Textus lets a block be ends between two rows instead of through one; other views fade at the foot while more is below. A column keeps its width however wide the block is, instead of stretching to fill it. By touch, a board card or lane lifts after a short hold, so a swipe scrolls instead of dragging. Its page is in every language Textus speaks. Its tools for Textus AI are described in every language, and in Chinese a database is 数据库 while 知识库 is the plugin's name.
- **0.8.2** - The `file.folder`, `file.path` and `file.mtime` columns show each page's folder, path and when it was last changed (they were empty).
- **0.8.1** - Rows and cards make way at the pace of the rest of Textus.
- **0.8.0** - Other plugins can add views beside the table, board, calendar, gallery and list - the Timeline plugin's timeline, for one - in the view menus. Needs Textus 1.4.6 for those.
- **0.7.16** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller. A board's lists move as Textus's own tabs do, and a column's width can also be set with the arrow keys.
- **0.7.15** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.7.14** - A column's grip is placed by Textus's shared rule, the same one as the document's tables. The calendar view and cell editing use Textus's shared page tools. Needs Textus 1.4.3.
- **0.7.13** - A column is pulled by the same grip as the document's tables, and lifts and slides the same way. Needs Textus 1.4.3.
- **0.7.12** - A view tab whose name would be cut short ("Calenda") makes the bar give way a step instead. Menu words match the app's table menu (Title Case; German, Spanish and Portuguese row words).
- **0.7.11** - A filter's verb (is, is not, is empty) is picked from Textus's own menu instead of the system's dropdown, and its option boxes are Textus's own checkboxes.
- **0.7.10** - Renaming a row in a table renames it as the Pages tree does: a page with sub-pages keeps them and stays in its database, and only the page's own title heading changes. An open `.base` file shows changes saved in Textus or written by a plugin, and never writes an older copy over a newer file: a change made meanwhile is refused with a note to make it again. Renaming a property to a name some notes already have asks first and keeps their value.
- **0.7.9** - Tables are denser: every column has one width (the title's wider) and the table scrolls sideways when they don't fit, each row is one line with longer values cut short and shown whole on hover, and rows sit closer. Tags and links no longer run over the next column. A base on screen draws again only when its rows change, not at every save in the folder. A base's bar no longer jumps back and forth between one line and two.
- **0.7.8** - Setting a column's type (number, date, checkbox, list) works again in every folder: the type is kept in the base, and Obsidian's own types are still read. A base in a document draws at the interface's text size, so a wider column shows more of it rather than larger text; Cut, Copy and Paste in a cell's right-click menu work with Textus 1.4.1.
- **0.7.7** - Every button and menu now shows its words in your language, including Japanese, Korean, German, Spanish, French, Portuguese and Russian; a board lane's tooltip no longer shows a raw name. A table now fits its page and wraps long names before it scrolls sideways; a page's icon shows in place of the file icon in the Pages tree. Needs Textus 1.4.0.
- **0.7.6** - In a narrow block the bar keeps to one line: the count goes first, then New's word, then the view tabs fold into a menu; sorts and filters ride in the bar while there's room. A filter on a select, tags or a checkbox is ticked in a list, as in Notion, with Clear selection. A dragged view tab stays where it's let go, and a view wider than the block fades at its edges. With Textus 1.3.13 the block can be shown wide, across the pane, and drawn smaller, from its right-click menu. Shorter help and empty-state text.
- **0.7.5** - A long title or text wraps within a column of a set width instead of stretching the table; a row's right-click menu is laid out as a Markdown table's (insert a row below or a column to the right, then Row and Column); the date month opens and sits under its field in every window, zoomed too; a new row is drafted in the table's own cells; a field's right-click menu is Textus's own; a view's tab can be dragged on a Mac too; needs Textus 1.3.12. Its name is Notion's word for a wiki in each language (Wiki in English); a database is a base, as Obsidian calls it (New Base…).
- **0.7.4** - a table's head stays in view while its rows scroll; more rows load as you scroll down, no Show more; a view's menu is on right-click only; columns start at widths in proportion to the block; the view you leave a block in is kept on this device, not in the note; a block folds with Textus's own caret on its left, no fold arrow of its own; a column is dragged by its head as the sidebar's tabs are, the others sliding aside; a rating column shows the same way all down; a filter added twice is kept once, and one that contradicts another (status is Done, then status is Doing) takes its place; its board, fields and stars are Textus's own controls; a row's right-click menu opens it or moves it to the Trash; view tabs are dragged into a new order; a date is typed or picked from a small month under its field; a new sub-page's link in a page just moved into its folder points from where the page is now; needs Textus 1.3.12
- **0.7.3** - Shares Two-way Links' fix for working out how a note links.
- **0.7.2** - a dragged column stays under the pointer in a zoomed document, and dragging selects no text; a date is edited as it is shown, 2026-11-08, not in the system's order; new pages and databases are linked with standard links, [Week 1](Week%201.md), unless the folder or the page already uses [[wiki links]]
- **0.7.1** - new databases and sub-pages are linked the way the folder writes links; needs Textus 1.3.10
- **0.7.0** - drag column heads to reorder and their edges to resize (`columnSize`); a view's menu on right-click; rows open in a tab; option colors from their words; **Convert Dataview query to base**
- **0.6.0** - databases are Obsidian bases (` ```base ` blocks and `.base` files) with views, filters, sorts, `groupOrder`, `limit`, formulas, folding and **Show more**; the Pages tab can rename, delete to the Trash and drag; page folders follow renames
- **0.5.0** - renamed Workspace: Pages and Notion Import merged in; a page with sub-pages becomes a folder, and **Organize Pages into Folders…** moves older pages
- **0.4.3** - card tags and long values wrap on boards and galleries
- **0.4.1-0.4.2** - Notion dates and relations read better; then the Notion import moves to the Notion Import plugin
- **0.4.0** - tools for Textus AI to read a database's rows and add rows
- **0.3.0** - Textus's own menus for properties, filters and options, and no frame around the block
- **0.2.0** - Notion-style filters and sorts, select options, property types, and columns and pages made in the table
- **0.1.0-0.1.1** - first versions: a folder's documents as a table, board, calendar or gallery, edited in place; a Notion CSV import; a tool for Textus AI to make a database

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `create_database`: Crea una base de datos en el formato Bases de Obsidian: una carpeta de notas cuyo front matter guarda las propiedades de cada una, y dentro una página con un bloque ```base que las muestra como tabla, tablero, calendario, galería o lista. Devuelve un enlace a esa página para ponerlo donde quiera el usuario.
- `query_rows`: Lee las filas de una base de datos - las notas que elige su base, por defecto las de su carpeta -, cada una con su nombre, ruta y propiedades, filtradas y ordenadas.
- `add_row`: Añade una fila a una base de datos: un documento en su carpeta, con el nombre de la fila y sus propiedades en el front matter. Todo bloque que muestre esa carpeta la muestra. Solo para la carpeta de una base de datos (create_database, query_rows); una tarea simple es add_task.
- `create_page`: Crea una página: un documento con ese título en la raíz de la carpeta abierta, o una subpágina en la carpeta junto a su página madre, con icono si se da. Devuelve su ruta y el [[enlace]] para poner en la página madre.
<!-- /ai-tools -->

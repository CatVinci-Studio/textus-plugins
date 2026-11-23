# Vista de grafo

Dibuja tus notas y los enlaces entre ellas como un grafo, de toda la carpeta o alrededor del documento abierto.

- **Ctrl+Alt+G** (**⌘⌥G** en un Mac), o **Plugins › Abrir la vista de grafo**, muestra toda la carpeta en una pestaña. **Ajustar** lo encuadra todo.
- La pestaña **Grafo** de la barra lateral muestra las notas alrededor del documento abierto. El botón de arriba del panel Grafo de la barra lateral abre toda la carpeta.
- Cuentan los [[enlaces wiki]] y los enlaces a otros documentos; dos notas que se enlazan entre sí comparten una línea. Un [[enlace]] a una nota aún no escrita aparece como una nota propia.
- Haz clic en una nota para abrirla. Arrastra una nota para colocarla, arrastra el fondo para moverte y usa la rueda o pellizca para hacer zoom. Pasa el puntero sobre una nota para resaltar sus enlaces. En una pantalla táctil, un primer toque en una nota resalta sus enlaces y un segundo la abre.
- El grafo se adapta solo: los nombres aparecen al acercarte, las flechas indican la dirección de los enlaces cuando son pocos y una nota con más enlaces se ve más grande. Sin grupos de color, cada nota toma el color de su carpeta.
- Cuando cambian los documentos de la carpeta, el grafo se vuelve a dibujar.

## Ajustes

El botón de controles deslizantes de arriba del grafo completo abre sus ajustes; el de la barra lateral no tiene.

- **Filtros**: una búsqueda (`path:ideas`, `file:draft`, `tag:#todo`, con `-` delante para excluir); **Etiquetas** muestra las #etiquetas como nodos; **Solo archivos existentes** oculta las notas aún no escritas; **Huérfanas** (grafo completo) muestra las notas sin enlaces.
- **Grupos**: colorea las notas que encuentra una búsqueda. **Nuevo grupo** añade uno; **Restablecer** deshace tus cambios.

En una bóveda de Obsidian, los grupos de color guardados en el `graph.json` de Obsidian también colorean las notas, después de los tuyos.

## Permisos

- Leer archivos y el documento: para encontrar las notas y enlaces de la carpeta, y el `graph.json` de Obsidian.
- Herramientas para Textus AI: para que Textus AI vea las notas alrededor de un documento.

## Cambios

- **0.5.10** - By touch, a first tap on a note lights it and its links and a second opens it; notes are easier to hit with a finger, and a second finger zooms instead of also moving the graph. Its settings open in Textus's own popover. Its page receives Textus's messages by the API's current name.
- **0.5.9** - Esc while dragging a note or the view puts it back, and a touch the system cancels no longer leaves a drag stuck.
- **0.5.8** - The graph in the sidebar spreads out to fit its panel, instead of starting as a small clump with labels on top of each other. Sorts names with Textus's own order instead of a copy of it, so the package is smaller.
- **0.5.7** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.5.6** - The counts and buttons at the top of the graph tab stay in view: scrolling or pinching over the graph no longer pushes them up under the tab. Labels no longer pile on top of each other: the most linked notes keep theirs and the rest show as you zoom in. A big folder opens already laid out instead of unfolding, and pictures and other attachments a note links to stay out of the graph unless you turn on Attachments in its settings. Switching documents or saving no longer shakes the whole graph loose to settle again.
- **0.5.5** - Standard Markdown links to notes not written yet are placed as Textus places them, and merge with [[links]] to the same note. Fit spreads a small graph over the whole pane, so names no longer sit on each other. Ctrl/Cmd-click opens a note beside the one in front. Labels follow the interface text size, and folder colours follow the theme. The sidebar graph has no settings of its own any more.
- **0.5.4** - A trackpad pinch zooms smoothly, in step with the gesture; with Textus 1.3.13 a pinch on a Mac zooms the graph, not the document behind it. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.5.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.5.2** - Obsidian's colour groups come from the nearest vault, even one above the open folder. Needs Textus 1.3.10.
- **0.5.1** - In an Obsidian vault, the colour groups in `.obsidian/graph.json` colour the notes too.
- **0.5.0** - [[Links]] are matched to notes the same way Textus matches them when you click one.
- **0.4.0** - Textus AI can see the notes around a document (`list_neighbours`).
- **0.3.0** - Textus's own controls and menus; colours from the theme.
- **0.2.0-0.2.1** - A settings panel with filters, search and colour groups; tags as nodes; arrows for link direction; the sidebar graph's depth.
- **0.1.0-0.1.1** - First versions: the whole folder in a tab and the notes around the open document in the sidebar, coloured by folder, smooth with thousands of notes.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `list_neighbours`: El entorno de un documento en el grafo de notas - el que está al frente si no se da ruta -: las notas a pocos enlaces en cualquier sentido, cada una con a cuántos enlaces está, y los enlaces entre ellas. Un [[enlace]] a una nota que no existe aparece como kind missing.
<!-- /ai-tools -->

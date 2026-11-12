# Vista de grafo

Dibuja tus notas y los enlaces entre ellas como un grafo, de toda la carpeta o alrededor del documento abierto.

- **Ctrl+Alt+G** (**⌘⌥G** en un Mac), o **Plugins › Abrir la vista de grafo**, muestra toda la carpeta en una pestaña. **Ajustar** lo encuadra todo.
- La pestaña **Grafo** de la barra lateral muestra las notas alrededor del documento abierto. El botón de arriba del panel Grafo de la barra lateral abre toda la carpeta.
- Cuentan los [[enlaces wiki]] y los enlaces a otros documentos; dos notas que se enlazan entre sí comparten una línea. Un [[enlace]] a una nota aún no escrita aparece como una nota propia.
- Haz clic en una nota para abrirla. Arrastra una nota para colocarla, arrastra el fondo para moverte y usa la rueda o pellizca para hacer zoom. Pasa el puntero sobre una nota para resaltar sus enlaces.
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

- **0.5.5** - Los enlaces Markdown estándar a notas aún no escritas se colocan donde Textus las crea y se unen con los [[enlaces]] a la misma nota. Ctrl/Cmd-clic abre una nota junto a la de delante. Las etiquetas siguen el tamaño del texto de la interfaz y los colores de carpeta, el tema. El grafo de la barra lateral ya no tiene ajustes propios.
- **0.5.4** - Un pellizco en el trackpad hace zoom con suavidad, al ritmo del gesto; con Textus 1.3.13, en un Mac el pellizco amplía el grafo, no el documento de detrás. Textos de ayuda y de estado vacío más breves. Su panel lateral y su página siguen el diseño de Textus 1.3.13.
- **0.5.3** - Sus barras, listas y controles son ahora los de Textus, crecen con la interfaz y siguen cada tema; necesita Textus 1.3.12.
- **0.5.2** - Los grupos de color de Obsidian se leen de la bóveda más cercana, aunque esté por encima de la carpeta abierta. Requiere Textus 1.3.10.
- **0.5.1** - En una bóveda de Obsidian, los grupos de color de `.obsidian/graph.json` también colorean las notas.
- **0.5.0** - Los [[enlaces]] se asocian a las notas igual que cuando haces clic en uno en Textus.
- **0.4.0** - Textus AI puede ver las notas alrededor de un documento (`list_neighbours`).
- **0.3.0** - Controles y menús propios de Textus; colores del tema.
- **0.2.0-0.2.1** - Panel de ajustes con filtros, búsqueda y grupos de color; etiquetas como nodos; flechas para la dirección de los enlaces; profundidad del grafo lateral.
- **0.1.0-0.1.1** - Primeras versiones: toda la carpeta en una pestaña y las notas alrededor del documento abierto en la barra lateral, con colores por carpeta y fluidez con miles de notas.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `list_neighbours`: El entorno de un documento en el grafo de notas - el que está al frente si no se da ruta -: las notas a pocos enlaces en cualquier sentido, cada una con a cuántos enlaces está, y los enlaces entre ellas. Un [[enlace]] a una nota que no existe aparece como kind missing.
<!-- /ai-tools -->

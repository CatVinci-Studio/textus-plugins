# Tablero de tareas

Organiza el trabajo en tarjetas y listas sobre un tablero que se guarda como un archivo Markdown normal.

- **Plugins › Nuevo tablero de tareas…** pide un nombre y crea _nombre_.md en la carpeta abierta, con `kanban-plugin: board` en su front matter y tres listas: Por hacer, En curso y Hecho. Si ya hay un tablero con ese nombre, se abre ese.
- Cualquier archivo .md con `kanban-plugin` en su front matter se abre como tablero. Así guarda sus tableros el plugin Kanban de Obsidian, de modo que cada app abre los de la otra. Los tableros antiguos llamados _nombre_.kanban.md también se abren como tableros.
- Cada lista es un encabezado del archivo y cada tarjeta una tarea debajo, así que el tablero se lee bien en cualquier sitio.

## En el tablero

- **Añadir una tarjeta** al final de una lista. Haz clic en el texto de una tarjeta para editarlo y marca su casilla cuando esté hecha. Su botón ⋯ (o un clic derecho) la mueve a otra lista o la elimina; Deshacer en el aviso que sigue la recupera.
- **Añadir lista** crea una lista nueva, lista para ponerle nombre. Haz clic en el título de una lista para renombrarla; una lista vacía se puede eliminar desde su menú ⋯.
- En un teléfono, cada lista ocupa la pantalla: desliza para pasar a la siguiente.
- Arrastra tarjetas dentro de una lista o a otra, y arrastra una lista por su cabecera para cambiar el orden. Las demás se apartan mientras arrastras. En una pantalla táctil, mantén pulsada una tarjeta un momento y luego arrástrala; en el borde de la pantalla de un teléfono, el tablero pasa a la lista siguiente. Si la mantienes pulsada y la sueltas sin moverla, se abre su menú.
- Escribe un [[enlace]] en una tarjeta y haz clic en él para abrir esa nota.
- **Editar como Markdown** abre el archivo como texto. El tablero sigue los cambios hechos ahí o en cualquier otro sitio.
- Lo que el Kanban de Obsidian guarda en el archivo además de las listas, como sus ajustes y la marca de su lista de terminadas, queda como estaba.

```markdown
---
kanban-plugin: board
---

## Por hacer

- [ ] Escribir el esquema

## Hecho

- [x] Elegir un título
```

## Permisos

- Leer y escribir archivos: para abrir tableros y guardarlos.
- Herramientas para Textus AI: para que Textus AI pueda encontrar y leer tableros, añadir tarjetas y moverlas.

## Cambios

- **0.4.14** - On a phone or tablet, hold a card a moment to drag it within a list or to another; at the screen's edge on a phone the board turns to the next list, and the page no longer scrolls under the card. Held and let go without moving, a card opens its menu. Dragged near the board's edge, the board scrolls, and a card let go below a short list goes into that list.
- **0.4.13** - A card's ⋯ menu (or a right-click) moves it to another list or deletes it, with Undo, instead of an × that deleted at once - always showing on a touch screen. A new list starts with its name being written. On a phone a list fills the screen and a swipe settles on the next; in a narrow tab, Edit as Markdown goes into the ⋯ menu.
- **0.4.12** - Cards and lists make way at the pace of the rest of Textus.
- **0.4.11** - A list dragged by its head lifts and slides along the board as Textus's own tabs do; Esc puts it back.
- **0.4.10** - A card's checkbox sits on the middle of its first line at any text size.
- **0.4.9** - Right-clicking a card or list name while you edit it (to paste) no longer ends the edit, and an input method's Enter on iPhone and iPad picks its words instead of saving. The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.4.8** - A board with Windows (CRLF) line endings keeps them, and a board changed while you edit (saved as Markdown in Textus, or by a plugin) shows that change instead of writing over it, and says so. The store description now opens with what the plugin does.
- **0.4.7** - A blank line inside a card no longer splits it, and Escape no longer leaves an empty card. The AI leaves ordinary notes alone, and the board fits narrow panels.
- **0.4.6** - The board fades at its edges where lists run past the window.
- **0.4.5** - A dragged card or list stays right under the pointer and lifts like everything dragged in Textus. Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.4** - Dragging a card or a list no longer selects text on the way.
- **0.4.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.2** - Cards and lists follow the pointer as you drag, the others making way. Needs Textus 1.3.10.
- **0.4.1** - Keeps the mark Obsidian's Kanban puts on a done list.
- **0.4.0** - Renamed Task Board (was Kanban). New boards are plain .md files with `kanban-plugin` in their front matter, as Obsidian writes them; .kanban.md boards still open.
- **0.3.1** - Textus AI tells boards apart from tasks written in documents.
- **0.3.0** - Textus AI can list and read boards, add cards and move them.
- **0.2.0** - Textus's own controls and menus.
- **0.1.0-0.1.3** - First versions: boards as Markdown, cards dragged between lists, lists moved by their head, [[links]] that open notes, Edit as Markdown, changes made elsewhere shown at once, Obsidian's settings kept.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `list_boards`: Enumera los tableros Kanban (archivos kanban-plugin .md) de la carpeta abierta, cada uno con sus listas y cuántas tarjetas tiene cada una.
- `read_board`: Lee un tablero Kanban: sus listas en orden, cada una con el texto de sus tarjetas y si están hechas. Las tareas escritas en documentos normales son list_tasks.
- `add_card`: Añade una tarjeta al final de una lista de un tablero Kanban. Solo para un tablero (kanban-plugin .md); una tarea en un documento es add_task.
- `move_card`: Mueve una tarjeta de un tablero Kanban a otra lista, o a otro lugar de la suya.
<!-- /ai-tools -->

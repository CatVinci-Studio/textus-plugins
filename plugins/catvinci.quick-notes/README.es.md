# Notas rápidas

Apunta algo sin salir del documento; la nota va al archivo de bandeja de entrada de tu carpeta o a la nota diaria de hoy.

- **Ctrl+Alt+N** (**⌘⌥N** en un Mac), o **Plugins › Nueva nota rápida…**, pide una nota y la guarda.
- En el escritorio, **Nueva nota rápida…** también está en el icono de la bandeja o de la barra de menús. El plugin pide a Textus que siga funcionando en segundo plano, así que está ahí aunque cierres todas las ventanas.
- La pestaña **Notas rápidas** de la barra lateral lista las notas, la más reciente arriba. Haz clic en **Nueva** para escribir una ahí, o edita una nota directamente en la lista.
- El menú de acciones de cada nota (su botón de más opciones, o clic derecho) tiene **Insertar** (en el cursor del documento), **Abrir** y **Eliminar**. Una nota guardada en un documento se abre ahí, en su línea.
- ¿Borraste una sin querer? **Deshacer**, abajo, la recupera durante unos segundos. Una nota nueva que se deja vacía desaparece sola.
- Con seis notas o más, aparece arriba un campo de búsqueda.

## Dónde se guardan

Las notas se guardan en un documento de la carpeta abierta, así que Obsidian y Cloud Sync las ven. Elige dónde en **Guardar notas en**, en los ajustes del plugin:

- **Archivo de bandeja de entrada** (por defecto): `Inbox.md` en la raíz de la carpeta, u otro documento indicado en **Archivo de bandeja de entrada**. Cada nota se añade al final como elemento de lista con su fecha y hora, por ejemplo `- 2026-11-08 14:05 Llamar a Ana`.
- **Nota diaria de hoy**: bajo un encabezado `## Notas rápidas` (en el idioma de la interfaz), que se crea si falta. Cada nota lleva su hora, por ejemplo `- 14:05 Llamar a Ana`. La carpeta, el nombre y la plantilla de la nota diaria siguen los ajustes de notas diarias de la carpeta, como los de Obsidian; sin ellos es `Daily/YYYY-MM-DD.md`.

Edita el archivo y la barra lateral lo sigue. Las notas de versiones anteriores pasan a él una sola vez, de la más antigua a la más reciente. Sin carpeta abierta, las notas se quedan dentro de Textus.

En un teléfono, **Nueva nota rápida…** está en **Plugins**, en el menú de la fila del título, y las acciones de cada nota están en su botón de más opciones. Ahí no hay bandeja, así que no pide que Textus siga funcionando en segundo plano.

## Permisos

- Leer y escribir archivos: para el archivo de bandeja de entrada o la nota diaria.
- Editar el documento: para insertar una nota en el cursor.
- Herramientas para Textus AI: para que Textus AI pueda añadir una nota rápida.

## Cambios

- **0.6.0** - On iPhone, iPad and Android too: **New Quick Note…** under Plugins and the sidebar tab, with New and each note's more button easy to tap. Only the desktop asks to keep Textus running in the background. Needs Textus 1.4.7. Its page no longer says which devices it runs on: the store shows that. Its page receives Textus's messages by the API's current name.
- **0.5.5** - Its buttons' names and tooltips come from Textus, as on its other pages.
- **0.5.4** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.5.3** - New while searching clears the search, so the new note shows; right-clicking a note's text also offers undo, cut, copy and paste; a search with no match says so.
- **0.5.2** - In the sidebar the panel draws no title of its own, as the sidebar's other tabs. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout. An empty list says what Quick Notes is for and offers New; a note's box grows with its text.
- **0.5.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.5.0** - Dates and the daily note's template are filled by Textus itself, the same way as in Calendar & Daily Notes and Templates. Needs Textus 1.3.10.
- **0.4.0** - Notes are kept in a document of the folder: `Inbox.md` or today's daily note. Notes from older versions move in once.
- **0.3.1** - Textus AI tells quick notes apart from the daily journal and to-dos.
- **0.3.0** - Textus AI can add a quick note (`add_note`).
- **0.2.0** - Textus's own controls, and an actions menu for each note.
- **0.1.0-0.1.4** - First versions: the shortcut and the tray, the sidebar list, insert, open, delete with Undo, search once there are many, dates on a line of their own; desktop only.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `add_note`: Añade una nota rápida al principio de la lista de Notas rápidas de la barra lateral, para insertarla luego en un documento o abrirla como uno. El diario de hoy es append_to_daily_note; una tarea, add_task.
<!-- /ai-tools -->

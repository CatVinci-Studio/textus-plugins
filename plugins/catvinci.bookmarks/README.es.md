# Marcadores

Marca un pasaje y vuelve a él desde la barra lateral, en cualquier documento.

Selecciona unas palabras y elige **Marcar la selección**: haz clic derecho en la selección o usa **Plugins › Marcar la selección**. Guarda antes el documento, porque el marcador apunta a su archivo.

La pestaña **Marcadores** de la barra lateral los lista por documento. Haz clic en uno para abrir el documento en esas palabras. Para quitarlo, haz clic derecho y elige **Quitar marcador**. Si el documento se renombra o se mueve, sus marcadores lo siguen.

## Bóvedas de Obsidian

Cuando la carpeta abierta es una bóveda de Obsidian (tiene una carpeta `.obsidian`):

- Los marcadores propios de Obsidian, en `.obsidian/bookmarks.json`, también aparecen en la pestaña, bajo **Marcadores de Obsidian** y con sus grupos. Se listan los de notas, encabezados y bloques; búsquedas, carpetas y similares no.

## Permisos

- Leer el documento: para leer la selección.
- Leer archivos: para el `bookmarks.json` de Obsidian.
- Herramientas para Textus AI: para que Textus AI pueda listar tus marcadores.

## Cambios

- **0.4.6** - Its page shows its list of changes in English in every language.
- **0.4.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.4.4** - Obsidian's bookmarks are listed as before but no longer written: Textus 1.4 keeps plugins out of `.obsidian`. Needs Textus 1.4.0.
- **0.4.3** - Rows are grouped by the document's path in the folder, one group per document; long passages end at a word with "…"; a failed block-id edit in a vault keeps the bookmark.
- **0.4.2** - Shorter help and empty-state text.
- **0.4.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.0** - In an Obsidian vault, new bookmarks are written to Obsidian's `bookmarks.json` too, and removed and renamed there.
- **0.3.0** - Lists the vault's own Obsidian bookmarks of notes, headings and blocks.
- **0.2.1** - Paths handled by code shared with other plugins; nothing changes in use.
- **0.2.0** - Textus AI can list your bookmarks (`list_bookmarks`).
- **0.1.0-0.1.2** - First versions: bookmark a selection, the sidebar list by document, bookmarks that follow renames; store page and icon; runs on desktop and iOS.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `list_bookmarks`: Enumera los marcadores del usuario: las palabras marcadas en cada documento, con la ruta del documento en la carpeta abierta.
<!-- /ai-tools -->

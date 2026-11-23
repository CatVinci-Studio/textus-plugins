# Historial de versiones

Guarda cada guardado de un documento como una versión, para ver qué cambió y recuperar una antigua.

- Cada vez que guardas, el texto del documento queda como una versión. Los guardados muy seguidos (el autoguardado de cada pocos segundos) cuentan como uno, con una versión nueva como mucho cada 15 minutos. Se guarda todo el último día, luego una por hora durante una semana, una por día durante tres meses y una por semana antes de eso.
- La pestaña **Historial** de la barra lateral lista las versiones del documento abierto, la más reciente arriba, agrupadas por día: Hoy, Ayer y luego la fecha.
- Elige una para ver, línea a línea, qué cambió desde entonces.
- Compárala con el documento actual o con cualquier otra versión, con las palabras cambiadas marcadas. **Restaurar** junto a un cambio recupera solo ese cambio; **Más** pone nombre o fija una versión, que entonces se guarda siempre, o la abre como documento nuevo. También se guardan los cambios hechos fuera de Textus (otra app, una sincronización, git): el texto de antes y el de después.
- **Restaurar** ofrece el texto antiguo como una edición del documento, que aceptas o rechazas como cualquier otra. **Abrir como documento nuevo** la abre al lado.
- Las versiones se guardan dentro de Textus, no en tu carpeta. Los documentos de más de 2 MB no se guardan, y cuando el almacenamiento se llena se van primero las versiones más antiguas.

## Permisos

- Leer archivos y el documento: para guardar cada versión y compararla con el texto actual.
- Proponer ediciones: para devolver una versión antigua como una edición que aceptas o rechazas.
- Herramientas para Textus AI: para que Textus AI pueda listar las versiones de un documento y compararlas.

## Cambios

- **0.5.1** - Its page shows its list of changes in English in every language. Its page receives Textus's messages by the API's current name.
- **0.5.0** - From Textus 1.4.4 the versions other plugins keep of a document - Cloud Sync's - are listed too, each under its source's name, to compare and restore like the rest.
- **0.4.1** - Restore is one word, so its button fits a narrow sidebar in every language.
- **0.4.0** - Versions thin out with age instead of the last 50 going; each text is stored once; a deleted document's versions go a month later. Compare any two versions, word by word; take back one change; name and pin versions; changes made outside Textus are kept. Versions from 0.3 move over by themselves. Needs Textus 1.4.3. In a Git folder on the desktop, the document's commits show under its versions.
- **0.3.8** - The text from before the first save is no longer lost when that save comes right as the document opens.
- **0.3.7** - The text a document had before its first save is kept as a version too, and a document's versions follow it when it is renamed or moved.
- **0.3.6** - Autosave while you type writes only the newest version, not every version of the document, so long documents save with much less work.
- **0.3.5** - An open version stays open while autosave updates it, and Restore always finds it. When storage is full, older versions of other documents make room, and the panel says when a save couldn't be kept. Rows work from the keyboard; buttons wrap in a narrow sidebar.
- **0.3.4** - In the sidebar the panel draws no title of its own, as the sidebar's other tabs. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.3.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - Only the path code shared with other plugins changed; nothing changes in use.
- **0.3.0** - Textus AI can list a document's versions and compare them (`list_versions`, `diff_versions`).
- **0.2.0** - Textus's own controls. Needs Textus 1.3.2.
- **0.1.0-0.1.3** - First versions: a version on each save, what changed since, restore as an edit to accept or reject, open as a new document, saves close together kept as one, versions grouped by day, the oldest dropped when storage is full.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `list_versions`: Enumera las versiones guardadas de un documento - el que está al frente si no se da ruta -, la más reciente primero, numeradas desde 1, cada una con cuándo se guardó y su tamaño.
- `diff_versions`: Muestra, línea a línea, qué cambió entre dos versiones de un documento, o entre una versión y el documento tal como está: + añadido, - quitado, con algo de contexto.
<!-- /ai-tools -->

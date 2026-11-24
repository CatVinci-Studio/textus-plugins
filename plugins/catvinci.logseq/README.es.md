# Carpetas de Logseq

Abre un grafo de Logseq tal como lo escribe Logseq: enlaces por nombre de página, imágenes en assets, diarios en su carpeta y con su formato de fecha.

## Qué hace

- Cuando la carpeta que abres, o una carpeta superior, es un grafo de Logseq guardado como archivos (tiene `logseq/config.edn`), Textus escribe los enlaces por nombre de página (`[[Page]]`), pone las páginas creadas desde un enlace en `pages/` (o en tu `:pages-directory`), y Notas diarias guarda los diarios en `journals/`, con el nombre que indica tu `:journal/file-name-format`.
- La carpeta de imágenes de Logseq, `assets/`, se ofrece una vez en una tarjeta en la esquina. Si la aceptas, queda guardada en el `.textus/settings.json` de la carpeta; si te quedas con la tuya, Textus no vuelve a preguntar.
- Los enlaces wiki del grafo se encuentran desde la carpeta del grafo incluso sin este plugin.

## Permisos

Solo pide **leer los archivos de la carpeta abierta**: Textus le pasa `logseq/config.edn` y el plugin dice lo que significa. No cambia nada.

## Cambios

- **0.1.2** - A simpler icon, drawn in the text colour.
- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it.
- **0.1.0** - First version: Logseq's settings offered when a Logseq graph is opened. Needs Textus 1.4.6.

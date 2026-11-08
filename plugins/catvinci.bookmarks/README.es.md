# Marcadores

Marca un pasaje y vuelve a él desde la barra lateral, en cualquier documento.

Selecciona unas palabras y elige **Marcar la selección**: haz clic derecho en la selección o usa **Plugins › Marcar la selección**. Guarda antes el documento, porque el marcador apunta a su archivo.

La pestaña **Marcadores** de la barra lateral los lista por documento. Haz clic en uno para abrir el documento en esas palabras. Para quitarlo, haz clic derecho y elige **Quitar marcador**. Si el documento se renombra o se mueve, sus marcadores lo siguen.

## Bóvedas de Obsidian

Cuando la carpeta abierta es una bóveda de Obsidian (tiene una carpeta `.obsidian`):

- Los marcadores propios de Obsidian, en `.obsidian/bookmarks.json`, también aparecen en la pestaña, bajo **Marcadores de Obsidian** y con sus grupos. Se listan los de notas, encabezados y bloques; búsquedas, carpetas y similares no.
- Cada marcador nuevo se escribe también en `bookmarks.json`, así Obsidian lo tiene. En un encabezado es un marcador de encabezado; en cualquier otro sitio es de bloque, y el bloque recibe un id como `^a1b2c3` (si ya tiene uno, se usa ese).
- Quitar un marcador aquí, o renombrar su documento, cambia también `bookmarks.json`. El resto del archivo queda como estaba.

## Permisos

- Leer y editar el documento: para leer la selección y añadir el id de un bloque en una bóveda.
- Leer y escribir archivos: para el `bookmarks.json` de Obsidian.
- Herramientas para Textus AI: para que Textus AI pueda listar tus marcadores.

## Cambios

- **0.4.1** - Su página dice ahora en una frase qué hace, qué puede hacer y qué cambió en cada versión.
- **0.4.0** - En una bóveda de Obsidian, los marcadores nuevos se escriben también en su `bookmarks.json`, y se quitan y renombran allí.
- **0.3.0** - Lista los marcadores propios de Obsidian de la bóveda: notas, encabezados y bloques.
- **0.2.1** - Las rutas se manejan con código compartido con otros plugins; nada cambia al usarlo.
- **0.2.0** - Textus AI puede listar tus marcadores (`list_bookmarks`).
- **0.1.0-0.1.2** - Primeras versiones: marcar la selección, la lista por documento en la barra lateral, marcadores que siguen los cambios de nombre; página de la tienda e icono; funciona en escritorio e iOS.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `list_bookmarks`: Enumera los marcadores del usuario: las palabras marcadas en cada documento, con la ruta del documento en la carpeta abierta.
<!-- /ai-tools -->

# Espaciado CJK

Pone un espacio entre texto chino o japonés y letras latinas o números.

## Espaciar un documento

- Elige **Plugins › Añadir espacios entre CJK y latín**, o la misma opción del menú contextual. 用Textus写作 pasa a 用 Textus 写作. Todo el documento cambia en un solo paso de deshacer, y un aviso dice cuántos bloques cambiaron.
- Activa **También al guardar** en los ajustes del plugin para espaciar cada documento al guardarlo. Solo cambian los párrafos, encabezados, listas y demás prosa.
- El coreano queda como está: ya separa sus palabras con espacios.

## Lo que queda como está

- El código, las fórmulas, los enlaces y enlaces wiki, las notas al pie, las #etiquetas, los recordatorios (@…), los comentarios %%, el HTML y el front matter, también al guardar.
- Lo que escribe Obsidian: los ids de bloque (^1a2b3c), los campos de Dataview (key:: value), los ==resaltados== y los campos de Obsidian Tasks (📅 2026-11-07).

## Permisos

- **Leer y editar el documento**: para espaciar el documento abierto.
- **Escribir archivos**: para espaciar un documento al guardarlo, con **También al guardar** activado.
- **Herramientas para Textus AI**: para que Textus AI pueda espaciar un texto por ti.

## Cambios

- **0.2.2** - deja como están los ids de bloque, los campos de Dataview, los resaltados y los campos de Tasks de Obsidian
- **0.2.1** - deja como están las #etiquetas, los recordatorios y los comentarios %%; al guardar solo cambian los bloques de prosa
- **0.2.0** - una herramienta para Textus AI, `fix_cjk_spacing`
- **0.1.3** - funciona en escritorio y en iOS
- **0.1.2** - deja como están los enlaces, los enlaces wiki, las notas al pie, las etiquetas y el front matter
- **0.1.0-0.1.1** - primeras versiones: el comando en el menú contextual y en el menú Plugins, y el espaciado al guardar

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `fix_cjk_spacing`: Pone un espacio entre caracteres chinos o japoneses y letras latinas o cifras en un Markdown, sin tocar el código ni los enlaces, como el comando del complemento. Devuelve el texto espaciado; no escribe nada.
<!-- /ai-tools -->

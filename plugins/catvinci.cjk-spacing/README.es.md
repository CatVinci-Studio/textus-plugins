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

- **0.3.0** - From Textus 1.4.4, a paragraph missing a space between CJK and Latin text is underlined; its card adds the spaces. Turn it off in the plugin's settings.
- **0.2.4** - A code block inside a longer fence (```` holding ```) is left alone.
- **0.2.3** - Its Textus AI tool says what it does: Chinese and Japanese, not Korean.
- **0.2.2** - leaves Obsidian's block ids, Dataview fields, highlights and Tasks fields as written
- **0.2.1** - leaves #tags, reminders and %% comments alone; on save only prose blocks change
- **0.2.0** - a tool for Textus AI, `fix_cjk_spacing`
- **0.1.3** - runs on the desktop and on iOS
- **0.1.2** - leaves links, wiki links, footnotes, tags and front matter alone
- **0.1.0-0.1.1** - first versions: the command in the right-click and Plugins menus, and spacing on save

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `fix_cjk_spacing`: Pone un espacio entre caracteres chinos o japoneses y letras latinas o cifras en un Markdown, sin tocar el código ni los enlaces, como el comando del complemento. Devuelve el texto espaciado; no escribe nada.
<!-- /ai-tools -->

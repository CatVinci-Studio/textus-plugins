# Tareas

Reúne todas las tareas de tu carpeta en una lista, márcalas ahí y consúltalas como en Obsidian Tasks.

- Escribe una tarea en cualquier sitio como `- [ ] algo que hacer`.
- La pestaña **Tareas** de la barra lateral lista las tareas de todos los documentos de la carpeta abierta, por documento y bajo el título donde está cada una.
- Márcala ahí como hecha, o haz clic para ir a ella en su documento.
- Ponle una fecha (`📅 2026-11-01`, `due:2026-11-01` o `[due:: 2026-11-01]`) y aparece como una etiqueta. Las tareas vencidas o que vencen en una semana salen primero, en **Vencen pronto**.
- El campo de arriba filtra la lista por palabras, el nombre del documento o su título.
- Las tareas terminadas no se muestran salvo que actives **Mostrar las tareas terminadas** en **Ajustes › Extensiones › Complementos › Tareas**.
- Las tarjetas de un tablero Kanban (un documento con `kanban-plugin` en sus propiedades, o `nombre.kanban.md`) son del tablero y no salen en la lista lateral.

## Tareas escritas en Obsidian

Las tareas escritas con el plugin Tasks de Obsidian funcionan igual aquí:

- `[/]` está en curso, y sigue abierta; `[-]` está cancelada, y terminada.
- Los campos al final de una tarea (📅 vencimiento, ⏳ programada, 🛫 inicio, ➕ creación, ✅ hecha, ❌ cancelada, una prioridad 🔺 ⏫ 🔼 🔽 ⏬ y 🔁 una repetición) se quedan en el archivo y no salen en la lista.
- Marcar una tarea escribe ✅ y el día; desmarcarla quita la fecha de hecha o de cancelada.
- Marcar una tarea que se repite pone la siguiente en la línea de arriba, con sus fechas adelantadas. Entiende repeticiones como `🔁 every day`, `every 2 weeks`, `every weekday`, `every weekend`, `every Monday`, `every month on the 15th`, `every month on the last`, `every year` y `… when done`.

## Consultas de tareas

Un bloque de código `tasks` lista las tareas que pide, una regla por línea, como en Obsidian:

````markdown
```tasks
not done
due before next week
path includes Projects
sort by due
```
````

- **Estado**: `done`, `not done` y `status.type is` (`todo`, `in_progress`, `done` o `cancelled`).
- **Fechas**: `due`, `scheduled`, `starts`, `done`, `created`, `cancelled` o `happens` con `before`, `after`, `on`, `in`, `on or before` u `on or after` y una fecha: 2026-11-01, today, tomorrow, yesterday, o this, next o last con week, month o year. También `no due date` y `has due date` (y lo mismo con las demás fechas).
- **Texto**: `path`, `folder`, `filename`, `description` o `heading` con `includes` o `does not include`; `tag includes`, `tag does not include`, `has tags` y `no tags`.
- **Otros**: `priority is` (también `above`, `below`, `not`), `is recurring` e `is not recurring`.
- **Orden**: `sort by` y `group by` (status, due, scheduled, start, done, created, priority, path, folder, filename, heading o description, con `reverse` si quieres) y `limit`. Sin `sort by`, las tareas van en el orden de Obsidian Tasks: estado, vencimiento, prioridad, ruta.

Las líneas sobre el aspecto (`hide …`, `show …`) se pasan por alto; cualquier otra que no entienda se nombra bajo el recuento. El bloque también lista las tarjetas de los tableros. Marca una tarea ahí para marcarla en su archivo; haz clic para ir a ella.

## Permisos

El plugin lee los documentos de la carpeta para encontrar sus tareas, y escribe en un documento solo para marcar una tarea o añadir una. También da a Textus AI las herramientas de abajo. Funciona en el escritorio y en iPhone y iPad.

## Cambios

- **0.4.1** - Sus barras, listas y controles son ahora los de Textus, crecen con la interfaz y siguen cada tema; necesita Textus 1.3.12.
- **0.4.0** - Usa las fechas integradas en Textus 1.3.10, que ahora requiere.
- **0.3.1** - Incluye el código de fechas compartido actualizado; nada más cambia.
- **0.3.0** - Obsidian Tasks: `[/]` y `[-]`, los campos de tarea, fechas de hecha, tareas que se repiten y bloques de consulta `tasks`; los tableros marcados con `kanban-plugin` quedan fuera de la lista.
- **0.2.1** - Las tarjetas de un tablero Kanban (`nombre.kanban.md`) ya no se listan.
- **0.2.0** - Textus AI puede listar, añadir y marcar tareas.
- **0.1.3** - La lista sigue el idioma de la interfaz cuando cambia.
- **0.1.2** - Vencimientos en hora local; recuentos con las formas de plural de cada idioma.
- **0.1.0-0.1.1** - Primeras versiones: todas las tareas de la carpeta en una lista lateral, para marcarlas o ir a ellas, con filtro, vencimientos y Vencen pronto.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `list_tasks`: Enumera las tareas de Markdown (- [ ] ...) de los documentos de la carpeta abierta - solo las pendientes, salvo que se pida otra cosa -, cada una con su texto, fecha límite, ruta del documento y línea. Filtra por estado, documento, etiqueta, fecha y palabras. No incluye tarjetas de Kanban (read_board) ni recordatorios con hora (list_reminders).
- `add_task`: Añade una tarea (- [ ] ...) a un documento de la carpeta abierta: al final, o al final de la sección bajo un encabezado, con fecha límite si se da. Crea el documento si no existe. Devuelve dónde quedó. Para algo que deba avisar a una hora, usa add_reminder; una tarjeta de tablero es add_card, una fila de base de datos add_row y una línea del diario de hoy append_to_daily_note.
- `complete_task`: Marca una tarea como hecha (- [x]) - o, con done en false, la reabre - por la ruta de su documento y su línea, como las da list_tasks. Escribe la fecha de finalización (✅ AAAA-MM-DD) como Obsidian Tasks y, en una tarea recurrente (🔁 every …), añade la siguiente en la línea de arriba.
<!-- /ai-tools -->

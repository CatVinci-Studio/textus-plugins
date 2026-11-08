# Tareas

Todas las tareas de tu carpeta, en una sola lista.

- Escribe una tarea en cualquier parte como `- [ ] algo por hacer`.
- La pestaña **Tareas** de la barra lateral lista las tareas de todos los documentos de la carpeta abierta.
- Márcala allí como hecha, o haz clic para ir a ella en su documento.
- Si se muestran las tareas terminadas se cambia en los ajustes del complemento.
- Ponle una fecha a una tarea (`📅 2026-11-01` o `due:2026-11-01`) y aparece como una etiqueta; las tareas vencidas o que vencen en una semana se listan primero, en **Vencen pronto**.
- El campo de arriba filtra la lista por palabras, por el nombre del documento o por su encabezado.
- Las tarjetas de un tablero Kanban (un documento con `kanban-plugin` en su front matter, o `nombre.kanban.md`) se quedan en el tablero y no se listan.

## Tareas escritas en Obsidian

Las tareas que escribe el complemento Tasks de Obsidian funcionan igual aquí:

- `[/]` está en curso y sigue pendiente; `[-]` está cancelada y cuenta como terminada.
- Los campos al final de una tarea (📅 vence, ⏳ programada, 🛫 inicio, ➕ creada, ✅ hecha, ❌ cancelada, una prioridad 🔺 ⏫ 🔼 🔽 ⏬ y 🔁 una repetición) se quedan en el archivo y no se muestran en la lista.
- Al marcar una tarea se escribe ✅ y la fecha del día; al desmarcarla se quitan.
- Al marcar una tarea que se repite (`🔁 every day`, `every 2 weeks`, `every weekday`, `every Monday`, `every month on the 15th`, `every year`, `… when done`) se añade la siguiente en la línea de arriba, con sus fechas adelantadas.

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

Entiende `not done` y `done`; `due`, `scheduled`, `starts`, `done` o `created` con `before`, `after`, `on`, `on or before` u `on or after` y una fecha (2026-11-01, today, tomorrow, yesterday, this, next o last week, month o year); `no due date` y `has due date`; `path`, `filename`, `description` o `heading` con `includes` o `does not include`; `tag includes`; `priority is`; `is recurring`; `sort by`, `group by` (path, folder, filename, heading, due, priority, status) y `limit`. Las líneas sobre el aspecto (`hide …`, `show …`) se pasan por alto; cualquier otra que no entienda se nombra bajo el recuento. Marca una tarea ahí para marcarla en su archivo; haz clic para ir a ella.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `list_tasks`: Enumera las tareas de Markdown (- [ ] ...) de los documentos de la carpeta abierta - solo las pendientes, salvo que se pida otra cosa -, cada una con su texto, fecha límite, ruta del documento y línea. Filtra por estado, documento, etiqueta, fecha y palabras. No incluye tarjetas de Kanban (read_board) ni recordatorios con hora (list_reminders).
- `add_task`: Añade una tarea (- [ ] ...) a un documento de la carpeta abierta: al final, o al final de la sección bajo un encabezado, con fecha límite si se da. Crea el documento si no existe. Devuelve dónde quedó. Para algo que deba avisar a una hora, usa add_reminder; una tarjeta de tablero es add_card, una fila de base de datos add_row y una línea del diario de hoy append_to_daily_note.
- `complete_task`: Marca una tarea como hecha (- [x]) - o, con done en false, la reabre - por la ruta de su documento y su línea, como las da list_tasks. Escribe la fecha de finalización (✅ AAAA-MM-DD) como Obsidian Tasks y, en una tarea recurrente (🔁 every …), añade la siguiente en la línea de arriba.
<!-- /ai-tools -->

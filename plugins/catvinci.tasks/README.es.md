# Tareas

Todas las tareas de tu carpeta, en una sola lista.

- Escribe una tarea en cualquier parte como `- [ ] algo por hacer`.
- La pestaña **Tareas** de la barra lateral lista las tareas de todos los documentos de la carpeta abierta.
- Márcala allí como hecha, o haz clic para ir a ella en su documento.
- Si se muestran las tareas terminadas se cambia en los ajustes del complemento.
- Ponle una fecha a una tarea (`📅 2026-11-01` o `due:2026-11-01`) y aparece como una etiqueta; las tareas vencidas o que vencen en una semana se listan primero, en **Vencen pronto**.
- El campo de arriba filtra la lista por palabras, por el nombre del documento o por su encabezado.
- Las tarjetas de un tablero Kanban (`nombre.kanban.md`) se quedan en el tablero y no se listan.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `list_tasks`: Enumera las tareas de Markdown (- [ ] ...) de los documentos de la carpeta abierta - solo las pendientes, salvo que se pida otra cosa -, cada una con su texto, fecha límite, ruta del documento y línea. Filtra por estado, documento, etiqueta, fecha y palabras.
- `add_task`: Añade una tarea (- [ ] ...) a un documento de la carpeta abierta: al final, o al final de la sección bajo un encabezado, con fecha límite si se da. Crea el documento si no existe. Devuelve dónde quedó.
- `complete_task`: Marca una tarea como hecha (- [x]) - o, con done en false, la reabre - por la ruta de su documento y su línea, como las da list_tasks.
<!-- /ai-tools -->

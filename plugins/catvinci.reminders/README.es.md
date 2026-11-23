# Recordatorios

Te recuerda una línea a la hora que escribas en ella, como `(@2026-11-02 09:00)`, con una notificación del sistema.

Escribe la marca en cualquier línea: una tarea, un encabezado, cualquier línea. A esa hora, una notificación muestra el texto de la línea y su documento; haz clic en ella y se abre la línea.

- `(@2026-11-02)` sola te avisa a las nueve de esa mañana.
- **Complementos › Recordarme…**, o **Recordarme…** en el menú de barra, pone la marca en el cursor por ti: en una hora, esta noche a las 8, mañana a las 9, el lunes que viene a las 9, o una fecha y hora que escribas.
- Una tarea marcada (`- [x] …`) está hecha: no hay recordatorio.
- La pestaña **Recordatorios** de la barra lateral muestra los próximos, el más cercano primero; haz clic en uno para abrir su línea.
- Textus guarda los recordatorios él mismo: llegan mientras haya una ventana abierta, y con todas las ventanas cerradas si **Seguir abierto en segundo plano** está activado (**Ajustes › General**). Uno que se perdió mientras Textus no estaba abierto llega la próxima vez que se inicia.

Las marcas se escriben como las escribe el plugin Reminder de Obsidian, así que las mismas notas también te avisan allí.

Necesita Textus 1.4.3 o posterior. Pide leer los archivos de la carpeta abierta, para encontrar las marcas; escribir en el editor, para poner una marca; mostrar notificaciones; y dar a Textus AI las dos herramientas de abajo.

## Cambios

- **0.3.6** - Its page is in every language Textus speaks. It names the Textus it needs, 1.4.3.
- **0.3.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.3.4** - Opening a folder reads only the documents Textus finds a reminder mark in, not every document.
- **0.3.3** - The store description now opens with what the plugin does.
- **0.3.2** - Two open windows no longer clear each other's reminders, and the list empties when you close the folder. A mistyped time is refused instead of inserting a broken mark.
- **0.3.1** - Shorter help and empty-state text.
- **0.3.0** - Marks written with Textus's own dates; needs Textus 1.3.10.
- **0.2.2-0.2.3** - Updated shared date code.
- **0.2.1** - Textus AI is told when a due date belongs in Tasks instead.
- **0.2.0** - Textus AI can list the coming reminders and add one.
- **0.1.1** - Desktop only, since it runs in the background.
- **0.1.0** - First version: `(@date time)` marks as notifications Textus keeps, even in the background; Remind Me… and the sidebar list.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `list_reminders`: Enumera los próximos recordatorios - marcas (@2026-11-02 09:00) en los documentos de la carpeta abierta -, el más cercano primero, cada uno con su hora, texto, ruta del documento y línea. Las tareas por fecha límite son list_tasks.
- `add_reminder`: Añade un recordatorio como línea de tarea con su hora, - [ ] texto (@2026-11-02 09:00), al final del documento al frente; a esa hora llega una notificación. Úsalo cuando el usuario quiera un aviso a una hora; una tarea con solo fecha límite es add_task.
<!-- /ai-tools -->

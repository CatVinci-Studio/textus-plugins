# Notas rápidas

Apunta algo sin salir del documento; la nota va al archivo de bandeja de entrada de tu carpeta o a la nota diaria de hoy.

- **Ctrl+Alt+N** (**⌘⌥N** en un Mac), o **Plugins › Nueva nota rápida…**, pide una nota y la guarda.
- **Nueva nota rápida…** también está en el icono de la bandeja o de la barra de menús. El plugin pide a Textus que siga funcionando en segundo plano, así que está ahí aunque cierres todas las ventanas.
- La pestaña **Notas rápidas** de la barra lateral lista las notas, la más reciente arriba. Haz clic en **Nueva** para escribir una ahí, o edita una nota directamente en la lista.
- El menú de acciones de cada nota (su botón de más opciones, o clic derecho) tiene **Insertar** (en el cursor del documento), **Abrir** y **Eliminar**. Una nota guardada en un documento se abre ahí, en su línea.
- ¿Borraste una sin querer? **Deshacer**, abajo, la recupera durante unos segundos. Una nota nueva que se deja vacía desaparece sola.
- Con seis notas o más, aparece arriba un campo de búsqueda.

## Dónde se guardan

Las notas se guardan en un documento de la carpeta abierta, así que Obsidian y Cloud Sync las ven. Elige dónde en **Guardar notas en**, en los ajustes del plugin:

- **Archivo de bandeja de entrada** (por defecto): `Inbox.md` en la raíz de la carpeta, u otro documento indicado en **Archivo de bandeja de entrada**. Cada nota se añade al final como elemento de lista con su fecha y hora, por ejemplo `- 2026-11-08 14:05 Llamar a Ana`.
- **Nota diaria de hoy**: bajo un encabezado `## Notas rápidas` (en el idioma de la interfaz), que se crea si falta. Cada nota lleva su hora, por ejemplo `- 14:05 Llamar a Ana`. La carpeta, el nombre y la plantilla de la nota diaria siguen los ajustes de notas diarias de la carpeta, como los de Obsidian; sin ellos es `Daily/YYYY-MM-DD.md`.

Edita el archivo y la barra lateral lo sigue. Las notas de versiones anteriores pasan a él una sola vez, de la más antigua a la más reciente. Sin carpeta abierta, las notas se quedan dentro de Textus.

Funciona en escritorio.

## Permisos

- Leer y escribir archivos: para el archivo de bandeja de entrada o la nota diaria.
- Editar el documento: para insertar una nota en el cursor.
- Herramientas para Textus AI: para que Textus AI pueda añadir una nota rápida.

## Cambios

- **0.5.0** - Textus mismo rellena las fechas y la plantilla de la nota diaria, igual que en Calendario y notas diarias y en Plantillas. Requiere Textus 1.3.10.
- **0.4.0** - Las notas se guardan en un documento de la carpeta: `Inbox.md` o la nota diaria de hoy. Las de versiones anteriores pasan a él una vez.
- **0.3.1** - Textus AI distingue las notas rápidas del diario y de las tareas.
- **0.3.0** - Textus AI puede añadir una nota rápida (`add_note`).
- **0.2.0** - Controles propios de Textus y un menú de acciones para cada nota.
- **0.1.0-0.1.4** - Primeras versiones: el atajo y la bandeja, la lista lateral, insertar, abrir, borrar con Deshacer, búsqueda cuando hay muchas, fechas en una línea propia; solo escritorio.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `add_note`: Añade una nota rápida al principio de la lista de Notas rápidas de la barra lateral, para insertarla luego en un documento o abrirla como uno. El diario de hoy es append_to_daily_note; una tarea, add_task.
<!-- /ai-tools -->

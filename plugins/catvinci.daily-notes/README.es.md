# Calendario y notas diarias

Una nota para cada día y un calendario para llegar a cualquiera de ellas.

- **Ctrl+Alt+J** (**⌘⌥J** en Mac), o **Complementos › Abrir la nota de hoy**, abre la nota de hoy; la primera vez se crea sola.
- La pestaña **Calendario** de la barra lateral muestra el mes; los días con nota aparecen marcados. Haz clic en un día para abrirlo.
- Las notas se guardan en una carpeta dentro de la carpeta abierta. Su nombre y el texto con el que empieza un día nuevo se cambian en los ajustes del complemento; la semana empieza como en tu región.
- **Complementos › Abrir el día anterior** y **Abrir el día siguiente** pasan de la nota de un día a las vecinas.
- La plantilla admite {{weekday}}, {{yesterday}}, {{tomorrow}} y {{time}} además de {{date}}; por ejemplo, `[[{{yesterday}}]]` enlaza cada día con el anterior.
- El texto inicial también puede ser el nombre de una plantilla de la carpeta Templates (la del complemento Plantillas), como `Daily`. En una bóveda de Obsidian se siguen sus propios ajustes de notas diarias: carpeta, formato del nombre como `YYYY/MM/YYYY-MM-DD` y plantilla; Textus nunca los cambia. Una bóveda sin ajustes de notas diarias las guarda en su raíz, como Obsidian, y ahí `{{date}}`, `{{yesterday}}` y `{{tomorrow}}` se escriben en el formato del nombre de las notas, incluidos formatos de Moment como `MMMM Do, YYYY`.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `read_daily_note`: Lee la nota diaria de un día - la de hoy si no se da fecha - de la carpeta de notas diarias: su ruta, si existe y su texto.
- `append_to_daily_note`: Añade Markdown al final de la nota diaria de un día - la de hoy si no se da fecha -, creándola antes desde su plantilla si no existe. Una nota para guardar en la barra lateral es add_note; una tarea con fecha, add_task.
<!-- /ai-tools -->

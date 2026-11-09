# Calendario y notas diarias

Guarda una nota para cada día en una carpeta de la carpeta abierta, con un calendario en la barra lateral para llegar a cualquiera de ellas.

- Pulsa **Ctrl+Alt+J** (**⌘⌥J** en Mac) o elige **Complementos › Abrir la nota de hoy**. Se abre la nota de hoy; la primera vez se crea.
- **Complementos › Abrir el día anterior** y **Complementos › Abrir el día siguiente** pasan de la nota del día que tienes delante a la de al lado.
- La pestaña **Calendario** de la barra lateral muestra un mes y marca los días con nota. Haz clic en un día para abrir su nota, o en **Hoy** para abrir la de hoy. La semana empieza como en tu región.
- Una nota que ya existe nunca se sobrescribe.

## Ajustes

- **Carpeta de notas diarias**: una carpeta dentro de la carpeta abierta, `Daily` por defecto.
- **La nota de un día nuevo**: el texto con el que empieza una nota nueva, `# {{date}}` por defecto. Admite `{{date}}`, `{{weekday}}`, `{{yesterday}}` y `{{tomorrow}}` (para enlaces como `[[{{yesterday}}]]`), `{{time}}`, `{{title}}`, `{{date:FORMATO}}` y `{{date+1d}}`; `\n` empieza una línea nueva. También puede ser el nombre de una plantilla de la carpeta Templates, como `Daily`.
- **Notas semanales** y **Notas mensuales**: desactivadas por defecto. Al activarlas, **Complementos › Abrir la nota de esta semana** y **Abrir la nota de este mes** las abren, igual que los números de semana y el nombre del mes en el calendario. Cada una tiene su carpeta (`Weekly`, `Monthly`), su formato de nombre (`gggg-[W]ww` da `2026-W45`, `YYYY-MM` da `2026-11`) y su plantilla. Una plantilla semanal admite `{{monday:YYYY-MM-DD}}` … `{{sunday}}` para los días de la semana.

## Bóvedas de Obsidian

En una bóveda de Obsidian mandan sus propios ajustes de notas diarias: carpeta, formato del nombre (como `YYYY/MM/YYYY-MM-DD` o `MMMM Do, YYYY`) y plantilla. Textus nunca los cambia. Una bóveda sin esos ajustes guarda las notas en su raíz, como Obsidian. `{{date}}`, `{{yesterday}}` y `{{tomorrow}}` se escriben en el formato de nombre de las notas. En una bóveda con el complemento Periodic Notes, sus ajustes semanales y mensuales mandan.

## Permisos

El complemento lee y escribe archivos de la carpeta abierta para encontrar y crear las notas, y lee qué documento tienes delante para saber cuál es el día anterior y el siguiente. Además da a Textus AI las dos herramientas de abajo. Funciona en escritorio y en iPhone y necesita Textus 1.3.10 o posterior.

## Cambios

- **0.7.1** - Sus barras, listas y controles son ahora los de Textus, crecen con la interfaz y siguen cada tema; necesita Textus 1.3.12.
- **0.7.0** - Las fechas y plantillas las rellena el propio Textus, igual que en el complemento Plantillas; necesita Textus 1.3.10.
- **0.6.0** - Notas semanales y mensuales, con sus ajustes, los números de semana y el nombre del mes en el calendario, y los ajustes de Periodic Notes de una bóveda.
- **0.5.0** - Una bóveda sin ajustes de notas diarias las guarda en su raíz; `{{date}}`, `{{yesterday}}` y `{{tomorrow}}` siguen el formato de nombre, incluido `MMMM Do, YYYY`.
- **0.4.0** - Sigue los ajustes de notas diarias de una bóveda de Obsidian; el texto inicial puede nombrar una plantilla de la carpeta Templates; `{{date:FORMATO}}` y `{{title}}`.
- **0.3.0** - Textus AI puede leer la nota de un día y añadirle texto.
- **0.2.0** - El calendario usa los controles de Textus y sigue el idioma de la interfaz cuando cambia; necesita Textus 1.3.2.
- **0.1.3** - Colores y tipografía de Textus 1.3.
- **0.1.2** - La semana empieza como en tu región; la nota de un día nunca se sobrescribe.
- **0.1.0-0.1.1** - Primeras versiones: la nota de hoy con un atajo, el calendario, el día anterior y el siguiente, `{{weekday}}`, `{{yesterday}}`, `{{tomorrow}}` y `{{time}}` en la plantilla.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `read_daily_note`: Lee la nota diaria de un día - la de hoy si no se da fecha - de la carpeta de notas diarias: su ruta, si existe y su texto.
- `append_to_daily_note`: Añade Markdown al final de la nota diaria de un día - la de hoy si no se da fecha -, creándola antes desde su plantilla si no existe. Una nota para guardar en la barra lateral es add_note; una tarea con fecha, add_task.
<!-- /ai-tools -->

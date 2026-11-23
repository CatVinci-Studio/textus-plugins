# Calendario y notas diarias

Guarda una nota para cada día en una carpeta de la carpeta abierta, con un calendario en la barra lateral para llegar a cualquiera de ellas.

- Pulsa **Ctrl+Alt+J** (**⌘⌥J** en Mac) o elige **Complementos › Abrir la nota de hoy**. Se abre la nota de hoy; la primera vez se crea.
- **Complementos › Abrir el día anterior** y **Complementos › Abrir el día siguiente** pasan de la nota del día que tienes delante a la de al lado.
- La pestaña **Calendario** de la barra lateral muestra un mes y marca los días con nota. Haz clic en un día para abrir su nota, o en **Hoy** para abrir la de hoy. La semana empieza como en el idioma de Textus, igual que cuentan los números de semana.
- Una nota que ya existe nunca se sobrescribe.

## Ajustes

- **Carpeta de notas diarias**: una carpeta dentro de la carpeta abierta, `Daily` por defecto.
- **La nota de un día nuevo**: el texto con el que empieza una nota nueva, `# {{date}}` por defecto. Admite `{{date}}`, `{{weekday}}`, `{{yesterday}}` y `{{tomorrow}}` (para enlaces como `[[{{yesterday}}]]`), `{{time}}`, `{{title}}`, `{{date:FORMATO}}` y `{{date+1d}}`; `\n` empieza una línea nueva. También puede ser el nombre de una plantilla de la carpeta Templates, como `Daily`.
- **Notas semanales** y **Notas mensuales**: desactivadas por defecto. Al activarlas, **Complementos › Abrir la nota de esta semana** y **Abrir la nota de este mes** las abren, igual que los números de semana y el nombre del mes en el calendario. Cada una tiene su carpeta (`Weekly`, `Monthly`), su formato de nombre (`gggg-[W]ww` da `2026-W45`, `YYYY-MM` da `2026-11`) y su plantilla. Una plantilla semanal admite `{{monday:YYYY-MM-DD}}` … `{{sunday}}` para los días de la semana.

## Bóvedas de Obsidian

En una bóveda de Obsidian mandan sus propios ajustes de notas diarias: carpeta, formato del nombre (como `YYYY/MM/YYYY-MM-DD` o `MMMM Do, YYYY`) y plantilla. Textus nunca los cambia. Una bóveda sin esos ajustes guarda las notas en su raíz, como Obsidian. `{{date}}`, `{{yesterday}}` y `{{tomorrow}}` se escriben en el formato de nombre de las notas. En una bóveda con el complemento Periodic Notes, sus ajustes semanales y mensuales mandan.

## Permisos

El complemento lee y escribe archivos de la carpeta abierta para encontrar y crear las notas, y lee qué documento tienes delante para saber cuál es el día anterior y el siguiente. Además da a Textus AI las dos herramientas de abajo. Necesita Textus 1.4.3 o posterior.

## Cambios

- **0.7.9** - Its page no longer says which devices it runs on: the store shows that. It names the Textus it needs, 1.4.3.
- **0.7.8** - Where the bar is too narrow for even the short month name (a phone's sidebar), the month goes on a row of its own above the buttons instead of losing its year. The calendar writes dates with Textus's own, so the package is smaller.
- **0.7.7** - Weeks start as Textus's language has them, not the device's region, so they agree with the week numbers.
- **0.7.6** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.7.5** - The Calendar's month title starts at the left and ends in an ellipsis in a narrow sidebar, instead of being cut at both ends.
- **0.7.4** - In a narrow panel, such as on a phone, the calendar shows the month's short name instead of cutting the long one off.
- **0.7.3** - Impossible dates such as February 30 are refused, the calendar stays a comfortable width in wide panels and redraws when folder settings change, and weekly and monthly settings show only when those notes are on.
- **0.7.2** - Shorter help and empty-state text.
- **0.7.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.7.0** - Dates and templates are filled in by Textus itself, the same way as in the Templates plugin; needs Textus 1.3.10.
- **0.6.0** - Weekly and monthly notes, with their own settings, the calendar's week numbers and month name, and a vault's Periodic Notes settings.
- **0.5.0** - A vault without daily notes settings keeps its notes at its top; `{{date}}`, `{{yesterday}}` and `{{tomorrow}}` follow the notes' name format, `MMMM Do, YYYY` included.
- **0.4.0** - Follows an Obsidian vault's daily notes settings; the starting text can name a template in the Templates folder; `{{date:FORMAT}}` and `{{title}}`.
- **0.3.0** - Textus AI can read a day's note and add to it.
- **0.2.0** - The calendar uses Textus's own controls and follows the interface language when it changes; needs Textus 1.3.2.
- **0.1.3** - Textus 1.3's colors and type.
- **0.1.2** - Weeks start as your region has them; a day's note is never written over.
- **0.1.0-0.1.1** - First versions: today's note with a shortcut, the calendar, the day before and after, `{{weekday}}`, `{{yesterday}}`, `{{tomorrow}}` and `{{time}}` in the template.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `read_daily_note`: Lee la nota diaria de un día - la de hoy si no se da fecha - de la carpeta de notas diarias: su ruta, si existe y su texto.
- `append_to_daily_note`: Añade Markdown al final de la nota diaria de un día - la de hoy si no se da fecha -, creándola antes desde su plantilla si no existe. Una nota para guardar en la barra lateral es add_note; una tarea con fecha, add_task.
<!-- /ai-tools -->

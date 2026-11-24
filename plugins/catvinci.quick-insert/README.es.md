# Inserción rápida

Escribe `/` para encabezados, listas, tablas y otros bloques, `:` para un emoji y `@` para una fecha.

## El menú /

Escribe `/` al principio de una línea o después de un espacio y elige qué poner ahí: los bloques propios de Textus, los mismos del menú Formato:

- **Texto, Encabezado 1–3**, y **listas con viñetas, numeradas y de tareas**
- **Cita, Aviso, Bloque de código, Fórmula, Tabla, Separador**

Al elegir uno, la línea en la que estás se convierte en ese bloque. Otros plugins añaden sus propios bloques al menú (una base de datos, una tarjeta de enlace, un recordatorio, una plantilla).

Sigue escribiendo para acotar la lista: `/table`, `/tab`, en cualquier idioma, y los nombres en chino también por pinyin (`/biaoge`).

## Emoji

Escribe `:` y una palabra para un emoji: `:tada` da 🎉, `:+1` 👍, `:笑` 😄.

## Fechas

Escribe `@` y un día, y elige la fecha que nombra:

- English: `@today`, `@tomorrow`, `@yesterday`, `@friday`, `@next friday`, `@in 3 days`, `@next week`
- 中文: `@今天`、`@明天`、`@后天`、`@周五`、`@下周五`、`@星期三`、`@3天后`、`@下周` (o `@後天`、`@下週五`、`@禮拜三`、`@3天後`)
- 日本語: `@今日`、`@明日`、`@明後日`、`@金曜日`、`@来週金曜日`、`@3日後`

Las semanas empiezan el lunes, y un día de la semana solo es el próximo.

La fecha se escribe como `2026-11-06`. Pon **Insertar como** en los ajustes del plugin en **Un enlace a la nota del día** para escribir en su lugar un enlace a la nota diaria de ese día, como la carpeta escribe los enlaces: un enlace estándar como `[2026-11-06](Daily/2026-11-06.md)` o, en una bóveda de Obsidian o una carpeta cuyas notas usan enlaces wiki, `[[2026-11-06]]` con el nombre y la carpeta que dan sus ajustes de notas diarias, como `[[November 6th, 2026]]` o `[[Journal/2026/11/2026-11-06]]`. En una carpeta sin esos ajustes, las notas diarias se buscan en `Daily/`.

La lista se abre después de un espacio, al principio de una línea o después de un corchete; no en una dirección como `me@example.com` ni en una cita como `[@key]`. Después de `(` la `@` se queda, así que `(@tomorrow` se convierte en un recordatorio, `(@2026-11-06`.

Todo lo que inserta es Markdown normal.

## Permisos

- **Leer y editar el documento**: para insertar bloques, emojis y fechas.
- **Leer archivos**: para leer los ajustes de notas diarias de una bóveda para los enlaces a días.
- **Herramientas para Textus AI**: para que Textus AI pueda convertir un día dicho con palabras en su fecha.

## Cambios

- **0.5.1** - Its page is in every language Textus speaks. Needs Textus 1.4.4 itself, not a test version of it.
- **0.5.0** - The `/` menu lists Textus's own blocks, the Format menu's, so it always matches the app; Turn into… is gone from it, since picking a block turns the line you're on (the block handle's ⋮⋮ also has Turn Into). Needs Textus 1.4.4
- **0.4.3** - Dates in Traditional Chinese like 後天, 3天後 and 下週五 now work. A bare @ lists your app language's dates first, and day links are right relative to the note.
- **0.4.2** - Shares Two-way Links' fix for working out how a note links.
- **0.4.1** - a day's link is a standard link, [2026-11-08](Journal/2026-11-08.md), unless the folder or the note already uses [[wiki links]]
- **0.4.0** - day links are written the way the folder writes links, on Textus 1.3.10's dates; needs Textus 1.3.10
- **0.3.1** - carries the updated shared date code
- **0.3.0** - Natural Dates merged in: `@` dates in English, Chinese and Japanese, links to daily notes, and the `parse_date` tool for Textus AI
- **0.2.0** - **Today's date** leaves the `/` menu for `@today`
- **0.1.0-0.1.1** - first versions: the `/` menu, **Turn into…**, emoji after `:`

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `parse_date`: Convierte un día dicho con palabras - en inglés, chino o japonés, como los conoce el autocompletado @ del complemento (tomorrow, next wednesday, in 3 days, 下周五, 明後日) - en su fecha, YYYY-MM-DD, contada desde hoy. Las semanas empiezan el lunes; un día de la semana solo es el próximo.
<!-- /ai-tools -->

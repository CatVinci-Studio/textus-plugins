# Ordenar

Subraya el Markdown que rompe reglas comunes y lo corrige, y ordena líneas en blanco, espacios, puntuación y saltos de línea.

Funciona como el Linter de Obsidian, y cada cambio se deshace de una vez.

## Markdown

- Lo que rompe una regla común de Markdown se subraya; deja el puntero encima para ver qué regla y por qué.
- **Corregir Markdown** (clic derecho o el menú Plugins) corrige lo que se puede.
- Cada bloque se revisa por separado, así que las reglas sobre el documento entero (niveles de encabezado, la primera línea, líneas en blanco entre bloques) no se aplican.

## Texto

Cada orden actúa sobre la selección o, después de preguntar, sobre todo el documento. Están en el menú Plugins o en la paleta de órdenes.

- **Quitar líneas en blanco**: se quitan los párrafos vacíos; en una selección, todas las líneas en blanco.
- **Quitar espacios finales**: los espacios y tabuladores al final de las líneas; los dos espacios de un salto de línea se quedan.
- **Puntuación china en texto chino**: 你好,世界? pasa a 你好，世界？. Los decimales como 1.3.8 y las frases en inglés no cambian.
- **Puntuación inglesa en texto inglés**: Hello，world！ pasa a Hello, world!; los signos junto a texto chino no cambian.
- **Letras y dígitos de ancho completo a ASCII**: ＡＢＣ１２３ pasa a ABC123.
- **Unir líneas seleccionadas** (también con clic derecho): las líneas seleccionadas se vuelven una, sin espacio entre chino y con uno entre palabras.

## Ajustes

- **Subrayar el Markdown que rompe una regla**: desactívalo para no ver subrayados; Corregir Markdown sigue funcionando.
- **Reglas que no se aplican**: reglas de markdownlint, una por línea (MD009 o no-trailing-spaces), que ni se subrayan ni se corrigen.

## Lo que se queda como está

El código, las fórmulas, el front matter, los enlaces, las #etiquetas, los recordatorios (@…), los comentarios %%, el HTML y las definiciones de referencia ([d]: url) nunca se marcan ni se cambian, como tampoco lo que escribe Obsidian: los ids de bloque (^1a2b3c), los campos de Dataview (key:: value, [key:: value]), los ==resaltados== y los campos de Obsidian Tasks (📅 2026-11-07, 🔁 every week, 🆔 abc123). Al unir líneas, un campo sigue en su propia línea. Los paréntesis cambian en parejas: 价格(USD) pasa a 价格（USD）.

Espaciado CJK, el complemento que pone espacios entre texto chino y latino, también deja todo esto como está.

## Permisos

- Leer y editar el documento: para revisarlo y hacer las correcciones.
- Herramientas para Textus AI: para que Textus AI revise Markdown con las mismas reglas.

## Cambios

- **0.5.1** - Its package lists the libraries it carries, with their licenses.
- **0.5.0** - Each finding opens a card that names the rule and fixes that block (Alt+Enter), or sets it aside with Ignore (Textus 1.4.4).
- **0.4.1** - Remove Blank Lines and list switching leave a code block inside a longer fence (```` holding ```) alone.
- **0.4.0** - Switch selected lines to a bullet, numbered or task list (numbered counts from 1 at each level; a task keeps its tick).
- **0.3.2** - Shorter help and empty-state text.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - Renamed Tidy (was Markdown Lint): Text Tidy's six text commands moved in; settings to turn off underlines or single rules; Obsidian's own syntax left as written.
- **0.2.1** - Tags, links, reminders and reference definitions are never flagged: the same list CJK Spacing leaves alone.
- **0.2.0** - Textus AI can check Markdown (`lint_markdown`).
- **0.1.0-0.1.2** - First versions: underlines that explain the rule, and Fix Markdown; store page and icon; runs on desktop and iOS.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `lint_markdown`: Revisa Markdown - dado, o el documento al frente - con las reglas de markdownlint, como las subraya el editor: la línea, la regla, la descripción de cada problema y si se puede corregir; con fix, también el texto corregido. No cambia nada por sí mismo.
<!-- /ai-tools -->

# Ordenar

Ordena texto y Markdown en un solo lugar, como el Linter de Obsidian. Cada cambio se deshace de una vez.

## Markdown

- Lo que rompe una regla común de Markdown se subraya; deja el puntero encima para ver qué regla y por qué.
- **Corregir Markdown** (clic derecho o el menú Plugins) corrige lo que se puede.

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

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `lint_markdown`: Revisa Markdown - dado, o el documento al frente - con las reglas de markdownlint, como las subraya el editor: la línea, la regla, la descripción de cada problema y si se puede corregir; con fix, también el texto corregido. No cambia nada por sí mismo.
<!-- /ai-tools -->

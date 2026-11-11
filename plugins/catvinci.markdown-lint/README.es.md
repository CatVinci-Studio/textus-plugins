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

- **0.4.0** - Cambia las líneas seleccionadas a lista con viñetas, numerada o de tareas (numera desde 1 en cada nivel; una tarea conserva su marca).
- **0.3.2** - Textos de ayuda y de estado vacío más breves.
- **0.3.1** - Su página dice ahora en una frase qué hace, qué puede hacer y qué cambió en cada versión.
- **0.3.0** - Ahora se llama Ordenar (antes Revisión de Markdown): los seis comandos de texto de «Ordenar texto» pasan aquí; ajustes para quitar el subrayado o reglas sueltas; la sintaxis propia de Obsidian queda como está.
- **0.2.1** - Etiquetas, enlaces, recordatorios y definiciones de referencia nunca se marcan: la misma lista que respeta Espaciado CJK.
- **0.2.0** - Textus AI puede revisar Markdown (`lint_markdown`).
- **0.1.0-0.1.2** - Primeras versiones: subrayados que explican la regla y Corregir Markdown; página de la tienda e icono; funciona en escritorio e iOS.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `lint_markdown`: Revisa Markdown - dado, o el documento al frente - con las reglas de markdownlint, como las subraya el editor: la línea, la regla, la descripción de cada problema y si se puede corregir; con fix, también el texto corregido. No cambia nada por sí mismo.
<!-- /ai-tools -->

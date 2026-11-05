# Ordenar texto

Ordena el texto en un paso. Cada orden actúa sobre la selección, o sobre todo el documento si no hay nada seleccionado, y se deshace de una vez. Están en el menú Plugins o en la paleta de órdenes.

Sin nada seleccionado, pregunta antes de ordenar todo el documento.

- **Quitar líneas en blanco**: se quitan los párrafos vacíos; en una selección, todas las líneas en blanco.
- **Quitar espacios finales**: los espacios y tabuladores al final de las líneas; los dos espacios de un salto de línea se quedan.
- **Puntuación china en texto chino**: 你好,世界? pasa a 你好，世界？. Los decimales como 1.3.8 y las frases en inglés no cambian.
- **Puntuación inglesa en texto inglés**: Hello，world！ pasa a Hello, world!; los signos junto a texto chino no cambian.
- **Letras y dígitos de ancho completo a ASCII**: ＡＢＣ１２３ pasa a ABC123.
- **Unir líneas seleccionadas** (también con clic derecho): las líneas seleccionadas se vuelven una, sin espacio entre chino y con uno entre palabras.

El código, las fórmulas, las direcciones de enlace, el HTML y el front matter se quedan como están.

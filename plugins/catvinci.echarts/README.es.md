# ECharts

Dibuja un gráfico en tu documento a partir de una opción de ECharts escrita en un bloque de código.

Escribe un bloque de código con el lenguaje `echarts` y pon dentro una opción de ECharts. El gráfico se dibuja debajo del bloque; haz clic en el bloque para ver y editar de nuevo su código.

- La opción es JSON y se puede escribir de forma flexible: claves sin comillas, comillas simples, comas finales y comentarios funcionan. Las funciones (por ejemplo, una función `formatter`) no, porque nada del bloque se ejecuta.
- Se dibujan barras, líneas, sectores, dispersión, radar, indicadores, embudos, árboles, treemaps, sunbursts, diagramas de Sankey, mapas de calor, velas y las demás series de ECharts. Las series de mapa no: necesitan datos de mapa que un bloque no puede cargar.
- Escribe `height=400` después del lenguaje para fijar la altura del gráfico en píxeles (320 por defecto).
- El gráfico toma los colores de tu tema y se vuelve a dibujar al cambiar de tema.
- Si la opción no se puede dibujar, el bloque dice qué falló.
- Al exportar a HTML, PDF o Word, el gráfico va como imagen.

El plugin pide un solo permiso, para dar a Textus AI la herramienta `check_echarts` que aparece abajo: revisa un bloque antes de que Textus AI lo escriba en un documento.

## Ejemplo

```echarts
{
  xAxis: { type: "category", data: ["Mon", "Tue", "Wed"] },
  yAxis: { type: "value" },
  series: [{ type: "bar", data: [120, 200, 150] }]
}
```

## Cambios

- **0.3.6** - A simpler icon, drawn in the text colour.
- **0.3.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.3.4** - Its package lists the libraries it carries, with their licenses.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Charts redraw when the panel width changes, and their text and default height follow the app's zoom and font.
- **0.3.1** - Its description no longer lists maps, which a block can't load.
- **0.3.0** - Textus AI can check an `echarts` block before it writes one.
- **0.2.0** - Series colors come from the theme's tones. Needs Textus 1.3.2.
- **0.1.3** - Uses the theme's document text color and footnote size under their Textus 1.3 names.
- **0.1.0-0.1.2** - First versions: `echarts` code blocks drawn in the document, `height=`, and exports as a picture.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `check_echarts`: Revisa el código de un bloque ```echarts - una opción de ECharts en JSON: series con sus tipos, y los ejes o componentes donde se dibujan - antes de que entre en un documento, sin dibujarlo. Devuelve ok, o los problemas que hay que corregir antes. Pasa el código sin su valla.
<!-- /ai-tools -->

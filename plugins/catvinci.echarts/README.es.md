# ECharts

Dibuja un gráfico en tu documento a partir de una opción de ECharts escrita en un bloque de código.

Escribe un bloque de código con el lenguaje `echarts` y pon dentro una opción de ECharts. El gráfico se dibuja debajo del bloque; haz clic en el bloque para ver y editar de nuevo su código.

- La opción es JSON y se puede escribir de forma flexible: claves sin comillas, comillas simples, comas finales y comentarios funcionan. Las funciones (por ejemplo, una función `formatter`) no, porque nada del bloque se ejecuta.
- Se dibujan barras, líneas, sectores, dispersión, radar, indicadores, embudos, árboles, treemaps, sunbursts, diagramas de Sankey, mapas de calor, velas y las demás series de ECharts. Las series de mapa no: necesitan datos de mapa que un bloque no puede cargar.
- Escribe `height=400` después del lenguaje para fijar la altura del gráfico en píxeles (320 por defecto).
- El gráfico toma los colores de tu tema y se vuelve a dibujar al cambiar de tema.
- Si la opción no se puede dibujar, el bloque dice qué falló.
- Al exportar a HTML, PDF o Word, el gráfico va como imagen.

El plugin pide un solo permiso, para dar a Textus AI la herramienta `check_echarts` que aparece abajo: revisa un bloque antes de que Textus AI lo escriba en un documento. Funciona en el escritorio y en iPhone y iPad.

## Ejemplo

```echarts
{
  xAxis: { type: "category", data: ["Mon", "Tue", "Wed"] },
  yAxis: { type: "value" },
  series: [{ type: "bar", data: [120, 200, 150] }]
}
```

## Cambios

- **0.3.1** - Su descripción ya no menciona mapas, que un bloque no puede cargar.
- **0.3.0** - Textus AI puede revisar un bloque `echarts` antes de escribirlo.
- **0.2.0** - Los colores de las series salen de los tonos del tema. Requiere Textus 1.3.2.
- **0.1.3** - Usa el color del texto del documento y el tamaño de las notas al pie del tema con sus nombres de Textus 1.3.
- **0.1.0-0.1.2** - Primeras versiones: bloques `echarts` dibujados en el documento, `height=` y exportación como imagen.

<!-- ai-tools -->
## Herramientas para Textus AI

Con el plugin instalado, Textus AI puede usarlas en una conversación:

- `check_echarts`: Revisa el código de un bloque ```echarts - una opción de ECharts en JSON: series con sus tipos, y los ejes o componentes donde se dibujan - antes de que entre en un documento, sin dibujarlo. Devuelve ok, o los problemas que hay que corregir antes. Pasa el código sin su valla.
<!-- /ai-tools -->

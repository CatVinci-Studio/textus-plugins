# ECharts

Gráficos a partir de una opción de ECharts: barras, líneas, sectores y más.

- Escribe un bloque de código en `echarts`: se dibuja debajo, y su código vuelve a verse al hacer clic en él.
- `height=400` tras el lenguaje fija la altura del dibujo.
- Al exportar a HTML, PDF o Word, el dibujo va como imagen.

## Ejemplo

```echarts
{
  xAxis: { type: "category", data: ["Mon", "Tue", "Wed"] },
  yAxis: { type: "value" },
  series: [{ type: "bar", data: [120, 200, 150] }]
}
```

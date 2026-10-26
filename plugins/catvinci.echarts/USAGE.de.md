# ECharts

Diagramme aus einer ECharts-Option: Balken, Linien, Torten und mehr.

- Schreiben Sie einen Codeblock in `echarts`: Er wird darunter gezeichnet, und seine Quelle erscheint wieder, wenn Sie hineinklicken.
- `height=400` nach der Sprache legt die Höhe der Zeichnung fest.
- Beim Export nach HTML, PDF oder Word kommt die Zeichnung als Bild mit.

## Beispiel

```echarts
{
  xAxis: { type: "category", data: ["Mon", "Tue", "Wed"] },
  yAxis: { type: "value" },
  series: [{ type: "bar", data: [120, 200, 150] }]
}
```

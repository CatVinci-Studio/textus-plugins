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

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `check_echarts`: Prüft die Quelle eines ```echarts-Blocks - eine ECharts-Option als JSON: series mit ihren Typen und die Achsen oder Komponenten, auf denen sie liegen -, bevor er in ein Dokument kommt, ohne ihn zu zeichnen. Gibt ok zurück oder die Probleme, die zuerst zu beheben sind. Die Quelle ohne ihren Zaun übergeben.
<!-- /ai-tools -->

# ECharts

Charts from an ECharts option - bars, lines, pies, maps and more.

- Write a code block in `echarts`: it is drawn below, and its source shows again when you click into it.
- `height=400` after the language sets the drawing's height.
- An export - HTML, PDF, Word - carries the drawing as a picture.

## Example

```echarts
{
  xAxis: { type: "category", data: ["Mon", "Tue", "Wed"] },
  yAxis: { type: "value" },
  series: [{ type: "bar", data: [120, 200, 150] }]
}
```

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `check_echarts`: Checks the source of a ```echarts block - an ECharts option as JSON: series with their types, and the axes or components they are drawn on - before it goes into a document, without drawing it. Returns ok, or the problems to fix first. Pass the source without its fence.
<!-- /ai-tools -->

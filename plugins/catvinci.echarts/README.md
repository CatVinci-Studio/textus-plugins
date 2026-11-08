# ECharts

Draw a chart in your document from an ECharts option written in a code block.

Write a code block with the language `echarts` and put an ECharts option in it. The chart is drawn below the block; click into the block to see and edit its source again.

- The option is JSON, and it can be written loosely: keys without quotes, single quotes, trailing commas and comments all work. Functions (a `formatter` function, for example) don't, because nothing in the block is run.
- Bars, lines, pies, scatter plots, radar charts, gauges, funnels, trees, treemaps, sunbursts, Sankey diagrams, heatmaps, candlesticks and the other ECharts series are drawn. Map series aren't: they need map data that a block can't load.
- Write `height=400` after the language to set the chart's height in pixels (320 by default).
- The chart takes its colors from your theme and is drawn again when you switch themes.
- If the option can't be drawn, the block says what went wrong.
- An export to HTML, PDF or Word carries the chart as a picture.

The plugin asks for one permission, to give Textus AI the `check_echarts` tool listed below: it checks a block before Textus AI writes it into a document. It works on the desktop and on iPhone and iPad.

## Example

```echarts
{
  xAxis: { type: "category", data: ["Mon", "Tue", "Wed"] },
  yAxis: { type: "value" },
  series: [{ type: "bar", data: [120, 200, 150] }]
}
```

## Changes

- **0.3.1** - Its description no longer lists maps, which a block can't load.
- **0.3.0** - Textus AI can check an `echarts` block before it writes one.
- **0.2.0** - Series colors come from the theme's tones. Needs Textus 1.3.2.
- **0.1.3** - Uses the theme's document text color and footnote size under their Textus 1.3 names.
- **0.1.0-0.1.2** - First versions: `echarts` code blocks drawn in the document, `height=`, and exports as a picture.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `check_echarts`: Checks the source of a ```echarts block - an ECharts option as JSON: series with their types, and the axes or components they are drawn on - before it goes into a document, without drawing it. Returns ok, or the problems to fix first. Pass the source without its fence.
<!-- /ai-tools -->

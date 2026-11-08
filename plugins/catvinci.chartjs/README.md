# Chart.js

Draws a line, bar, pie or other simple chart from a Chart.js configuration in a code block.

Write a code block with the language `chartjs` that holds one Chart.js 4 configuration: `type`, `data` with `labels` and `datasets`, and optional `options`. The chart is drawn right below it, and clicking into the block shows the source again so you can edit it.

- Chart types: `line`, `bar`, `pie`, `doughnut`, `polarArea`, `radar`, `scatter` and `bubble`.
- The configuration is JSON, but hand-written forms work too: unquoted keys, single quotes, trailing commas and comments. Functions are not run.
- Series without colors of their own take the theme's colors in order, and the chart is drawn again when you switch between light and dark.
- Write `height=400` after `chartjs` on the opening line to set the height in pixels (300 by default).
- If the configuration has a mistake, a line under the block says what is wrong.
- Exports to HTML, PDF and Word carry the chart as a picture.

It works on desktop and iPhone and needs Textus 1.3.2 or later. It asks for one permission, Textus AI tools, so that Textus AI can check a `chartjs` block before writing it into a document.

## Example

```chartjs
{
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [{ label: "Words", data: [1200, 1900, 3000] }]
  }
}
```

## Changes

- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - Textus AI can check a `chartjs` block before writing it (`check_chartjs`).
- **0.2.0** - Series take the theme's colors; needs Textus 1.3.2.
- **0.1.3** - Uses Textus's renamed document colors.
- **0.1.2** - While you type, the chart always shows the latest text.
- **0.1.0-0.1.1** - First versions: `chartjs` blocks drawn under their source, `height=`, pictures in exports; store page and icon.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `check_chartjs`: Checks the source of a ```chartjs block - a Chart.js 4 configuration as JSON: type, data with labels and datasets, options - before it goes into a document, without drawing it. Returns ok, or the problems to fix first. Pass the source without its fence.
<!-- /ai-tools -->

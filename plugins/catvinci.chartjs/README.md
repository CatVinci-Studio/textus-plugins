# Chart.js

Simple charts from a Chart.js configuration.

- Write a code block in `chartjs`: it is drawn below, and its source shows again when you click into it.
- `height=400` after the language sets the drawing's height.
- An export - HTML, PDF, Word - carries the drawing as a picture.

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

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `check_chartjs`: Checks the source of a ```chartjs block - a Chart.js 4 configuration as JSON: type, data with labels and datasets, options - before it goes into a document, without drawing it. Returns ok, or the problems to fix first. Pass the source without its fence.
<!-- /ai-tools -->

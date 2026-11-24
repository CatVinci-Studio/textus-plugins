# Chart.js

用代码块里的 Chart.js 配置画折线图、柱状图、饼图等简单图表。

写一个语言为 `chartjs` 的代码块，里面放一份 Chart.js 4 配置：`type`、带 `labels` 和 `datasets` 的 `data`，以及可选的 `options`。图表会直接画在它下方；点进代码块可以再看到源码并修改。

- 图表类型：`line`、`bar`、`pie`、`doughnut`、`polarArea`、`radar`、`scatter` 和 `bubble`。
- 配置用 JSON 写，手写时的常见写法也能识别：不加引号的键、单引号、末尾逗号和注释。不会执行函数。
- 没有自带颜色的数据系列按顺序使用主题的颜色；切换浅色和深色时会重新绘制。
- 在开头一行的 `chartjs` 后面写 `height=400`，可以设置高度（像素，默认 300）。
- 配置写错时，代码块下方会有一行说明错在哪里。
- 导出 HTML、PDF、Word 时，图表会作为图片放进去。

需要 Textus 1.3.2 或更新版本。插件只申请一项权限：Textus AI 工具，让 Textus AI 在把 `chartjs` 代码块写进文档前先检查它。

## 示例

```chartjs
{
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [{ label: "Words", data: [1200, 1900, 3000] }]
  }
}
```

## 更新日志

- **0.3.6** - Its icon is Chart.js's own logo.
- **0.3.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.3.4** - Its package lists the libraries it carries, with their licenses.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Charts redraw to fit a narrower or wider panel, labels follow the theme's font and text size, and the error line is red again.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - Textus AI can check a `chartjs` block before writing it (`check_chartjs`).
- **0.2.0** - Series take the theme's colors; needs Textus 1.3.2.
- **0.1.3** - Uses Textus's renamed document colors.
- **0.1.2** - While you type, the chart always shows the latest text.
- **0.1.0-0.1.1** - First versions: `chartjs` blocks drawn under their source, `height=`, pictures in exports; store page and icon.

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `check_chartjs`：在把 ```chartjs 块写进文档之前检查它的源码（JSON 格式的 Chart.js 4 配置：type、带 labels 和 datasets 的 data、options），不实际绘制。返回 ok，或需要先修正的问题。传入时不带代码围栏。
<!-- /ai-tools -->

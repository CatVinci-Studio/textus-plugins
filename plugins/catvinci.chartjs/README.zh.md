# Chart.js

用代码块里的 Chart.js 配置画折线图、柱状图、饼图等简单图表。

写一个语言为 `chartjs` 的代码块，里面放一份 Chart.js 4 配置：`type`、带 `labels` 和 `datasets` 的 `data`，以及可选的 `options`。图表会直接画在它下方；点进代码块可以再看到源码并修改。

- 图表类型：`line`、`bar`、`pie`、`doughnut`、`polarArea`、`radar`、`scatter` 和 `bubble`。
- 配置用 JSON 写，手写时的常见写法也能识别：不加引号的键、单引号、末尾逗号和注释。不会执行函数。
- 没有自带颜色的数据系列按顺序使用主题的颜色；切换浅色和深色时会重新绘制。
- 在开头一行的 `chartjs` 后面写 `height=400`，可以设置高度（像素，默认 300）。
- 配置写错时，代码块下方会有一行说明错在哪里。
- 导出 HTML、PDF、Word 时，图表会作为图片放进去。

支持桌面版和 iPhone，需要 Textus 1.3.2 或更新版本。插件只申请一项权限：Textus AI 工具，让 Textus AI 在把 `chartjs` 代码块写进文档前先检查它。

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

- **0.3.1** - 介绍页重写：一句话说明它做什么，再讲它能做的事，并列出每个版本的更新。
- **0.3.0** - Textus AI 可以在写入 `chartjs` 代码块之前先检查它（`check_chartjs`）。
- **0.2.0** - 数据系列使用主题的颜色；需要 Textus 1.3.2。
- **0.1.3** - 改用 Textus 新命名的文档颜色。
- **0.1.2** - 输入时图表总是显示最新的内容。
- **0.1.0-0.1.1** - 最早的版本：`chartjs` 代码块画在源码下方，支持 `height=`，导出时作为图片；商店页面和图标。

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `check_chartjs`：在把 ```chartjs 块写进文档之前检查它的源码（JSON 格式的 Chart.js 4 配置：type、带 labels 和 datasets 的 data、options），不实际绘制。返回 ok，或需要先修正的问题。传入时不带代码围栏。
<!-- /ai-tools -->

# Chart.js

用 Chart.js 配置画简单的图表。

- 写一个 `chartjs` 代码块，下方就会画出来；点进代码块可以再看到并修改源码。
- 在语言后面写 `height=400` 可以设置图的高度。
- 导出 HTML、PDF、Word 时，图会作为图片放进去。

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

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `check_chartjs`：在把 ```chartjs 块写进文档之前检查它的源码（JSON 格式的 Chart.js 4 配置：type、带 labels 和 datasets 的 data、options），不实际绘制。返回 ok，或需要先修正的问题。传入时不带代码围栏。
<!-- /ai-tools -->

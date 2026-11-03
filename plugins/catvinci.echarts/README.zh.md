# ECharts

用 ECharts 配置画图：柱状图、折线图、饼图等。

- 写一个 `echarts` 代码块，下方就会画出来；点进代码块可以再看到并修改源码。
- 在语言后面写 `height=400` 可以设置图的高度。
- 导出 HTML、PDF、Word 时，图会作为图片放进去。

## 示例

```echarts
{
  xAxis: { type: "category", data: ["Mon", "Tue", "Wed"] },
  yAxis: { type: "value" },
  series: [{ type: "bar", data: [120, 200, 150] }]
}
```

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `check_echarts`：在把 ```echarts 块写进文档之前检查它的源码（JSON 格式的 ECharts option：带类型的 series，以及它们所在的坐标轴或组件），不实际绘制。返回 ok，或需要先修正的问题。传入时不带代码围栏。
<!-- /ai-tools -->

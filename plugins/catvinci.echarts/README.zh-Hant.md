# ECharts

用 ECharts 設定畫圖：長條圖、折線圖、圓餅圖等。

- 寫一個 `echarts` 程式碼區塊，下方就會畫出來；點進區塊可以再看到並修改原始碼。
- 在語言後面寫 `height=400` 可以設定圖的高度。
- 匯出 HTML、PDF、Word 時，圖會以圖片放進去。

## 範例

```echarts
{
  xAxis: { type: "category", data: ["Mon", "Tue", "Wed"] },
  yAxis: { type: "value" },
  series: [{ type: "bar", data: [120, 200, 150] }]
}
```

# Chart.js

用 Chart.js 設定畫簡單的圖表。

- 寫一個 `chartjs` 程式碼區塊，下方就會畫出來；點進區塊可以再看到並修改原始碼。
- 在語言後面寫 `height=400` 可以設定圖的高度。
- 匯出 HTML、PDF、Word 時，圖會以圖片放進去。

## 範例

```chartjs
{
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [{ label: "Words", data: [1200, 1900, 3000] }]
  }
}
```

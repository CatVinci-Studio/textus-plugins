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

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `check_chartjs`：在把 ```chartjs 區塊寫進文件之前檢查它的原始碼（JSON 格式的 Chart.js 4 設定：type、附 labels 和 datasets 的 data、options），不實際繪製。回傳 ok，或需要先修正的問題。傳入時不帶程式碼圍欄。
<!-- /ai-tools -->

# Chart.js

用程式碼區塊裡的 Chart.js 設定畫出折線圖、長條圖、圓餅圖等簡單圖表。

寫一個語言為 `chartjs` 的程式碼區塊，裡面放一份 Chart.js 4 設定：`type`、含 `labels` 與 `datasets` 的 `data`，以及選用的 `options`。圖表會直接畫在它下方；點進區塊就能再看到原始碼並修改。

- 圖表類型：`line`、`bar`、`pie`、`doughnut`、`polarArea`、`radar`、`scatter` 與 `bubble`。
- 設定以 JSON 撰寫，手寫常見的寫法也看得懂：不加引號的鍵、單引號、結尾逗號和註解。不會執行函式。
- 沒有自訂顏色的資料系列會依序套用佈景主題的顏色；切換淺色與深色時會重新繪製。
- 在開頭那一行的 `chartjs` 後面寫 `height=400`，可以設定高度（像素，預設 300）。
- 設定有錯時，區塊下方會有一行說明錯在哪裡。
- 匯出 HTML、PDF、Word 時，圖表會以圖片放入。

支援桌面版與 iPhone，需要 Textus 1.3.2 以上版本。外掛只要求一項權限：Textus AI 工具，讓 Textus AI 在把 `chartjs` 區塊寫進文件前先檢查。

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

## 更新紀錄

- **0.3.1** - 介紹頁重寫：一句話說明它做什麼，再講它能做的事，並列出每個版本的更新。
- **0.3.0** - Textus AI 可以在寫入 `chartjs` 區塊前先檢查它（`check_chartjs`）。
- **0.2.0** - 資料系列採用佈景主題的顏色；需要 Textus 1.3.2。
- **0.1.3** - 改用 Textus 重新命名後的文件顏色。
- **0.1.2** - 輸入時圖表一律顯示最新的內容。
- **0.1.0-0.1.1** - 最初的版本：`chartjs` 區塊畫在原始碼下方、支援 `height=`、匯出時轉為圖片；商店頁面與圖示。

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `check_chartjs`：在把 ```chartjs 區塊寫進文件之前檢查它的原始碼（JSON 格式的 Chart.js 4 設定：type、附 labels 和 datasets 的 data、options），不實際繪製。回傳 ok，或需要先修正的問題。傳入時不帶程式碼圍欄。
<!-- /ai-tools -->

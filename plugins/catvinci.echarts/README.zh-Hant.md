# ECharts

在程式碼區塊裡寫一段 ECharts 設定，文件中就會畫出對應的圖表。

寫一個語言為 `echarts` 的程式碼區塊，在裡面放 ECharts 的 option 設定，區塊下方就會畫出圖表；點進區塊可以再次檢視和修改原始碼。

- 設定用 JSON 寫，也可以寫得隨興一點：鍵名不加引號、用單引號、結尾多逗號、寫註解都可以。函式（例如 `formatter` 函式）不行，因為區塊裡的內容不會被執行。
- 長條圖、折線圖、圓餅圖、散佈圖、雷達圖、儀表板、漏斗圖、樹狀圖、矩形樹狀圖、旭日圖、桑基圖、熱度圖、K 線圖等 ECharts 系列都能畫。地圖系列不行：它需要地圖資料，區塊無法載入。
- 在語言後面寫 `height=400` 可以設定圖表高度（單位為像素，預設 320）。
- 圖表顏色跟著佈景主題，切換主題時會重新繪製。
- 設定畫不出來時，區塊裡會說明哪裡出了問題。
- 匯出 HTML、PDF、Word 時，圖表會以圖片放進去。

外掛只要求一項權限：為 Textus AI 提供下方列出的 `check_echarts` 工具，讓它把區塊寫進文件前先檢查一遍。

## 範例

```echarts
{
  xAxis: { type: "category", data: ["Mon", "Tue", "Wed"] },
  yAxis: { type: "value" },
  series: [{ type: "bar", data: [120, 200, 150] }]
}
```

## 更新紀錄

- **0.3.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.3.4** - Its package lists the libraries it carries, with their licenses.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Charts redraw when the panel width changes, and their text and default height follow the app's zoom and font.
- **0.3.1** - Its description no longer lists maps, which a block can't load.
- **0.3.0** - Textus AI can check an `echarts` block before it writes one.
- **0.2.0** - Series colors come from the theme's tones. Needs Textus 1.3.2.
- **0.1.3** - Uses the theme's document text color and footnote size under their Textus 1.3 names.
- **0.1.0-0.1.2** - First versions: `echarts` code blocks drawn in the document, `height=`, and exports as a picture.

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `check_echarts`：在把 ```echarts 區塊寫進文件之前檢查它的原始碼（JSON 格式的 ECharts option：附類型的 series，以及它們所在的座標軸或元件），不實際繪製。回傳 ok，或需要先修正的問題。傳入時不帶程式碼圍欄。
<!-- /ai-tools -->

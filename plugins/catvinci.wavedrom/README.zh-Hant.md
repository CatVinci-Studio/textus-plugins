# WaveDrom

用 WaveJSON 畫數位時序圖和暫存器欄位圖。

## 畫一張圖

- 寫一個 `wavedrom` 程式碼區塊，裡面寫 WaveJSON。圖會畫在區塊下方；點進區塊可以再看到並修改原始碼。
- `signal` 裡是各條訊號：每條有 `name`、`wave` 波形字串（`p n h l 0 1 x z . |`，以及代表數值的 `= 2-9`）和數值標籤 `data`。以標籤開頭的清單會把幾條訊號分成一組；`{}` 留一行空白。
- 寫 `reg` 則畫暫存器的欄位：`{ reg: [{ bits: 8, name: "data" }] }`。
- 手寫的 JSON 也讀得懂：鍵不加引號、單引號、結尾多餘的逗號和 `//` 註解都可以。
- 原始碼有錯時，區塊下方會說明問題。
- 在語言後面寫 `height=400` 可以設定圖的高度。
- 深色主題下使用 WaveDrom 的深色外觀。匯出 HTML、PDF、Word 時，圖會依匯出的配色重畫，以圖片放進去。

## 範例

```wavedrom
{ signal: [
  { name: "clk",  wave: "p....." },
  { name: "data", wave: "x.345x", data: ["a", "b", "c"] }
]}
```

## 權限

只需要 **Textus AI 工具** 權限，讓 Textus AI 在寫入區塊前先檢查一次。WaveDrom 隨外掛一起安裝：它不讀取任何檔案，全部在本機繪製，桌面版和 iOS 都能使用。

## 更新紀錄

- **0.3.6** - Its page no longer says which devices it runs on: the store shows that.
- **0.3.5** - Its package lists the libraries it carries, with their licenses.
- **0.3.4** - A very long diagram shrinks only as far as its labels stay readable, then scrolls sideways (a phone).
- **0.3.3** - Readable in dark mode: the lines and text take the theme's colours on the page's own background; a diagram drawn while its block was folded fits once it opens. A long diagram shrinks to the column instead of being cut off.
- **0.3.2** - Diagrams take the theme's font and line colour, grow with the document's zoom, and `height=` now resizes the diagram itself.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - a tool for Textus AI, `check_wavedrom`
- **0.2.0** - drawn again when the theme changes, with the chart page of Textus 1.3.2
- **0.1.3** - text in the theme's colors on Textus 1.3
- **0.1.2** - exports carry the diagram in the export's colors
- **0.1.0-0.1.1** - first versions: WaveJSON drawn with WaveDrom, dark skin, a height setting, pictures in exports

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `check_wavedrom`：在把 ```wavedrom 區塊寫進文件之前檢查它的原始碼（WaveJSON：附 wave 字串和 data 的訊號通道，或暫存器的各個欄位），不實際繪製。回傳 ok，或需要先修正的問題。傳入時不帶程式碼圍欄。
<!-- /ai-tools -->

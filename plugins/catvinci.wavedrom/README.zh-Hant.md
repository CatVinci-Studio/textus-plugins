# WaveDrom

用 WaveJSON 畫數位時序圖。

- 寫一個 `wavedrom` 程式碼區塊，下方就會畫出來；點進區塊可以再看到並修改原始碼。
- 在語言後面寫 `height=400` 可以設定圖的高度。
- 匯出 HTML、PDF、Word 時，圖會以圖片放進去。

## 範例

```wavedrom
{ signal: [
  { name: "clk",  wave: "p....." },
  { name: "data", wave: "x.345x", data: ["a", "b", "c"] }
]}
```

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `check_wavedrom`：在把 ```wavedrom 區塊寫進文件之前檢查它的原始碼（WaveJSON：附 wave 字串和 data 的訊號通道，或暫存器的各個欄位），不實際繪製。回傳 ok，或需要先修正的問題。傳入時不帶程式碼圍欄。
<!-- /ai-tools -->

# 函數圖形

畫出 x 的函數圖形，每行一個，例如 sin(x) 或 x^2 - 1。

## 畫一張圖

- 寫一個 `function-plot` 程式碼區塊，每行一個函數。圖會畫在區塊下方；點進區塊可以再看到並修改原始碼。
- 每行可以用 `y =` 開頭。`2x`、`3sin(x)` 代表相乘。
- 支援 + - * / ^、括號、x、pi（π）、e，以及 sin、cos、tan、asin、acos、atan、sinh、cosh、tanh、exp、ln、log（以 10 為底）、sqrt、abs、floor、ceil。
- x 預設從 -10 到 10。在語言後寫 `xmin=-5 xmax=5` 可以修改；`ymin`、`ymax` 固定 y 的範圍，不寫時依曲線自動調整。
- 在語言後寫 `height=400` 可以設定圖的高度。
- 有一行無法解讀時，區塊下方會說明哪裡有問題。
- 每條曲線使用佈景主題的顏色，切換主題時圖會重新繪製。
- 匯出 HTML、PDF、Word 時，圖會以圖片放進去。

## 範例

```function-plot xmin=-5 xmax=5
sin(x)
x^2 / 4 - 1
```

## 權限

只需要 **Textus AI 工具** 權限，讓 Textus AI 在寫入區塊前先檢查一次。它不讀取任何檔案，全部在本機繪製，桌面版和 iOS 都能使用。

## 更新紀錄

- **0.3.4** - Its page no longer says which devices it runs on: the store shows that.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Steep curves like tan(x) keep their shape and break at asymptotes; a function with nothing to draw says so; π and 2xsin(x) are read; Textus AI's check uses the fence's x range.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - a tool for Textus AI, `check_function_plot`
- **0.2.0** - curves and axes in the theme's colors, drawn again when the theme changes
- **0.1.3** - text in the theme's colors on Textus 1.3
- **0.1.2** - -x^2 reads as -(x^2), and a range that ends at 0 is kept
- **0.1.0-0.1.1** - first versions: functions of x drawn as a picture, height and range settings, pictures in exports

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `check_function_plot`：在把 ```function-plot 區塊寫進文件之前檢查它的原始碼（關於 x 的函數，每行一個，可用 + - * / ^、括號、pi、e 和常用函數），不實際繪製。回傳 ok，或需要先修正的問題。傳入時不帶程式碼圍欄，圍欄上的參數（xmin=0 xmax=100）放在 meta 裡。
<!-- /ai-tools -->

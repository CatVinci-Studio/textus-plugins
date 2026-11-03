# 函數圖形

畫函數圖形，每行一個：sin(x)、x^2 - 1。

- 寫一個 `function-plot` 程式碼區塊，下方就會畫出來；點進區塊可以再看到並修改原始碼。
- 在語言後面寫 `height=400` 可以設定圖的高度。
- 匯出 HTML、PDF、Word 時，圖會以圖片放進去。
- 在語言後寫 `xmin=-5 xmax=5`（以及 `ymin`、`ymax`）設定範圍；支援 + - * / ^、x、pi、e，以及 sin、cos、tan、exp、ln、log、sqrt、abs。

## 範例

```function-plot
sin(x)
x^2 / 4 - 1
```

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `check_function_plot`：在把 ```function-plot 區塊寫進文件之前檢查它的原始碼（關於 x 的函數，每行一個，可用 + - * / ^、括號、pi、e 和常用函數），不實際繪製。回傳 ok，或需要先修正的問題。傳入時不帶程式碼圍欄。
<!-- /ai-tools -->

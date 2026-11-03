# 関数グラフ

関数のグラフを 1 行に 1 つ：sin(x)、x^2 - 1。

- `function-plot` のコードブロックを書くと、その下に描かれます。ブロックをクリックするとソースが表示され、編集できます。
- 言語名の後に `height=400` と書くと高さを指定できます。
- HTML・PDF・Word に書き出すと、図は画像として入ります。
- 言語名の後に `xmin=-5 xmax=5`（と `ymin`・`ymax`）で範囲を指定できます。+ - * / ^、x、pi、e と sin・cos・tan・exp・ln・log・sqrt・abs が使えます。

## 例

```function-plot
sin(x)
x^2 / 4 - 1
```

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `check_function_plot`：```function-plot ブロックのソース（x の関数を一行に一つ。+ - * / ^、括弧、pi、e とよく使う関数が使えます）を、文書に入れる前に描画せずに検査します。ok か、先に直すべき問題を返します。フェンスを除いたソースを渡してください。
<!-- /ai-tools -->

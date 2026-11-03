# Chart.js

Chart.js の設定からシンプルなグラフを描きます。

- `chartjs` のコードブロックを書くと、その下に描かれます。ブロックをクリックするとソースが表示され、編集できます。
- 言語名の後に `height=400` と書くと高さを指定できます。
- HTML・PDF・Word に書き出すと、図は画像として入ります。

## 例

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
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `check_chartjs`：```chartjs ブロックのソース（JSON で書いた Chart.js 4 の設定。type、labels と datasets を持つ data、options）を、文書に入れる前に描画せずに検査します。ok か、先に直すべき問題を返します。フェンスを除いたソースを渡してください。
<!-- /ai-tools -->

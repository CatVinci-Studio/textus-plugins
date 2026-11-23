# Chart.js

コードブロックに書いた Chart.js の設定から、折れ線・棒・円などのシンプルなグラフを描きます。

言語を `chartjs` にしたコードブロックに、Chart.js 4 の設定を一つ書きます。`type`、`labels` と `datasets` を持つ `data`、必要なら `options` です。グラフはそのすぐ下に描かれ、ブロックをクリックするとソースがもう一度表示されて編集できます。

- グラフの種類：`line`、`bar`、`pie`、`doughnut`、`polarArea`、`radar`、`scatter`、`bubble`。
- 設定は JSON ですが、手書きによくある形も読めます。引用符のないキー、シングルクォート、末尾のカンマ、コメントです。関数は実行しません。
- 色を指定していない系列にはテーマの色が順に使われ、ライトとダークを切り替えると描き直されます。
- 最初の行の `chartjs` の後に `height=400` と書くと、高さをピクセルで指定できます（既定は 300）。
- 設定に誤りがあると、ブロックの下に何が違うかを示す一行が出ます。
- HTML・PDF・Word に書き出すと、グラフは画像として入ります。

デスクトップと iPhone で使え、Textus 1.3.2 以降が必要です。求める権限は「Textus AI ツール」の一つだけで、Textus AI が `chartjs` ブロックを文書に書く前に検査するためのものです。

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

## 更新履歴

- **0.3.4** - Its package lists the libraries it carries, with their licenses.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Charts redraw to fit a narrower or wider panel, labels follow the theme's font and text size, and the error line is red again.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - Textus AI can check a `chartjs` block before writing it (`check_chartjs`).
- **0.2.0** - Series take the theme's colors; needs Textus 1.3.2.
- **0.1.3** - Uses Textus's renamed document colors.
- **0.1.2** - While you type, the chart always shows the latest text.
- **0.1.0-0.1.1** - First versions: `chartjs` blocks drawn under their source, `height=`, pictures in exports; store page and icon.

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `check_chartjs`：```chartjs ブロックのソース（JSON で書いた Chart.js 4 の設定。type、labels と datasets を持つ data、options）を、文書に入れる前に描画せずに検査します。ok か、先に直すべき問題を返します。フェンスを除いたソースを渡してください。
<!-- /ai-tools -->

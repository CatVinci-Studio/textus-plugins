# ECharts

コードブロックに書いた ECharts のオプションから、文書の中にグラフを描きます。

言語を `echarts` にしたコードブロックに ECharts のオプションを書くと、ブロックの下にグラフが描かれます。ブロックをクリックすると、ソースをもう一度表示して編集できます。

- オプションは JSON で書きます。キーを引用符で囲まない、シングルクォート、末尾のカンマ、コメントといったゆるい書き方も使えます。関数（`formatter` 関数など）は使えません。ブロックの中身は実行されないためです。
- 棒、折れ線、円、散布図、レーダー、ゲージ、ファネル、ツリー、ツリーマップ、サンバースト、サンキー、ヒートマップ、ローソク足など、ECharts の系列を描けます。地図の系列は描けません。ブロックからは地図データを読み込めないためです。
- 言語の後に `height=400` と書くと、グラフの高さをピクセルで指定できます（既定は 320）。
- グラフの色はテーマに合わせ、テーマを切り替えると描き直します。
- オプションを描けないときは、何が問題かをブロックに表示します。
- HTML・PDF・Word に書き出すと、グラフは画像として入ります。

このプラグインが求める権限は一つだけです。下に挙げた `check_echarts` ツールを Textus AI に渡し、文書にブロックを書く前に確認できるようにするためです。

## 例

```echarts
{
  xAxis: { type: "category", data: ["Mon", "Tue", "Wed"] },
  yAxis: { type: "value" },
  series: [{ type: "bar", data: [120, 200, 150] }]
}
```

## 更新履歴

- **0.3.6** - A simpler icon, drawn in the text colour.
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
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `check_echarts`：```echarts ブロックのソース（JSON で書いた ECharts の option。種類付きの series と、それを描く軸やコンポーネント）を、文書に入れる前に描画せずに検査します。ok か、先に直すべき問題を返します。フェンスを除いたソースを渡してください。
<!-- /ai-tools -->

# WaveDrom

WaveJSON からデジタルタイミング図とレジスタのフィールド図を描きます。

## 図を描く

- `wavedrom` のコードブロックに WaveJSON を書きます。図はその下に描かれ、ブロックをクリックするとソースが表示され、編集できます。
- `signal` に信号を並べます。それぞれに `name`、`wave` の文字列（`p n h l 0 1 x z . |` と、値を表す `= 2-9`）、値のラベル `data` を書きます。ラベルで始まるリストは信号をグループにまとめ、`{}` は空き行になります。
- `reg` を書くとレジスタのフィールドを描きます：`{ reg: [{ bits: 8, name: "data" }] }`。
- 手書きの JSON でもかまいません。引用符のないキー、単引用符、末尾のカンマ、`//` コメントも読みます。
- ソースに誤りがあると、ブロックの下に表示します。
- 言語名の後に `height=400` と書くと高さを指定できます。
- ダークテーマでは WaveDrom のダークスキンを使います。HTML・PDF・Word に書き出すと、書き出し先の配色で描き直した画像が入ります。

## 例

```wavedrom
{ signal: [
  { name: "clk",  wave: "p....." },
  { name: "data", wave: "x.345x", data: ["a", "b", "c"] }
]}
```

## 権限

求めるのは **Textus AI のツール** だけで、Textus AI がブロックを書く前に確認できるようにするためです。WaveDrom はプラグインに含まれています。ファイルは読まず、すべて端末の中で描きます。

## 更新履歴

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
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `check_wavedrom`：```wavedrom ブロックのソース（WaveJSON。wave 文字列と data を持つ信号のレーン、またはレジスタのフィールド）を、文書に入れる前に描画せずに検査します。ok か、先に直すべき問題を返します。フェンスを除いたソースを渡してください。
<!-- /ai-tools -->

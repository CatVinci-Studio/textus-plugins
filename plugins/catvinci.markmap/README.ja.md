# マインドマップ

見出しとリストでできた Markdown のアウトラインを、コードブロックの中でマインドマップとして描きます。

言語を `markmap` にしたコードブロックにアウトラインを書きます。見出し（`#`、`##`）とリストの項目がマップの枝になります。マップはブロックの下に描かれ、ブロックをクリックするとソースをもう一度表示して編集できます。

- マップはドラッグで動かせ、拡大・縮小もできます。枝の丸をクリックすると、その枝を畳んだり広げたりします。
- 言語の後に `height=400` と書くと、マップの高さをピクセルで指定できます（既定は 360）。
- 枝の色はテーマに合わせ、テーマを切り替えると描き直します。
- HTML・PDF・Word に書き出すと、マップは画像として入ります。スクロールして見えなくなっているマップも同じです。

描画には [markmap](https://markmap.js.org) を使います。求める権限は一つだけで、下に挙げた `check_markmap` ツールを Textus AI に渡し、文書にブロックを書く前に確認できるようにするためです。

## 例

```markmap
# Project
## Goals
- Ship 1.3
- Write the guide
## People
- Writers
- Reviewers
```

## 更新履歴

- **0.3.8** - The mind map fills its block: a small one grows (up to twice its size) to the block's width and the height you give it, and it follows the note's zoom instead of being cut off on the right. Its page no longer says which devices it runs on: the store shows that.
- **0.3.7** - Its package lists the libraries it carries, with their licenses.
- **0.3.6** - A mind map drawn before its note was laid out no longer shows an error.
- **0.3.5** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.4** - Editing a mind map for a long time no longer makes Textus use more and more memory.
- **0.3.3** - Scrolling over a mind map now scrolls the note; pinch or Ctrl-scroll to zoom. The map uses your theme's font and colors, in dark mode too, and opens fully fitted.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - A mind map scrolled out of sight exports as its picture instead of its source.
- **0.3.0** - Textus AI can check a `markmap` block before it writes one.
- **0.2.0** - Branch colors come from the theme's tones. Needs Textus 1.3.2.
- **0.1.3** - Uses the theme's document text color and footnote size under their Textus 1.3 names.
- **0.1.0-0.1.2** - First versions: `markmap` code blocks drawn in the document, `height=`, and exports as a picture in the export's colors.

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `check_markmap`：```markmap ブロックのソース（見出しとリスト項目がマインドマップの枝になる Markdown のアウトライン）を、文書に入れる前に描画せずに検査します。ok か、先に直すべき問題を返します。フェンスを除いたソースを渡してください。
<!-- /ai-tools -->

# 楽譜（ABC）

コードブロックに書いた ABC 記譜法を楽譜として描きます。

言語を `abc` にしたコードブロックを書くと、そのすぐ下に楽譜が描かれます。ブロックをクリックするとソースがもう一度表示され、編集できます。

- 小節は列の幅に合わせて折り返すので、狭いパネルでも音符が読めます。
- 音符はテーマの文字色で描かれ、ライトとダークを切り替えると描き直されます。
- HTML・PDF・Word に書き出すと、楽譜は画像として入ります。

デスクトップと iPhone で使え、Textus 1.3.2 以降が必要です。求める権限は「Textus AI ツール」の一つだけで、Textus AI が `abc` ブロックを文書に書く前に検査するためのものです。

## 例

```abc
X:1
T:Scale
M:4/4
L:1/4
K:C
C D E F | G A B c |
```

## 更新履歴

- **0.3.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.3.4** - Its package lists the libraries it carries, with their licenses.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Bars wrap to the column instead of the whole score shrinking; clicking a note no longer turns it red; `check_abc` accepts full mode names, any note length, `+:` lines, `` ` `` and `$`; `height=` is gone.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - Textus AI can check an `abc` block before writing it (`check_abc`).
- **0.2.0** - The notes follow the theme's text color; needs Textus 1.3.2.
- **0.1.3** - Uses Textus's renamed document colors.
- **0.1.2** - Exported pictures keep the music's width and height.
- **0.1.0-0.1.1** - First versions: `abc` blocks drawn under their source, `height=`, pictures in exports; store page and icon.

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `check_abc`：```abc ブロックのソース（ABC 記譜法。K: で終わるフィールドのヘッダーと、そのあとの音符）を、文書に入れる前に描画せずに検査します。ok か、先に直すべき問題を返します。フェンスを除いたソースを渡してください。
<!-- /ai-tools -->

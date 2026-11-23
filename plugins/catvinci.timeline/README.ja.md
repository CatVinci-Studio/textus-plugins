# タイムライン

出来事を 1 行に 1 つずつタイムラインに描きます：いつ | 何が | 補足。

## タイムラインを描く

- `timeline` のコードブロックに、1 行に 1 つ出来事を書きます。いつ、何があったか、必要なら補足を `|` で区切ります。タイムラインはその下に描かれ、ブロックをクリックするとソースが表示され、編集できます。
- 出来事は書いた順に 1 本の線に沿って並び、それぞれに点が付きます。「いつ」は日付、年、「3 日目」など、どんな文字でもかまいません。
- 空行は飛ばします。3 つ目の `|` より後は表示されません。
- 言語名の後に `height=400` と書くと高さを指定できます。
- テーマの色で描かれ、テーマを変えると描き直します。
- HTML・PDF・Word に書き出すと、タイムラインは画像として入ります。

## 例

```timeline
2024-03 | 初稿 | 構成と 2 章まで
2024-09 | レビュー | 3 人の読者からのコメント
2025-01 | 出版
```

## 権限

求めるのは **Textus AI のツール** だけで、Textus AI がブロックを書く前に確認できるようにするためです。ファイルは読まず、すべて端末の中で描きます。

## 更新履歴

- **0.4.1** - Its page no longer says which devices it runs on: the store shows that. Its page receives Textus's messages by the API's current name.
- **0.4.0** - A database can be shown as a timeline: pick Timeline among its views, and its dated rows line up in order; a click opens a row. Needs Textus 1.4.6.
- **0.3.3** - A date no longer breaks in the middle ("2024-0" over "3"); a chart drawn while its block was folded fits once it opens.
- **0.3.2** - long notes and dates wrap to fit a narrow island, the timeline uses the document's font, and an empty block says what to write
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - a tool for Textus AI, `check_timeline`
- **0.2.0** - the theme's colors, drawn again when the theme changes
- **0.1.3** - text in the theme's colors on Textus 1.3
- **0.1.2** - keeps up with quick edits: an older drawing never replaces a newer one
- **0.1.0-0.1.1** - first versions: events drawn as a timeline, a height setting, pictures in exports

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `check_timeline`：```timeline ブロックのソース（一行に一つの出来事を いつ | 何が | 補足 と書いたもの）を、文書に入れる前に描画せずに検査します。ok か、先に直すべき問題を返します。フェンスを除いたソースを渡してください。
<!-- /ai-tools -->

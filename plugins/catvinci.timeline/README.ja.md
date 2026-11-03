# タイムライン

出来事を順に、1 行に 1 つ：いつ | 何が | 補足。

- `timeline` のコードブロックを書くと、その下に描かれます。ブロックをクリックするとソースが表示され、編集できます。
- 言語名の後に `height=400` と書くと高さを指定できます。
- HTML・PDF・Word に書き出すと、図は画像として入ります。

## 例

```timeline
2024-03 | First draft | The outline and two chapters
2024-09 | Review | Notes from three readers
2025-01 | Published
```

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `check_timeline`：```timeline ブロックのソース（一行に一つの出来事を いつ | 何が | 補足 と書いたもの）を、文書に入れる前に描画せずに検査します。ok か、先に直すべき問題を返します。フェンスを除いたソースを渡してください。
<!-- /ai-tools -->

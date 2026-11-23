# 見出し番号

書いているあいだ見出しの前に番号（1、1.1、1.2）を表示します。本文は変えません。

- 書いているあいだ、各見出しの前に番号が表示されます：1、1.1、1.2、2… 番号は表示されるだけで、文書のテキストはそのままです。
- 番号は文書でいちばん上のレベルの見出しから振ります。そのレベルがタイトル一つだけなら、一つ下のレベルから振ります。
- 見出しにすでに手で番号を付けている文書には、番号を重ねません。上のレベルの見出しの多くが `1.`、`1.2`、`一、`、`第一章`、`(一)` のような番号で始まる場合です。
- Obsidian：フロントマターに `number headings: off`（Obsidian の Number Headings プラグインの設定）と書くと、その文書では番号を表示しません。
- **書き出しにも番号を付ける**（**設定 › 拡張機能 › プラグイン › 見出し番号**、既定でオン）：HTML と PDF の書き出しにも同じ番号が付きます。

このプラグインは開いている文書の見出しを読み（エディターを読む権限）、下にある `number_headings` ツールを Textus AI に渡します（AI ツールの権限）。このツールは番号を書き込んだ、または取り除いたテキストを返すだけで、ファイルは変えません。デスクトップと iPhone・iPad で使えます。

## 更新履歴

- **0.2.4** - With two documents open side by side, both show their heading numbers, not only the one you are typing in.
- **0.2.3** - Front matter and code blocks no longer get numbers by mistake, and exports number only top-level headings, like the editor.
- **0.2.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.1** - No numbers on a document numbered by hand, or one whose front matter says `number headings: off`.
- **0.2.0** - Textus AI can write heading numbers into Markdown, or take them out.
- **0.1.3** - Says where it runs: the desktop, iPhone and iPad.
- **0.1.2** - Numbering starts at the document's own top heading level instead of a setting.
- **0.1.0-0.1.1** - First versions: numbers before headings while writing, and in HTML and PDF exports.

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `number_headings`：Markdown の見出しに番号（1、1.1、1.2）を書き込みます。番号の付け方はエディタの表示と同じで（一つだけの表題には付けません）、既にある番号は置き換えます。remove を指定すると番号を取り除きます。文章を返し、何も書き込みません。
<!-- /ai-tools -->

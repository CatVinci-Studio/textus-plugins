# 執筆統計

語数、読了時間、毎日の執筆目標をサイドバーに表示します。

サイドバーの **執筆統計** タブを開きます：

- **この文書**：語数、文字数、読了時間。
- **選択範囲**：選択したところの語数と文字数。
- **今日**：今日すべての文書で書き足した語数と毎日の目標との比較、そして目標を続けて達成した日数。目標はプラグインの設定の **1日の目標** で決めます。変えなければ 500 で、0 なら目標なしです。
- **フォルダ全体**：開くと、開いているフォルダ全体の語数、文字数、文書数を数えます。

中国語、日本語、韓国語は文字単位で、ほかの文字は単語単位で数えます。Markdown の記号（`#`、`*`、リンクのアドレス、front matter）は数えません。読了時間は 1 分に 230 語、または日中韓の文字 400 字として計算します。

Textus 1.4.3 以降が必要です。数えるためにエディタと開いているフォルダのファイルを読む権限を求め、下のツールを Textus AI に渡します。

## 更新履歴

- **0.2.8** - Its page is in every language Textus speaks. It names the Textus it needs, 1.4.3.
- **0.2.7** - Code kept for Textus versions it no longer runs on is gone.
- **0.2.6** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.2.5** - Words and characters are counted as the status bar counts them (from Textus 1.4.3), and a Windows file's front matter is left out of the count.
- **0.2.4** - The store description now opens with what the plugin does.
- **0.2.3** - Today now counts only the words you type yourself, not changes from sync or AI, and stays quick in large folders. A negative daily goal is no longer shown as met.
- **0.2.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.1** - Updated shared path code.
- **0.2.0** - Textus AI can count the words of a document or a folder.
- **0.1.1** - Says where it runs: desktop and iPhone.
- **0.1.0** - First version: the document, the selection, today against a goal, the streak and the whole folder.

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `count_words`：文書、フォルダ内のすべての文書、または前面の文書の語数・文字数・読了時間（分）を数えます。中国語・日本語・韓国語の文字は一字を一語とし、Markdown の記号は数えません。
<!-- /ai-tools -->

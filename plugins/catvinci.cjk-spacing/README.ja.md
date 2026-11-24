# 和欧文スペース

中国語・日本語の文字と英字や数字の間にスペースを入れます。

## 文書にスペースを入れる

- **プラグイン › 和文と欧文の間にスペースを入れる** を選ぶか、右クリックメニューから同じ項目を選びます。「Textusで書く」が「Textus で書く」になります。文書全体の変更は 1 回で取り消せ、変えた箇所の数が通知されます。
- プラグインの設定で **保存時にも入れる** をオンにすると、保存のたびに整えます。変わるのは段落・見出し・リストなどの本文だけです。
- 韓国語はそのままです。韓国語はもともと単語の間にスペースを入れて書きます。

## そのまま残すもの

- コード、数式、リンクとウィキリンク、脚注、#タグ、リマインダー (@…)、%% コメント、HTML、front matter。保存時も同じです。
- Obsidian の書き方：ブロック ID（^1a2b3c）、Dataview のフィールド（key:: value）、==ハイライト==、Obsidian Tasks のフィールド（📅 2026-11-07）。

## 権限

- **文書の読み取りと編集**：開いている文書にスペースを入れるため。
- **ファイルの書き込み**：**保存時にも入れる** がオンのとき、保存時に文書を整えるため。
- **Textus AI のツール**：Textus AI がテキストにスペースを入れられるようにするため。

## 更新履歴

- **0.3.1** - Its page shows its list of changes in English in every language.
- **0.3.0** - From Textus 1.4.4, a paragraph missing a space between CJK and Latin text is underlined; its card adds the spaces. Turn it off in the plugin's settings.
- **0.2.4** - A code block inside a longer fence (```` holding ```) is left alone.
- **0.2.3** - Its Textus AI tool says what it does: Chinese and Japanese, not Korean.
- **0.2.2** - leaves Obsidian's block ids, Dataview fields, highlights and Tasks fields as written
- **0.2.1** - leaves #tags, reminders and %% comments alone; on save only prose blocks change
- **0.2.0** - a tool for Textus AI, `fix_cjk_spacing`
- **0.1.3** - runs on the desktop and on iOS
- **0.1.2** - leaves links, wiki links, footnotes, tags and front matter alone
- **0.1.0-0.1.1** - first versions: the command in the right-click and Plugins menus, and spacing on save

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `fix_cjk_spacing`：Markdown の中で、中国語・日本語の文字と英字・数字の間に空白を入れます。コードとリンクはそのままで、プラグインのコマンドと同じです。空白を入れた文章を返し、何も書き込みません。
<!-- /ai-tools -->

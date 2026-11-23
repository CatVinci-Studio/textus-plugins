# 整形

よくある規則に合わない Markdown に波線を引いて直し、空行・空白・句読点・改行も整えます。

Obsidian の Linter のように使え、どの変更も 1 回で取り消せます。

## Markdown

- よくある Markdown の規則に合わない箇所に波線が引かれます。ポインタを置くと、どの規則か、理由が表示されます。
- **Markdown を修正**（右クリックまたは「プラグイン」メニュー）で直せるものを一度に直します。
- ブロックごとに検査するので、文書全体に関わる規則（見出しのレベル、1 行目、ブロック間の空行）は対象外です。

## テキスト

どのコマンドも選択範囲に働きます。何も選択していなければ、確認してから文書全体に働きます。「プラグイン」メニューかコマンドパレットから使えます。

- **空行を削除**：空の段落を削除します。選択範囲では空行をすべて削除します。
- **行末の空白を削除**：行末のスペースとタブを削除します。改行のための 2 つのスペースは残します。
- **和文に全角の句読点**：「你好,世界?」が「你好，世界？」になります。1.3.8 のような数字や英文はそのままです。
- **欧文に半角の句読点**：「Hello，world！」が「Hello, world!」になります。和文に接する記号はそのままです。
- **全角英数字を半角に**：「ＡＢＣ１２３」が「ABC123」になります。
- **選択した行を結合**（右クリックからも）：選択した行を 1 行にします。和文の間にはスペースを入れず、英単語の間には 1 つ入れます。

## 設定

- **規則に合わない Markdown に波線を引く**：オフにすると波線は出ません。「Markdown を修正」はそのまま使えます。
- **検査しない規則**：markdownlint の規則を 1 行に 1 つ（MD009 や no-trailing-spaces）。波線も修正もしません。

## そのまま残すもの

コード、数式、フロントマター、リンク、#タグ、リマインダー (@…)、%% コメント、HTML、参照定義（[d]: url）は指摘も変更もしません。Obsidian の書き方も同じです：ブロック ID（^1a2b3c）、Dataview のフィールド（key:: value、[key:: value]）、==ハイライト==、Obsidian Tasks のフィールド（📅 2026-11-07、🔁 every week、🆔 abc123）。行を結合しても、フィールドは 1 行のまま残ります。括弧は対で変わります：价格(USD) は 价格（USD）になります。

和文と欧文の間にスペースを入れる「和欧文スペース」プラグインも、同じものには手を触れません。

## 権限

- 文書の読み取りと編集：文書を検査して修正するため。
- Textus AI のツール：Textus AI が同じ規則で Markdown を検査できるように。

## 更新履歴

- **0.5.1** - Its package lists the libraries it carries, with their licenses.
- **0.5.0** - Each finding opens a card that names the rule and fixes that block (Alt+Enter), or sets it aside with Ignore (Textus 1.4.4).
- **0.4.1** - Remove Blank Lines and list switching leave a code block inside a longer fence (```` holding ```) alone.
- **0.4.0** - Switch selected lines to a bullet, numbered or task list (numbered counts from 1 at each level; a task keeps its tick).
- **0.3.2** - Shorter help and empty-state text.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - Renamed Tidy (was Markdown Lint): Text Tidy's six text commands moved in; settings to turn off underlines or single rules; Obsidian's own syntax left as written.
- **0.2.1** - Tags, links, reminders and reference definitions are never flagged: the same list CJK Spacing leaves alone.
- **0.2.0** - Textus AI can check Markdown (`lint_markdown`).
- **0.1.0-0.1.2** - First versions: underlines that explain the rule, and Fix Markdown; store page and icon; runs on desktop and iOS.

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `lint_markdown`：Markdown（渡された文章か前面の文書）を、エディタが下線で示すのと同じ markdownlint の規則で検査します。各問題の行・規則・説明・自動修正できるかを返し、fix を指定すると修正後の文章も返します。それ自体は何も変更しません。
<!-- /ai-tools -->

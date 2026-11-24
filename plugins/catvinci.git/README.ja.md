# Git

Git で管理しているフォルダで：

- 前回のコミット以降に変わったファイルに、サイドバーで印が付きます：**M** 変更、**A** 追加、**U** 新規で Git 未登録、**R** 名前変更、**!** 競合。
- 変更した文書では、前回のコミットになかった行（保存した内容で比べます）を含む段落、見出し、リストに、右の余白で印が付きます。クリックするとコミットします（Textus 1.4.4）。
- ステータスバーにブランチが表示され、↑ はプッシュ待ちのコミット、↓ はプル待ちのコミットです。クリックするとコミットします。
- **変更をコミット…**（「プラグイン」メニュー、またはブランチ）は、変更したファイルを一覧にし、前面のファイルを選んだ状態にします。メッセージを書くと、あなた自身の Git がそのファイルだけをコミットします。フックと署名はいつも通り動きます。フォルダで最初にコミットするときは、先に確認します。
- **プッシュ** と **プル**（「プラグイン」メニュー）は、ブランチをそのリモートブランチに送り、リモートのコミットを取り込みます。使うのはあなた自身の Git と、それが保存している認証情報です。求められたら、一度ターミナルで Git にサインインしてください。まだリモートブランチのないブランチは `origin` にプッシュされます。競合しそうなプルは取り消され、何も変わらず、そのことが伝えられます（Textus 1.4.6）。
- バージョン履歴 0.4 があれば、文書のコミットがその版の下に並び、同じように比べて復元できます。
- Textus AI は、変更内容、ファイルのコミット、あるコミット時点のファイルを読めます。たとえばコミットメッセージの下書きに使えます。

ブランチを切り替えることはありません。Git（Mac では Command Line Tools）と Textus 1.4.6 が必要です。

## 更新履歴

- **0.3.1** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it. Its description no longer ends in "Desktop.", and its tools for Textus AI are described in every language.
- **0.3.0** - Push and Pull, and what waits to be pushed or pulled beside the branch (Textus 1.4.6).
- **0.2.0** - Blocks changed since the last commit are marked in the margin (Textus 1.4.4).
- **0.1.1** - The first-commit confirmation's button reads "Commit".
- **0.1.0** - First version.

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `git_changes`：開いているフォルダーのブランチと変更されたファイル、変更された各テキストファイルの最後のコミットからの変更行。コミットメッセージを書く前に読みます。
- `git_history`：ファイルの Git コミットを新しい順に、名前の変更もたどって：ハッシュ、日付、作者、件名。
- `git_file_at`：あるコミット時点でのファイルの内容（ハッシュは git_history から）。
<!-- /ai-tools -->

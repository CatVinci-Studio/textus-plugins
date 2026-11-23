# リマインダー

`(@2026-11-02 09:00)` のように行に書いた時刻に、その行をシステムの通知で知らせます。

印はどの行にも書けます。タスクでも、見出しでも、どんな行でも構いません。その時刻になると、行の本文と文書が通知に出て、クリックするとその行が開きます。

- `(@2026-11-02)` とだけ書くと、その日の朝 9 時に知らせます。
- **プラグイン › リマインド…**、またはスラッシュメニューの **リマインド…** で、カーソルの位置に印を入れられます。1 時間後、今夜 8 時、明日 9 時、来週月曜 9 時、または入力した日付と時刻から選べます。
- チェック済みのタスク（`- [x] …`）は完了扱いで、知らせません。
- サイドバーの **リマインダー** タブに、これからのリマインダーが近い順に並びます。クリックするとその行が開きます。
- リマインダーは Textus 自身が管理します。ウィンドウが開いている間に届き、**バックグラウンドで実行し続ける** がオン（**設定 › 一般**）なら、ウィンドウをすべて閉じていても届きます。Textus が動いていない間に過ぎたものは、次に起動したときに届きます。

印は Obsidian の Reminder プラグインと同じ書き方なので、同じノートが Obsidian でも知らせてくれます。

Textus 1.4.3 以降が必要です。求める権限は、印を探すために開いているフォルダのファイルを読むこと、印を入れるためにエディタに書くこと、通知を出すこと、そして下の 2 つのツールを Textus AI に渡すことです。

## 更新履歴

- **0.3.6** - Its page is in every language Textus speaks. It names the Textus it needs, 1.4.3.
- **0.3.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.3.4** - Opening a folder reads only the documents Textus finds a reminder mark in, not every document.
- **0.3.3** - The store description now opens with what the plugin does.
- **0.3.2** - Two open windows no longer clear each other's reminders, and the list empties when you close the folder. A mistyped time is refused instead of inserting a broken mark.
- **0.3.1** - Shorter help and empty-state text.
- **0.3.0** - Marks written with Textus's own dates; needs Textus 1.3.10.
- **0.2.2-0.2.3** - Updated shared date code.
- **0.2.1** - Textus AI is told when a due date belongs in Tasks instead.
- **0.2.0** - Textus AI can list the coming reminders and add one.
- **0.1.1** - Desktop only, since it runs in the background.
- **0.1.0** - First version: `(@date time)` marks as notifications Textus keeps, even in the background; Remind Me… and the sidebar list.

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `list_reminders`：これからのリマインダー（開いているフォルダの文書にある (@2026-11-02 09:00) の印）を近い順に、時刻・本文・文書のパス・行番号とともに一覧にします。 期日ごとのタスクは list_tasks です。
- `add_reminder`：前面の文書の末尾に、時刻付きのタスク行 - [ ] 本文 (@2026-11-02 09:00) としてリマインダーを追加します。その時刻に通知が届きます。 決まった時刻に知らせてほしいときに使います。期日だけの ToDo は add_task です。
<!-- /ai-tools -->

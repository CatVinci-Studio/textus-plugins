# タスク

フォルダ内のすべてのタスクを一つの一覧に。

- どこにでも `- [ ] やること` と書けばタスクになります。
- サイドバーの **タスク** タブには、開いているフォルダ内のすべての文書のタスクが並びます。
- そこでチェックして完了にするか、クリックしてその文書の該当箇所へ移動できます。
- 完了したタスクを表示するかどうかは、プラグインの設定で変えられます。
- タスクに日付（`📅 2026-11-01` または `due:2026-11-01`）を書くとバッジで表示され、期限を過ぎたものや 1 週間以内に迫ったものは、一番上の **期限が近い** にまとまります。
- 上の入力欄で、語句・文書名・見出しから一覧を絞り込めます。
- カンバンボード（front matter に `kanban-plugin` がある文書、または `名前.kanban.md`）のカードはボードに任せ、一覧には出しません。

## Obsidian で書いたタスク

Obsidian の Tasks プラグインで書いたタスクも、ここで同じように扱えます。

- `[/]` は進行中で未完了、`[-]` はキャンセルで終了扱いです。
- タスク末尾のフィールド（📅 期限、⏳ 予定、🛫 開始、➕ 作成、✅ 完了、❌ キャンセル、優先度 🔺 ⏫ 🔼 🔽 ⏬、🔁 繰り返し）はファイルに残し、一覧には出しません。
- チェックすると ✅ とその日の日付を書き、外すと消します。
- 繰り返しのタスク（`🔁 every day`、`every 2 weeks`、`every weekday`、`every Monday`、`every month on the 15th`、`every year`、`… when done`）をチェックすると、日付を進めた次の回を上の行に加えます。

## タスクのクエリ

`tasks` コードブロックは、一行に一つの条件で、Obsidian と同じ書き方でタスクを並べます。

````markdown
```tasks
not done
due before next week
path includes Projects
sort by due
```
````

読める条件：`not done` と `done`、`due`・`scheduled`・`starts`・`done`・`created` に `before`・`after`・`on`・`on or before`・`on or after` と日付（2026-11-01、today、tomorrow、yesterday、this／next／last week・month・year）、`no due date` と `has due date`、`path`・`filename`・`description`・`heading` の `includes` と `does not include`、`tag includes`、`priority is`、`is recurring`、`sort by`、`group by`（path、folder、filename、heading、due、priority、status）、`limit`。見た目の行（`hide …`、`show …`）は飛ばし、ほかに読めない行は件数の下に示します。ブロックでチェックするとファイルのタスクにチェックが入り、クリックするとその場所へ移ります。

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `list_tasks`：開いているフォルダの文書にある Markdown のタスク（- [ ] ...）を一覧にします。既定では未完了のものだけで、それぞれ本文・期限・文書のパス・行番号付き。状態・文書・タグ・期限・語句で絞り込めます。 カンバンのカード（read_board）や時刻付きリマインダー（list_reminders）は含みません。
- `add_task`：開いているフォルダの文書にタスク（- [ ] ...）を追加します。末尾か、見出しの下の節の終わりに置き、期限があれば付けます。文書がなければ作ります。置いた場所を返します。 時刻に通知したいものは add_reminder、ボードのカードは add_card、データベースの行は add_row、今日の日記への追記は append_to_daily_note を使います。
- `complete_task`：list_tasks が返す文書のパスと行番号で、タスクを完了（- [x]）にします。done を false にすると未完了に戻します。 Obsidian Tasks と同じく完了日（✅ YYYY-MM-DD）を書き、繰り返しタスク（🔁 every …）は次の回を上の行に加えます。
<!-- /ai-tools -->

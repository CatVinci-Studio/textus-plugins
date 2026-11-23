# タスク

フォルダ内のすべてのタスクを一つの一覧に集め、そこで完了にでき、Obsidian Tasks と同じ書き方でクエリもできます。

- どこにでも `- [ ] やること` と書けばタスクになります。
- サイドバーの **タスク** タブには、開いているフォルダ内のすべての文書のタスクが、文書ごとに、それぞれの見出しとともに並びます。
- そこでチェックして完了にするか、クリックしてその文書の該当箇所へ移動できます。
- タスクに日付（`📅 2026-11-01`、`due:2026-11-01`、`[due:: 2026-11-01]`）を書くとバッジで表示され、期限を過ぎたものや 1 週間以内に迫ったものは、一番上の **期限が近い** にまとまります。
- 上の入力欄で、語句・文書名・見出しから一覧を絞り込めます。
- 完了したタスクは既定では隠れます。**設定 › 拡張機能 › プラグイン › タスク** の **完了したタスクも表示** で表示できます。
- カンバンボード（フロントマターに `kanban-plugin` がある文書、または `名前.kanban.md`）のカードはボードのもので、サイドバーの一覧にもタスクのクエリにも出しません。

## Obsidian で書いたタスク

Obsidian の Tasks プラグインで書いたタスクも、ここで同じように扱えます。

- `[/]` は進行中で未完了、`[-]` はキャンセルで終了扱いです。
- タスク末尾のフィールド（📅 期限、⏳ 予定、🛫 開始、➕ 作成、✅ 完了、❌ キャンセル、優先度 🔺 ⏫ 🔼 🔽 ⏬、🔁 繰り返し）はファイルに残し、一覧には出しません。
- チェックすると ✅ とその日の日付を書き、外すと完了日やキャンセル日を消します。
- 繰り返しのタスクをチェックすると、日付を進めた次の回を上の行に加えます。`🔁 every day`、`every 2 weeks`、`every weekday`、`every weekend`、`every Monday`、`every month on the 15th`、`every month on the last`、`every year`、`… when done` などを読み取れます。

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

- **状態**：`done`、`not done`、`status.type is`（`todo`・`in_progress`・`done`・`cancelled`）。
- **日付**：`due`・`scheduled`・`starts`・`done`・`created`・`cancelled`・`happens` に、`before`・`after`・`on`・`in`・`on or before`・`on or after` と日付（2026-11-01、today、tomorrow、yesterday、または this／next／last と week・month・year）。`no due date` と `has due date` も使えます（ほかの日付も同様）。
- **テキスト**：`path`・`folder`・`filename`・`description`・`heading` に `includes` か `does not include`。`tag includes`、`tag does not include`、`has tags`、`no tags`。
- **その他**：`priority is`（`above`・`below`・`not` も可）、`is recurring`、`is not recurring`。
- **並べ方**：`sort by` と `group by`（status、due、scheduled、start、done、created、priority、path、folder、filename、heading、description。`reverse` も付けられます）、`limit`。`sort by` がなければ、Obsidian Tasks と同じく状態・期限・優先度・パスの順です。

見た目の行（`hide …`、`show …`）は飛ばし、ほかに読めない行は件数の下に示します。タスクの中の [[リンク]] をクリックするとそのノートが開きます。ブロックでチェックするとファイルのタスクにチェックが入り、クリックするとその場所へ移ります。

## 権限

このプラグインは、タスクを見つけるためにフォルダの文書を読み、タスクをチェックするときと追加するときだけ文書に書き込みます。下にあるツールを Textus AI にも渡します。デスクトップと iPhone・iPad で使えます。

## 更新履歴

- **0.5.0** - A task query no longer lists a Kanban board's cards, as the sidebar and Textus AI already didn't. Grouped by document, its rows don't repeat the document's name, and a [[link]] in a task opens its note.
- **0.4.7** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.4.6** - The tasks block keeps a gap inside its frame, as other blocks do.
- **0.4.5** - The AI's new task under a heading never lands inside a code block, and **Move finished tasks to the end of their list** works in Windows (CRLF) notes.
- **0.4.4** - A task query in a document draws at the interface's text size, so a wider column shows more of it rather than larger text (Textus 1.4.1).
- **0.4.3** - Ticking a task with an HTML comment in it now works, and a refused tick tells you why. `group by status` sorts in the right order, task blocks fit narrow panes, due dates look like the sidebar's, and typing stays lighter.
- **0.4.2** - Shorter help and empty-state text.
- **0.4.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12. A new setting, **Move finished tasks to the end of their list**: a task ticked in a document or in the list goes after the open ones (it asks once to read and edit the document in front).
- **0.4.0** - Uses the dates built into Textus 1.3.10, which it now needs.
- **0.3.1** - Ships the updated shared date code; nothing else changed.
- **0.3.0** - Obsidian Tasks: `[/]` and `[-]`, the task fields, done dates, repeating tasks and `tasks` query blocks; boards marked with `kanban-plugin` are left out of the list.
- **0.2.1** - Cards on a Kanban board (`name.kanban.md`) are no longer listed.
- **0.2.0** - Textus AI can list, add and tick off tasks.
- **0.1.3** - The list follows the interface language when it changes.
- **0.1.2** - Due dates in local time; counts in each language's plural forms.
- **0.1.0-0.1.1** - First versions: every task in the folder in a sidebar list, ticked off or opened from there, with a filter, due dates and Due soon.

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `list_tasks`：開いているフォルダの文書にある Markdown のタスク（- [ ] ...）を一覧にします。既定では未完了のものだけで、それぞれ本文・期限・文書のパス・行番号付き。状態・文書・タグ・期限・語句で絞り込めます。カンバンのカード（read_board）や時刻付きリマインダー（list_reminders）は含みません。
- `add_task`：開いているフォルダの文書にタスク（- [ ] ...）を追加します。末尾か、見出しの下の節の終わりに置き、期限があれば付けます。文書がなければ作ります。置いた場所を返します。時刻に通知したいものは add_reminder、ボードのカードは add_card、データベースの行は add_row、今日の日記への追記は append_to_daily_note を使います。
- `complete_task`：list_tasks が返す文書のパスと行番号で、タスクを完了（- [x]）にします。done を false にすると未完了に戻します。Obsidian Tasks と同じく完了日（✅ YYYY-MM-DD）を書き、繰り返しタスク（🔁 every …）は次の回を上の行に加えます。
<!-- /ai-tools -->

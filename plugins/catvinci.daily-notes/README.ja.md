# カレンダーとデイリーノート

開いているフォルダの中に一日一つのノートを保存し、サイドバーのカレンダーからどの日にも移れます。

- **Ctrl+Alt+J**（Mac では **⌘⌥J**）を押すか **プラグイン › 今日のノートを開く** を選ぶと、今日のノートが開きます。初回は自動で作られます。
- **プラグイン › 前の日のノートを開く** と **プラグイン › 次の日のノートを開く** で、表示中の日のノートから前後の日へ移れます。
- サイドバーの **カレンダー** タブに一か月が表示され、ノートのある日には印が付きます。日をクリックするとその日のノートが、**今日** をクリックすると今日のノートが開きます。週の始まりは Textus の言語に合わせ、週番号と揃います。
- すでにあるノートが上書きされることはありません。

## 設定

- **デイリーノートのフォルダ**：開いているフォルダの中のフォルダ。既定は `Daily`。
- **新しい日のノート**：新しいノートの書き出し。既定は `# {{date}}`。`{{date}}`、`{{weekday}}`、`{{yesterday}}` と `{{tomorrow}}`（`[[{{yesterday}}]]` のようなリンクに使えます）、`{{time}}`、`{{title}}`、`{{date:書式}}`、`{{date+1d}}` が使え、`\n` で改行します。Templates フォルダにあるテンプレートの名前（`Daily` など）を書くこともできます。
- **週次ノート** と **月次ノート**：既定はオフ。オンにすると、**プラグイン › 今週のノートを開く** と **今月のノートを開く**、またはカレンダーの週番号と月の名前から開けます。それぞれにフォルダ（`Weekly`、`Monthly`）、名前の書式（`gggg-[W]ww` なら `2026-W45`、`YYYY-MM` なら `2026-11`）、テンプレートがあります。週次のテンプレートでは `{{monday:YYYY-MM-DD}}` … `{{sunday}}` でその週の各日を書けます。

## Obsidian の保管庫

Obsidian の保管庫では、保管庫のデイリーノート設定に従います。フォルダ、名前の書式（`YYYY/MM/YYYY-MM-DD` や `MMMM Do, YYYY` など）、テンプレートです。Textus がその設定を変えることはありません。設定のない保管庫では、Obsidian と同じくノートを保管庫の一番上に置きます。`{{date}}`・`{{yesterday}}`・`{{tomorrow}}` はノートの名前の書式で書かれます。Periodic Notes プラグインのある保管庫では、週次と月次はその設定に従います。

## 権限

ノートを探して作るために、開いているフォルダのファイルを読み書きします。前後の日を知るために、表示中の文書がどれかを読みます。また、Textus AI に下の二つのツールを渡します。Textus 1.4.3 以降が必要です。

## 更新履歴

- **0.7.9** - Its page no longer says which devices it runs on: the store shows that. It names the Textus it needs, 1.4.3.
- **0.7.8** - Where the bar is too narrow for even the short month name (a phone's sidebar), the month goes on a row of its own above the buttons instead of losing its year. The calendar writes dates with Textus's own, so the package is smaller.
- **0.7.7** - Weeks start as Textus's language has them, not the device's region, so they agree with the week numbers.
- **0.7.6** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.7.5** - The Calendar's month title starts at the left and ends in an ellipsis in a narrow sidebar, instead of being cut at both ends.
- **0.7.4** - In a narrow panel, such as on a phone, the calendar shows the month's short name instead of cutting the long one off.
- **0.7.3** - Impossible dates such as February 30 are refused, the calendar stays a comfortable width in wide panels and redraws when folder settings change, and weekly and monthly settings show only when those notes are on.
- **0.7.2** - Shorter help and empty-state text.
- **0.7.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.7.0** - Dates and templates are filled in by Textus itself, the same way as in the Templates plugin; needs Textus 1.3.10.
- **0.6.0** - Weekly and monthly notes, with their own settings, the calendar's week numbers and month name, and a vault's Periodic Notes settings.
- **0.5.0** - A vault without daily notes settings keeps its notes at its top; `{{date}}`, `{{yesterday}}` and `{{tomorrow}}` follow the notes' name format, `MMMM Do, YYYY` included.
- **0.4.0** - Follows an Obsidian vault's daily notes settings; the starting text can name a template in the Templates folder; `{{date:FORMAT}}` and `{{title}}`.
- **0.3.0** - Textus AI can read a day's note and add to it.
- **0.2.0** - The calendar uses Textus's own controls and follows the interface language when it changes; needs Textus 1.3.2.
- **0.1.3** - Textus 1.3's colors and type.
- **0.1.2** - Weeks start as your region has them; a day's note is never written over.
- **0.1.0-0.1.1** - First versions: today's note with a shortcut, the calendar, the day before and after, `{{weekday}}`, `{{yesterday}}`, `{{tomorrow}}` and `{{time}}` in the template.

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `read_daily_note`：ある日のデイリーノート（日付がなければ今日）をデイリーノートのフォルダから読みます。パス、あるかどうか、本文を返します。
- `append_to_daily_note`：ある日のデイリーノート（日付がなければ今日）の末尾に Markdown を書き足します。ノートがなければ先にテンプレートから作ります。 あとで使うためサイドバーに置くメモは add_note、日付付きの ToDo は add_task です。
<!-- /ai-tools -->

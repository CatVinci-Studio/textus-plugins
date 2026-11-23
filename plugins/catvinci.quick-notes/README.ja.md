# クイックノート

文書から離れずにさっとメモを取れます。メモはフォルダの受信箱ファイルか、今日のデイリーノートに入ります。

- **Ctrl+Alt+N**（Mac では **⌘⌥N**）または **プラグイン › 新しいクイックノート…** でメモを入力し、保存します。
- デスクトップでは、トレイやメニューバーのアイコンにも **新しいクイックノート…** があります。プラグインが Textus にバックグラウンドでの実行を求めるので、ウインドウをすべて閉じていても使えます。
- サイドバーの **クイックノート** タブに、新しい順でメモが並びます。**新規** でそこに書き足したり、一覧の中で直接書き換えたりできます。
- 各メモの操作メニュー（その他ボタンか右クリック）には **挿入**（文書のカーソル位置へ）、**開く**、**削除** があります。文書に保存されたメモは、その文書のその行で開きます。
- うっかり削除したら、下の **元に戻す** で数秒のうちに戻せます。新しく作って空のままのメモは自然に消えます。
- メモが 6 件以上になると、上に検索欄が出ます。

## メモの保存先

メモは開いているフォルダの文書に保存されるので、Obsidian や Cloud Sync からも見えます。プラグインの設定の **メモの保存先** で選びます：

- **受信箱ファイル**（既定）：フォルダ直下の `Inbox.md`、または **受信箱ファイル** で指定した別の文書。メモは末尾にリスト項目として、日付と時刻付きで追加されます（例：`- 2026-11-08 14:05 アンナに電話`）。
- **今日のデイリーノート**：`## クイックノート` 見出し（表示言語の見出し）の下に入り、なければ追加します。メモには時刻が付きます（例：`- 14:05 アンナに電話`）。デイリーノートのフォルダ、名前、テンプレートは、Obsidian などフォルダのデイリーノート設定に従います。設定がなければ `Daily/YYYY-MM-DD.md` です。

ファイルを書き換えると、サイドバーも追従します。以前のバージョンのメモは一度だけ、古い順にそこへ移されます。フォルダを開いていないときは、メモは Textus の中に保存されます。

スマートフォンでは、**新しいクイックノート…** はタイトル行のメニューの **プラグイン** にあり、各メモの操作はその他ボタンにあります。トレイがないので、バックグラウンドでの実行は求めません。

## 権限

- ファイルの読み書き：受信箱ファイルやデイリーノートのため。
- 文書の編集：カーソル位置にメモを挿入するため。
- Textus AI のツール：Textus AI がクイックノートを追加できるように。

## 更新履歴

- **0.6.0** - On iPhone, iPad and Android too: **New Quick Note…** under Plugins and the sidebar tab, with New and each note's more button easy to tap. Only the desktop asks to keep Textus running in the background. Needs Textus 1.4.7. Its page no longer says which devices it runs on: the store shows that.
- **0.5.5** - Its buttons' names and tooltips come from Textus, as on its other pages.
- **0.5.4** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.5.3** - New while searching clears the search, so the new note shows; right-clicking a note's text also offers undo, cut, copy and paste; a search with no match says so.
- **0.5.2** - In the sidebar the panel draws no title of its own, as the sidebar's other tabs. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout. An empty list says what Quick Notes is for and offers New; a note's box grows with its text.
- **0.5.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.5.0** - Dates and the daily note's template are filled by Textus itself, the same way as in Calendar & Daily Notes and Templates. Needs Textus 1.3.10.
- **0.4.0** - Notes are kept in a document of the folder: `Inbox.md` or today's daily note. Notes from older versions move in once.
- **0.3.1** - Textus AI tells quick notes apart from the daily journal and to-dos.
- **0.3.0** - Textus AI can add a quick note (`add_note`).
- **0.2.0** - Textus's own controls, and an actions menu for each note.
- **0.1.0-0.1.4** - First versions: the shortcut and the tray, the sidebar list, insert, open, delete with Undo, search once there are many, dates on a line of their own; desktop only.

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `add_note`：サイドバーのクイックノートの一覧の先頭にメモを追加します。あとで文書に挿入したり、文書として開いたりできます。 今日の日記は append_to_daily_note、ToDo は add_task です。
<!-- /ai-tools -->

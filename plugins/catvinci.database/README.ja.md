# Wiki

ページの中のページと、ノートを表・ボード・カレンダー・ギャラリー・リストにまとめたデータベース。どれも普通の Markdown ファイルです。

データベースは **Obsidian の Bases 形式**（` ```base ` ブロックと `.base` ファイル）で書かれるので、Obsidian でも同じデータベースが開けます。

## ページ

- **サブページのあるページはフォルダです**：`計画/計画.md` がページで、そのサブページは隣の `計画/` に並びます。Obsidian のフォルダノートと同じ形です。`/` と入力して **サブページを作成…** を選ぶか、**プラグイン › サブページを作成…** を使います。最初のサブページを作ると、`計画.md` が自動でそのフォルダに移り、そこへのリンクも追従します。
- サイドバーの **ページ タブ** は、フォルダをページのツリーとして表示します。ページを右クリックすると、サブページの作成、名前の変更、アイコンの設定、ゴミ箱への移動（確認のうえ、下のページごと）ができます。ページを別のページにドラッグすると、そのページのサブページになります。どの移動でもリンクが追従します。
- **ページアイコン**：**ページアイコンを設定…**（「プラグイン」メニュー、または **ファイル** タブで文書を右クリック）で絵文字を選びます。ページの front matter に `icon` として保存されます。
- **ページかファイルか**：ページ タブは Notion のように、ページとその下にあるものを表示します。ファイル タブは、ディスク上のファイルとフォルダをそのまま表示します。どちらを使っても同じファイルです。
- **今いる場所**：サブページでは、ステータスバーに上位のページが表示されます：`暮らし › 2026 カレンダー › 第 1 週`。
- ファイル タブで **ページのフォルダの名前を変える** と、ページの名前も一緒に変わるので、サブページのあるページのままです。
- **以前の形**：`計画.md` の隣の `計画/` フォルダにサブページがある形も、同じように読めます。**プラグイン › ページをフォルダーに整理…** は、一覧を見せたうえで、そうしたページをすべて一度にそれぞれのフォルダへ移します。

## データベース

データベースは、ページの中の `base` ブロック、またはタブで開いた `.base` ファイルです。フィルターでノートを選び、各ノートが行に、その front matter のプロパティが列になります。`/` と入力して **新しいデータベース…** を選ぶ（または **プラグイン › 新しいデータベース…**）と、データベース用のフォルダと、ブロックを入れたページが作られます。

````markdown
```base
filters:
  and:
    - file.inFolder(this.file.folder)
    - file.path != this.file.path
views:
  - type: kanban
    name: Board
    groupBy:
      property: status
    groupOrder: [To read, Reading, Read]
  - type: table
    name: Table
    limit: 25
```
````

- **ビュー** はブロック上部のタブです：表、ボード、カレンダー、ギャラリー（Bases の `cards`）、リスト。ビューを右クリックするとメニューが開き、レイアウトの変更、名前の変更、削除ができます。**+** でビューを追加します。カレンダーは Textus 独自のもので、Obsidian では知らないビューとして表示されます。
- **どの行もノートです。** セルをクリックすると変更でき、プロパティはそのノートの front matter に書かれます。**新規** でデータベースのフォルダにノートを作ります。行はファイルと同じようにタブで開きます。
- **列**：列の見出しをクリックすると、並べ替え、絞り込み、種類の変更、名前の変更、非表示、全行からのプロパティ削除ができます。**+** でプロパティを追加します。見出しをドラッグすると列が移動し、右端をドラッグすると幅が変わります（端をダブルクリックすると元の幅に戻ります）。順番と幅はデータベースに保存され、幅は Obsidian の `columnSize` として書かれます。
- **ボード**：カードを別のリストにドラッグすると値が変わります。リストを見出しでドラッグすると、好きな順に並べられます（`groupOrder`）。
- **カレンダー**：行は日付のプロパティで置かれます。日をクリックすると、その日付の行を作ります。
- **フィルター**、**並べ替え**、列のメニューは、Bases と同じ書き方でビューに保存されます：`status == "Read"`、`tags.contains("ml")`、`due.isEmpty()`。Textus がまだ読めないフィルターはそのまま残し、バーの下でそう伝えます。
- **文書の中での大きさ**：データベースは本文の幅（**ワイド表示** ならペインの幅）で、列がそれより広いと横にスクロールします。高さは行の分だけで、Textus のブロックの上限（ウインドウの 70%、最大 1200 px）を超えると中でスクロールし、下にまだあるあいだは下端が薄くなります。
- **長いデータベース** は最初の 25 行（またはビューの `limit`）を表示し、下へスクロールすると残りを読み込みます。表の見出しは見えたままです。ブロックの左にマウスを乗せると出る三角で、ブロックを 1 行に畳めます。畳んだ状態と最後に開いていたビューは、この端末にだけ保存されます。
- **数式**（データベースの `formulas:`）は行ごとに計算され、列、フィルター、並べ替えに使えます：`(price / pages).toFixed(2)`。集計はまだ表示しません。
- **プロパティの種類** は、フォルダが保管庫なら `.obsidian/types.json` にある Obsidian のものを使います。
- **埋め込んだノートの中**（`![[ページ]]`）では、データベースは 1 行で表示されます。クリックすると描画します。
- **Dataview から**：` ```dataview ` ブロックにカーソルを置き、**プラグイン › Dataview クエリを Base に変換** を実行します。`FROM`、`WHERE`、`SORT`、`LIMIT` を使った `TABLE` と `LIST` は、ブロックの場所で同じ内容のデータベースになります。`TASK`、`GROUP BY`、`FLATTEN`、`dataviewjs` は理由を示して断り、何も変えません。

Notion の書き出しは **Notion インポート** プラグインで取り込めます。このプラグインで表示できるページとデータベースを書き出します。

## 権限

- **開いているフォルダのファイルの読み書き**：ノートとそのプロパティを読み、ページとデータベースを作り、セルの変更を front matter に書き、ページをリンクごと移動したり名前を変えたりするため。
- **文書の読み取りと編集**：新しいデータベースやサブページとそのリンクを挿入し、Dataview ブロックをデータベースに変えるため。
- **Textus AI のツール**：Textus AI がデータベースとページを作り、行を読んで追加できるようにするため。

## 更新履歴

- **0.8.3** - The bar stays on one line when there is room: in a zoomed block on a Mac it folded the view tabs into one button and put the sorts on a line of their own, and measured itself many times on every click. A block taller than Textus lets it be fades at its foot while more rows are below, instead of looking cut off. By touch, a board card or lane lifts after a short hold, so a swipe scrolls instead of dragging. Its page is in every language Textus speaks. Its tools for Textus AI are described in every language, and in Chinese a database is 数据库 while 知识库 is the plugin's name.
- **0.8.2** - The `file.folder`, `file.path` and `file.mtime` columns show each page's folder, path and when it was last changed (they were empty).
- **0.8.1** - Rows and cards make way at the pace of the rest of Textus.
- **0.8.0** - Other plugins can add views beside the table, board, calendar, gallery and list - the Timeline plugin's timeline, for one - in the view menus. Needs Textus 1.4.6 for those.
- **0.7.16** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller. A board's lists move as Textus's own tabs do, and a column's width can also be set with the arrow keys.
- **0.7.15** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.7.14** - A column's grip is placed by Textus's shared rule, the same one as the document's tables. The calendar view and cell editing use Textus's shared page tools. Needs Textus 1.4.3.
- **0.7.13** - A column is pulled by the same grip as the document's tables, and lifts and slides the same way. Needs Textus 1.4.3.
- **0.7.12** - A view tab whose name would be cut short ("Calenda") makes the bar give way a step instead. Menu words match the app's table menu (Title Case; German, Spanish and Portuguese row words).
- **0.7.11** - A filter's verb (is, is not, is empty) is picked from Textus's own menu instead of the system's dropdown, and its option boxes are Textus's own checkboxes.
- **0.7.10** - Renaming a row in a table renames it as the Pages tree does: a page with sub-pages keeps them and stays in its database, and only the page's own title heading changes. An open `.base` file shows changes saved in Textus or written by a plugin, and never writes an older copy over a newer file: a change made meanwhile is refused with a note to make it again. Renaming a property to a name some notes already have asks first and keeps their value.
- **0.7.9** - Tables are denser: every column has one width (the title's wider) and the table scrolls sideways when they don't fit, each row is one line with longer values cut short and shown whole on hover, and rows sit closer. Tags and links no longer run over the next column. A base on screen draws again only when its rows change, not at every save in the folder. A base's bar no longer jumps back and forth between one line and two.
- **0.7.8** - Setting a column's type (number, date, checkbox, list) works again in every folder: the type is kept in the base, and Obsidian's own types are still read. A base in a document draws at the interface's text size, so a wider column shows more of it rather than larger text; Cut, Copy and Paste in a cell's right-click menu work with Textus 1.4.1.
- **0.7.7** - Every button and menu now shows its words in your language, including Japanese, Korean, German, Spanish, French, Portuguese and Russian; a board lane's tooltip no longer shows a raw name. A table now fits its page and wraps long names before it scrolls sideways; a page's icon shows in place of the file icon in the Pages tree. Needs Textus 1.4.0.
- **0.7.6** - In a narrow block the bar keeps to one line: the count goes first, then New's word, then the view tabs fold into a menu; sorts and filters ride in the bar while there's room. A filter on a select, tags or a checkbox is ticked in a list, as in Notion, with Clear selection. A dragged view tab stays where it's let go, and a view wider than the block fades at its edges. With Textus 1.3.13 the block can be shown wide, across the pane, and drawn smaller, from its right-click menu. Shorter help and empty-state text.
- **0.7.5** - A long title or text wraps within a column of a set width instead of stretching the table; a row's right-click menu is laid out as a Markdown table's (insert a row below or a column to the right, then Row and Column); the date month opens and sits under its field in every window, zoomed too; a new row is drafted in the table's own cells; a field's right-click menu is Textus's own; a view's tab can be dragged on a Mac too; needs Textus 1.3.12. Its name is Notion's word for a wiki in each language (Wiki in English); a database is a base, as Obsidian calls it (New Base…).
- **0.7.4** - a table's head stays in view while its rows scroll; more rows load as you scroll down, no Show more; a view's menu is on right-click only; columns start at widths in proportion to the block; the view you leave a block in is kept on this device, not in the note; a block folds with Textus's own caret on its left, no fold arrow of its own; a column is dragged by its head as the sidebar's tabs are, the others sliding aside; a rating column shows the same way all down; a filter added twice is kept once, and one that contradicts another (status is Done, then status is Doing) takes its place; its board, fields and stars are Textus's own controls; a row's right-click menu opens it or moves it to the Trash; view tabs are dragged into a new order; a date is typed or picked from a small month under its field; a new sub-page's link in a page just moved into its folder points from where the page is now; needs Textus 1.3.12
- **0.7.3** - Shares Two-way Links' fix for working out how a note links.
- **0.7.2** - a dragged column stays under the pointer in a zoomed document, and dragging selects no text; a date is edited as it is shown, 2026-11-08, not in the system's order; new pages and databases are linked with standard links, [Week 1](Week%201.md), unless the folder or the page already uses [[wiki links]]
- **0.7.1** - new databases and sub-pages are linked the way the folder writes links; needs Textus 1.3.10
- **0.7.0** - drag column heads to reorder and their edges to resize (`columnSize`); a view's menu on right-click; rows open in a tab; option colors from their words; **Convert Dataview query to base**
- **0.6.0** - databases are Obsidian bases (` ```base ` blocks and `.base` files) with views, filters, sorts, `groupOrder`, `limit`, formulas, folding and **Show more**; the Pages tab can rename, delete to the Trash and drag; page folders follow renames
- **0.5.0** - renamed Workspace: Pages and Notion Import merged in; a page with sub-pages becomes a folder, and **Organize Pages into Folders…** moves older pages
- **0.4.3** - card tags and long values wrap on boards and galleries
- **0.4.1-0.4.2** - Notion dates and relations read better; then the Notion import moves to the Notion Import plugin
- **0.4.0** - tools for Textus AI to read a database's rows and add rows
- **0.3.0** - Textus's own menus for properties, filters and options, and no frame around the block
- **0.2.0** - Notion-style filters and sorts, select options, property types, and columns and pages made in the table
- **0.1.0-0.1.1** - first versions: a folder's documents as a table, board, calendar or gallery, edited in place; a Notion CSV import; a tool for Textus AI to make a database

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `create_database`：Obsidian の Bases 形式でデータベースを作ります。各ノートのフロントマターにプロパティを持つノートのフォルダーと、その中に ```base ブロックでそれらを表・ボード・カレンダー・ギャラリー・リストとして表示するページです。そのページへのリンクを返すので、ユーザーの望む場所に置きます。
- `query_rows`：データベースの行を読みます。その base が選ぶノート（既定ではそのフォルダーのノート）を、名前・パス・プロパティ付きで、絞り込みと並べ替えをして返します。
- `add_row`：データベースに行を追加します。そのフォルダに行の名前の文書を作り、プロパティをフロントマターに書きます。そのフォルダを表示するすべてのブロックに現れます。 データベースのフォルダ（create_database、query_rows）専用です。普通の ToDo は add_task です。
- `create_page`：ページを作ります。開いているフォルダの最上位にそのタイトルの文書を作るか、親ページの隣のフォルダにサブページを作り、アイコンがあれば付けます。パスと、親ページに置く [[リンク]] を返します。
<!-- /ai-tools -->

# 知識庫

頁面裡套頁面，再把你的筆記做成表格、看板、日曆、畫廊和清單形式的資料庫，全部都是一般的 Markdown 檔案。

資料庫以 **Obsidian 的 Bases 格式** 寫成（` ```base ` 區塊和 `.base` 檔案），所以 Obsidian 也能開啟同一個資料庫。

## 頁面

- **有子頁面的頁面就是一個資料夾**：`Plans/Plans.md` 是頁面，它的子頁面放在旁邊的 `Plans/` 裡，和 Obsidian 的 folder notes 相同。輸入 `/` 選 **新增子頁面…**，或使用 **外掛程式 › 新增子頁面…**。建立第一個子頁面時，會幫你把 `Plans.md` 移進它的資料夾，指向它的連結也會跟著改。
- 側邊欄的 **頁面樹** 分頁把資料夾顯示成一棵頁面樹。在頁面上按右鍵，可以新增子頁面、重新命名、設定圖示，或移到垃圾桶（連同它底下的頁面，會先問你）。把一個頁面拖到另一個頁面上，它就變成那個頁面的子頁面。每次移動，連結都會跟著改。
- **頁面圖示**：**設定頁面圖示…**（在「外掛程式」選單裡，或在 **檔案** 分頁的文件上按右鍵）可以選一個表情符號，保存為頁面 front matter 裡的 `icon`。
- **頁面樹還是檔案？** **頁面樹** 分頁像 Notion 一樣，顯示頁面和它底下的內容；**檔案** 分頁則照磁碟上的樣子，顯示每個檔案和資料夾。用哪一個都可以，它們是同樣的檔案。
- **你在哪裡**：在子頁面裡，狀態列會顯示它上層的頁面，例如 `Life › 2026 Calendar › Week 1`。
- 在 **檔案** 分頁裡 **重新命名頁面的資料夾** 時，頁面會一起改名，所以它仍然是帶子頁面的頁面。
- **舊的排法**：`Plans.md` 的子頁面放在它旁邊的 `Plans/` 資料夾裡，這樣也能照常讀取。**外掛程式 › 整理為資料夾單元…** 會先列出清單，再一次把所有這類頁面移進各自的資料夾。

## 資料庫

資料庫是頁面裡的一個 `base` 區塊，或在分頁中開啟的 `.base` 檔案。它的篩選條件決定選哪些筆記：每篇筆記是一列，筆記 front matter 裡的屬性就是欄。輸入 `/` 選 **新增資料庫…**（或 **外掛程式 › 新增資料庫…**），會替資料庫建立一個資料夾，裡面有一個放著這個區塊的頁面。

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

- **檢視** 是區塊頂端的分頁：表格、看板、日曆、畫廊（Bases 的 `cards`）和清單。在檢視上按右鍵會開啟它的選單：版面、重新命名、刪除。**+** 新增一個檢視。日曆是 Textus 自己的檢視；Obsidian 會把它當成不認得的檢視來顯示。
- **每一列都是一篇筆記。** 點一下儲存格就能修改，屬性會寫進那篇筆記的 front matter。**新增** 會在資料庫的資料夾裡建立一篇筆記。一列會像檔案一樣在分頁中開啟。
- **欄**：點欄的標頭，可以依它排序、篩選、改變類型、重新命名、隱藏，或從每一列刪除這個屬性；**+** 新增一個屬性。拖曳標頭可以移動欄，拖曳它的右邊緣可以設定寬度（在邊緣上按兩下，就會重新符合內容）。順序和寬度保存在資料庫裡，寬度寫成 Obsidian 的 `columnSize`。
- **看板**：把卡片拖到另一個清單，就會改變它的值。按住清單頂端拖曳，可以把清單排成你要的順序（`groupOrder`）。
- **日曆**：列依某個日期屬性排在日曆上；點某一天，就會在那個日期新增一列。
- **篩選**、**排序** 和欄選單的設定，都以 Bases 的寫法保存在檢視裡：`status == "Read"`、`tags.contains("ml")`、`due.isEmpty()`。Textus 還讀不懂的篩選條件會原樣保留，並在工具列下方註明。
- **在文件裡的大小**：資料庫和文字一樣寬（開啟 **寬螢幕顯示** 時和窗格一樣寬），欄比較寬時可以左右捲動；高度隨列數增加，最高到 Textus 對區塊的限制（視窗的 70%，最多 1200 px），超過後在裡面捲動，底部還有內容時會漸漸淡出。
- **很長的資料庫** 先顯示前 25 列（或檢視的 `limit`）；往下捲動時載入其餘的列，表格的標頭會一直留在畫面上。滑鼠移到區塊上時，左側的箭頭可以把它摺成一行；摺疊狀態和你離開時所在的檢視只保存在這台裝置上。
- **公式**（資料庫裡的 `formulas:`）會針對每一列算出結果，可以當作欄、篩選和排序使用：`(price / pages).toFixed(2)`。匯總列目前還不會畫出來。
- 資料夾是 Obsidian 儲存庫時，**屬性類型** 採用 Obsidian 的設定，來自 `.obsidian/types.json`。
- **在嵌入的筆記裡**（`![[page]]`），資料庫只顯示成一行；點一下才會畫出來。
- **從 Dataview 轉換**：把游標放進 ` ```dataview ` 區塊，執行 **外掛程式 › 把 Dataview 查詢轉成 Base**。帶有 `FROM`、`WHERE`、`SORT` 和 `LIMIT` 的 `TABLE` 和 `LIST`，會在區塊原處變成同樣的資料庫；`TASK`、`GROUP BY`、`FLATTEN` 和 `dataviewjs` 會被拒絕並說明原因，什麼都不會改變。

Notion 的匯出檔透過 **Notion 匯入** 外掛帶進來，它寫出的頁面和資料庫都能由這個外掛顯示。

## 權限

- **讀寫開啟的資料夾中的檔案**：讀取筆記和它們的屬性，建立頁面和資料庫，把儲存格的修改寫進 front matter，以及連同連結一起移動或重新命名頁面。
- **讀取和編輯文件**：插入新的資料庫或子頁面和它的連結，以及把 Dataview 區塊轉成資料庫。
- **Textus AI 工具**：讓 Textus AI 能建立資料庫和頁面、讀取列和新增列。

## 更新紀錄

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
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `create_database`：以 Obsidian 的 Bases 格式建立一個資料庫：一個資料夾，裡面每篇筆記的開頭屬性就是它的各項屬性；資料夾裡再放一個頁面，用 ```base 區塊把它們顯示成表格、看板、日曆、畫廊或清單。回傳這個頁面的連結，放在使用者想要的位置。
- `query_rows`：讀取一個資料庫的列：它的 base 選中的筆記（預設是它資料夾裡的筆記），每列附名稱、路徑和屬性，可篩選和排序。
- `add_row`：在資料庫中新增一列：在其資料夾裡新建一份以該列命名的文件，各項屬性寫在開頭屬性中。展示該資料夾的每個區塊都會顯示它。 只用於資料庫資料夾（create_database、query_rows）；一般待辦用 add_task。
- `create_page`：新建一個頁面：在開啟的資料夾頂層新建以該標題命名的文件，或在父頁面旁的同名資料夾中新建子頁面；可設圖示。回傳它的路徑，以及要放進父頁面的 [[連結]]。
<!-- /ai-tools -->

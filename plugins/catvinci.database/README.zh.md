# 知识库

页面里套页面，再把笔记做成表格、看板、日历、画廊和列表形式的数据库，全部是普通 Markdown 文件。

数据库使用 **Obsidian 的 Bases 格式**（` ```base ` 代码块和 `.base` 文件），在 Obsidian 里也能打开同一个数据库。

## 页面

- **有子页面的页面是一个文件夹**：`Plans/Plans.md` 是页面本身，子页面放在同一个 `Plans/` 文件夹里，和 Obsidian 的“文件夹笔记”一样。输入 `/` 选 **新建子页面…**，或选 **插件 › 新建子页面…**。第一个子页面会自动把 `Plans.md` 移进它的文件夹，指向它的链接跟着更新。
- **侧边栏的「页面树」标签**把文件夹显示成页面树。右键一个页面可以新建子页面、重命名、设图标或移到废纸篓（连同下面的页面，会先确认）；把页面拖到另一个页面上，它就成了那个页面的子页面。移动后链接都会跟着更新。
- **页面图标**：**设置页面图标…**（在「插件」菜单里，或在「文件」标签里右键一篇文档）选一个表情符号，存在页面 front matter 的 `icon` 里。
- **页面树还是文件树？** 「页面树」按页面和它下面的内容显示，和 Notion 一样；「文件」按磁盘上的文件和文件夹原样显示。两边是同一批文件，用哪个都行。
- **当前位置**：在子页面里，状态栏会显示上级页面，例如 `Life › 2026 Calendar › Week 1`。
- **在「文件」里改页面文件夹的名字**，里面的页面会跟着改名，仍然是一个带子页面的页面。
- **旧的结构**：`Plans.md` 旁边放一个 `Plans/` 文件夹装子页面，也照样能读。**插件 › 整理为文件夹单元…** 会先列出清单，再一次把它们都移进各自的文件夹。

## 数据库

数据库就是页面里的一个 `base` 代码块，或在标签页里打开的一个 `.base` 文件。它的筛选条件选出笔记：每篇笔记是一行，笔记开头的属性就是各列。输入 `/` 选 **新建数据库…**（或 **插件 › 新建数据库…**）：会为数据库建一个文件夹，里面放一个装着这个代码块的页面。

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

- **视图**是代码块顶部的标签：表格、看板、日历、画廊（Bases 里的 `cards`）和列表。右键一个视图打开它的菜单：换布局、重命名、删除。点 **+** 添加视图。日历是 Textus 自己的，Obsidian 会把它当成不认识的视图。
- **每一行都是一篇笔记。** 点单元格修改，属性写进那篇笔记的开头；**新建** 在数据库的文件夹里建一篇笔记。一行会像文件一样在标签页里打开。
- **列**：点列头可以按它排序、筛选、改类型、重命名、隐藏，或从所有行删除这个属性；**+** 添加属性。拖动列头可以移动这一列，拖动列头右边缘可以调宽度（双击边缘恢复自动宽度）。列的顺序和宽度都存在 base 里，宽度用 Obsidian 的 `columnSize`。
- **看板**：把卡片拖到另一列就改了它的值；按住列头拖动，可以按你想要的顺序排列各列（`groupOrder`）。
- **日历**：按一个日期属性把行排进日历；点某一天，就新建一行，日期为那一天。
- **筛选**、**排序**和列菜单里的设置，都按 Bases 的写法存在视图里，例如 `status == "Read"`、`tags.contains("ml")`、`due.isEmpty()`。Textus 暂时读不懂的筛选会原样保留，并在工具栏下方说明。
- **在文档里的大小**：数据库和正文一样宽（选了 **wide** 就和窗格一样宽），列放不下时横向滚动；高度随行数增长，到 Textus 给块的上限（窗口高度的 70%，最多 1200 像素）后在里面滚动，下面还有行时底部渐隐。
- **很长的数据库**先显示前 25 行（或视图里设的 `limit`），往下滚动会自动加载其余的，表头一直留在上方。鼠标移到数据库左侧会出现折叠把手，点一下折成一行；折叠状态和最后看的视图只记在这台设备上。
- **公式**（base 里的 `formulas:`）会为每一行算出结果，可以当列显示，也能用来筛选和排序，例如 `(price / pages).toFixed(2)`。汇总（summaries）暂时还不显示。
- **属性类型**在 Obsidian 库里使用 Obsidian 自己的 `.obsidian/types.json`。
- **在嵌入的笔记里**（`![[页面]]`），数据库只占一行，点一下才画出来。
- **从 Dataview 转过来**：把光标放进 ` ```dataview ` 代码块，运行 **插件 › 把 Dataview 查询转成 Base**。带 `FROM`、`WHERE`、`SORT`、`LIMIT` 的 `TABLE` 和 `LIST` 会在原处变成同样的 base；`TASK`、`GROUP BY`、`FLATTEN` 和 `dataviewjs` 不转换，会说明原因，原文不变。

Notion 的导出包请用 **Notion 导入** 插件导入，它写出的页面和数据库就由这个插件显示。

## 权限

- **读写打开的文件夹中的文件**：读取笔记和属性，新建页面和数据库，把单元格的修改写进 front matter，移动或重命名页面并更新链接。
- **读取和编辑文档**：插入新数据库或子页面的链接，把 Dataview 代码块转成 base。
- **Textus AI 工具**：让 Textus AI 能新建数据库和页面、读取和添加行。

## 更新日志

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

装上这个插件后，Textus AI 在对话中可以使用：

- `create_database`：以 Obsidian 的 Bases 格式建一个数据库：一个文件夹，里面每篇笔记的开头属性就是它的各项属性；文件夹里再放一个页面，用 ```base 块把它们显示成表格、看板、日历、画廊或列表。返回这个页面的链接，放在用户想要的位置。
- `query_rows`：读取一个数据库的行：它的 base 选中的笔记（默认是它文件夹里的笔记），每行带名字、路径和属性，可筛选和排序。
- `add_row`：在数据库中添加一行：在其文件夹里新建一篇以该行命名的文档，各项属性写在开头属性中。展示该文件夹的每个块都会显示它。 只用于数据库文件夹（create_database、query_rows）；普通待办用 add_task。
- `create_page`：新建一个页面：在打开的文件夹顶层新建以该标题命名的文档，或在父页面旁的同名文件夹中新建子页面；可设图标。返回它的路径，以及要放进父页面的 [[链接]]。
<!-- /ai-tools -->

# 위키

페이지 안의 페이지, 그리고 노트를 표·보드·캘린더·갤러리·목록으로 보여 주는 데이터베이스. 모두 일반 Markdown 파일입니다.

데이터베이스는 **Obsidian의 Bases 형식**(` ```base ` 블록과 `.base` 파일)으로 쓰기 때문에 Obsidian에서도 같은 데이터베이스가 열립니다.

## 페이지

- **하위 페이지가 있는 페이지는 폴더입니다**: `Plans/Plans.md`가 페이지이고, 하위 페이지는 그 옆 `Plans/` 안에 있습니다. Obsidian의 폴더 노트와 같은 방식입니다. `/`를 입력하고 **새 하위 페이지…**를 고르거나 **플러그인 › 새 하위 페이지…**를 씁니다. 첫 하위 페이지를 만들면 `Plans.md`를 그 폴더로 알아서 옮기고, 그 페이지로 가는 링크도 따라 바뀝니다.
- 사이드바의 **페이지 탭**은 폴더를 페이지 트리로 보여 줍니다. 페이지를 오른쪽 클릭하면 하위 페이지를 만들거나, 이름을 바꾸거나, 아이콘을 붙이거나, 휴지통으로 옮길 수 있습니다(아래 페이지까지 함께, 먼저 물어본 뒤). 페이지를 다른 페이지 위로 끌어 놓으면 그 페이지의 하위 페이지가 됩니다. 어떻게 옮기든 링크가 따라 바뀝니다.
- **페이지 아이콘**: **페이지 아이콘 설정…**(플러그인 메뉴, 또는 **파일** 탭에서 문서를 오른쪽 클릭)으로 이모지를 고르면 페이지의 프런트 매터에 `icon`으로 저장됩니다.
- **페이지 탭과 파일 탭**: 페이지 탭은 Notion처럼 페이지와 그 아래에 있는 것을 보여 주고, 파일 탭은 디스크에 있는 그대로 모든 파일과 폴더를 보여 줍니다. 같은 파일이니 편한 쪽을 쓰면 됩니다.
- **지금 있는 곳**: 하위 페이지에서는 상태 표시줄에 위쪽 페이지가 보입니다. `Life › 2026 Calendar › Week 1`.
- 파일 탭에서 **페이지의 폴더 이름을 바꾸면** 페이지 이름도 함께 바뀌어, 하위 페이지가 있는 페이지로 그대로 남습니다.
- **예전 배치**: `Plans.md` 옆 `Plans/` 폴더에 하위 페이지가 있는 경우도 똑같이 읽습니다. **플러그인 › 페이지를 폴더로 정리…**는 목록을 보여 준 뒤 그런 페이지를 한 번에 각자의 폴더로 옮깁니다.

## 데이터베이스

데이터베이스는 페이지 안의 `base` 블록이거나, 탭에서 연 `.base` 파일입니다. 필터로 노트를 고릅니다. 노트 하나가 한 행이고, 프런트 매터의 속성이 열입니다. `/`를 입력하고 **새 데이터베이스…**를 고르면(또는 **플러그인 › 새 데이터베이스…**) 데이터베이스용 폴더와, 블록을 담은 페이지가 만들어집니다.

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

- **보기**는 블록 위쪽의 탭입니다: 표, 보드, 캘린더, 갤러리(Bases의 `cards`), 목록. 보기를 오른쪽 클릭하면 배치 바꾸기, 이름 바꾸기, 삭제가 있는 메뉴가 열립니다. **+**로 보기를 추가합니다. 캘린더는 Textus만의 보기라 Obsidian에서는 모르는 보기로 나옵니다.
- **모든 행은 노트입니다.** 칸을 클릭해 고치면 그 노트의 프런트 매터에 속성이 써집니다. **새로 만들기**는 데이터베이스 폴더에 노트를 만듭니다. 행은 파일처럼 탭에서 열립니다.
- **열**: 열 머리를 클릭해 정렬, 필터, 유형 바꾸기, 이름 바꾸기, 숨기기를 하거나 모든 행에서 속성을 삭제합니다. **+**로 속성을 추가합니다. 머리를 끌어 열을 옮기고, 오른쪽 가장자리를 끌어 너비를 정합니다(가장자리를 더블클릭하면 처음 너비로 돌아갑니다). 열 너비는 데이터베이스 너비가 바뀌어도 그대로입니다. 순서와 너비는 데이터베이스에 저장되며, 너비는 Obsidian의 `columnSize`로 저장됩니다.
- **보드**: 카드를 다른 목록으로 끌어 값을 바꿉니다. 목록 머리를 끌어 목록 순서를 원하는 대로 바꿉니다(`groupOrder`).
- **캘린더**: 날짜 속성에 따라 행이 놓입니다. 날을 클릭하면 그 날짜로 행을 만듭니다.
- **필터**, **정렬**, 열 메뉴는 Bases가 쓰는 방식 그대로 보기에 저장됩니다: `status == "Read"`, `tags.contains("ml")`, `due.isEmpty()`. Textus가 아직 읽지 못하는 필터는 그대로 두고 막대 아래에 알려 줍니다.
- **문서 안에서의 크기**: 데이터베이스는 글 너비만큼(**넓게 보기**로 하면 창 너비만큼) 넓고, 열이 더 넓으면 옆으로 스크롤됩니다. 높이는 행만큼이지만 Textus의 블록 한도(창의 70%, 최대 1200px)를 넘으면 안에서 스크롤됩니다. 이때 표와 목록은 행 사이에서 끊기고 행 중간에서는 끊기지 않습니다. 다른 보기는 아래에 더 있을 때 아래쪽이 흐려집니다.
- **긴 데이터베이스**는 처음 25행(또는 보기의 `limit`)을 보여 주고, 아래로 스크롤하면 나머지를 불러옵니다. 표 머리는 계속 보입니다. 포인터를 올렸을 때 블록 왼쪽에 나오는 꺾쇠로 블록을 한 줄로 접습니다. 접힌 상태와 마지막 보기는 이 기기에만 저장됩니다.
- **수식**(데이터베이스의 `formulas:`)은 행마다 계산되며 열, 필터, 정렬에 쓸 수 있습니다: `(price / pages).toFixed(2)`. 요약은 아직 표시하지 않습니다.
- 폴더가 보관소이면 **속성 유형**은 `.obsidian/types.json`에 있는 Obsidian의 유형을 씁니다.
- **넣어 보인 노트**(`![[page]]`) 안에서는 데이터베이스가 한 줄로 나오고, 클릭하면 그려집니다.
- **Dataview에서**: ` ```dataview ` 블록에 커서를 두고 **플러그인 › Dataview 쿼리를 Base로 변환**을 실행합니다. `FROM`, `WHERE`, `SORT`, `LIMIT`이 있는 `TABLE`과 `LIST`는 그 자리에서 같은 데이터베이스로 바뀝니다. `TASK`, `GROUP BY`, `FLATTEN`, `dataviewjs`는 이유를 알려 주고 거절하며, 아무것도 바꾸지 않습니다.

Notion 내보내기는 **Notion 가져오기** 플러그인으로 들어옵니다. 이 플러그인은 위키가 보여 주는 페이지와 데이터베이스를 씁니다.

## 권한

- **열린 폴더의 파일 읽기와 쓰기**: 노트와 속성을 읽고, 페이지와 데이터베이스를 만들고, 칸에서 고친 내용을 프런트 매터에 쓰고, 페이지를 링크와 함께 옮기거나 이름을 바꾸기 위해.
- **문서 읽기와 편집**: 새 데이터베이스나 하위 페이지와 그 링크를 넣고, Dataview 블록을 데이터베이스로 바꾸기 위해.
- **Textus AI 도구**: Textus AI가 데이터베이스와 페이지를 만들고, 행을 읽고 추가할 수 있도록.

## 변경 내역

- **0.8.3** - The bar stays on one line when there is room: in a zoomed block on a Mac it folded the view tabs into one button and put the sorts on a line of their own, and measured itself many times on every click. A table or list taller than Textus lets a block be ends between two rows instead of through one; other views fade at the foot while more is below. A column keeps its width however wide the block is, instead of stretching to fill it. By touch, a board card or lane lifts after a short hold, so a swipe scrolls instead of dragging. Its page is in every language Textus speaks. Its tools for Textus AI are described in every language, and in Chinese a database is 数据库 while 知识库 is the plugin's name.
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
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `create_database`: Obsidian의 Bases 형식으로 데이터베이스를 만듭니다. 프런트 매터에 각자의 속성을 담은 노트들의 폴더와, 그 안에 ```base 블록으로 그 노트들을 표·보드·달력·갤러리·목록으로 보여 주는 페이지입니다. 그 페이지로 가는 링크를 돌려주니 사용자가 원하는 곳에 넣습니다.
- `query_rows`: 데이터베이스의 행을 읽습니다. 그 base가 고르는 노트(기본은 그 폴더의 노트)를 이름·경로·속성과 함께, 걸러 내고 정렬해서 돌려줍니다.
- `add_row`: 데이터베이스에 행을 추가합니다. 그 폴더에 행 이름의 문서를 만들고 속성을 프런트 매터에 적습니다. 그 폴더를 보여 주는 모든 블록에 나타납니다. 데이터베이스 폴더(create_database, query_rows) 전용입니다. 일반 할 일은 add_task입니다.
- `create_page`: 페이지를 만듭니다. 열린 폴더 맨 위에 그 제목의 문서를 만들거나, 부모 페이지 옆 폴더에 하위 페이지를 만들고, 아이콘이 있으면 붙입니다. 경로와 부모 페이지에 넣을 [[링크]]를 돌려줍니다.
<!-- /ai-tools -->

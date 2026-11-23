# Вики

Страницы внутри страниц и базы данных из ваших заметок в виде таблиц, досок, календарей, галерей и списков — всё в обычных файлах Markdown.

Базы данных записываются в **формате Bases из Obsidian** (блоки ` ```base ` и файлы `.base`), поэтому Obsidian открывает те же базы.

## Страницы

- **Страница с подстраницами — это папка**: `Plans/Plans.md` — сама страница, а её подстраницы лежат рядом в `Plans/`, как заметки папок в Obsidian. Наберите `/` и выберите **Новая подстраница…** или воспользуйтесь **Плагины › Новая подстраница…**. Первая подстраница сама переносит `Plans.md` в его папку, и ссылки на него обновляются.
- **Вкладка «Страницы»** на боковой панели показывает папку деревом страниц. Щёлкните по странице правой кнопкой, чтобы создать подстраницу, переименовать страницу, дать ей значок или переместить в корзину (вместе со страницами под ней, после вопроса). Перетащите страницу на другую, чтобы сделать её подстраницей той. Ссылки следуют за каждым перемещением.
- **Значки страниц**: **Значок страницы…** (в меню «Плагины» или по правому щелчку на документе во вкладке «Файлы») выбирает эмодзи, который хранится как `icon` во front matter страницы.
- **Страницы или файлы?** Вкладка «Страницы» показывает страницы и то, что под ними, как в Notion; вкладка «Файлы» показывает все файлы и папки такими, какие они на диске. Пользуйтесь любой: это одни и те же файлы.
- **Где вы находитесь**: в подстранице строка состояния показывает страницы над ней — `Life › 2026 Calendar › Week 1`.
- **Переименование папки страницы** во вкладке «Файлы» переименовывает и саму страницу, чтобы она оставалась страницей с подстраницами.
- **Старое расположение**: `Plans.md` с подстраницами в папке `Plans/` рядом читается так же. **Плагины › Разложить страницы по папкам…** сразу переносит каждую такую страницу в её папку, предварительно показав список.

## Базы данных

База данных — это блок `base` на странице или файл `.base`, открытый во вкладке. Её фильтры выбирают заметки: каждая заметка — строка, а свойства из её front matter — столбцы. Наберите `/` и выберите **Новая база данных…** (или **Плагины › Новая база данных…**): плагин создаст для базы папку со страницей, в которой лежит блок.

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

- **Виды** — это вкладки вверху блока: Таблица, Доска, Календарь, Галерея (`cards` в Bases) и Список. Щёлкните по виду правой кнопкой, чтобы открыть его меню: раскладка, переименование, удаление. **+** добавляет вид. Календарь — собственный вид Textus; Obsidian показывает его как незнакомый вид.
- **Каждая строка — это заметка.** Щёлкните по ячейке, чтобы изменить её; свойство записывается во front matter этой заметки. **Создать** создаёт заметку в папке базы. Строка открывается во вкладке, как файл.
- **Столбцы**: щёлкните по заголовку столбца, чтобы отсортировать по нему, отфильтровать, сменить тип, переименовать, скрыть или удалить свойство из всех строк; **+** добавляет свойство. Перетащите заголовок, чтобы переместить столбец, и его правый край, чтобы задать ширину (двойной щелчок по краю возвращает начальную ширину). Столбец сохраняет ширину, какой бы широкой ни была база. Порядок и ширина хранятся в базе, ширина — как `columnSize` из Obsidian.
- **Доска**: перетащите карточку в другой список, чтобы изменить её значение. Перетащите список за заголовок, чтобы расставить списки в нужном порядке (`groupOrder`).
- **Календарь**: строки расставляются по свойству-дате; щёлкните по дню, чтобы создать строку с этой датой.
- **Фильтр**, **Сортировка** и меню столбцов сохраняются в виде так, как их пишет Bases: `status == "Read"`, `tags.contains("ml")`, `due.isEmpty()`. Фильтры, которые Textus пока не понимает, остаются как есть, и об этом сказано под панелью.
- **Размер в документе**: база данных шириной с текст (или с панель, если выбрано **Во всю ширину**) и прокручивается вбок, когда столбцы шире; по высоте она растёт вместе со строками до предела Textus для блока (70% окна, не больше 1200 пикселей), а дальше прокручивается внутри. Таблица или список тогда обрываются между строками, а не посреди строки; у других видов нижний край бледнеет, пока ниже есть ещё что-то.
- **Длинные базы данных** показывают первые 25 строк (или `limit` вида); при прокрутке вниз подгружаются остальные, а заголовок таблицы остаётся на виду. Стрелка слева от блока при наведении сворачивает его в одну строку; свёрнутость и вид, на котором вы его оставили, хранятся только на этом устройстве.
- **Формулы** (`formulas:` в базе) вычисляются для каждой строки и могут быть столбцами, фильтрами и сортировками: `(price / pages).toFixed(2)`. Итоги пока не показываются.
- **Типы свойств** берутся из Obsidian, из `.obsidian/types.json`, если папка — хранилище Obsidian.
- **Во встроенной заметке** (`![[page]]`) база данных занимает одну строку; щёлкните по ней, чтобы её нарисовать.
- **Из Dataview**: поставьте курсор в блок ` ```dataview ` и выполните **Плагины › Преобразовать запрос Dataview в базу**. `TABLE` и `LIST` с `FROM`, `WHERE`, `SORT` и `LIMIT` становятся такой же базой данных на месте блока; `TASK`, `GROUP BY`, `FLATTEN` и `dataviewjs` отклоняются с объяснением причины, и ничего не меняется.

Экспорт Notion переносится плагином **Импорт из Notion**, который записывает страницы и базы данных, показываемые этим плагином.

## Разрешения

- **Чтение и запись файлов в открытой папке**: чтобы читать заметки и их свойства, создавать страницы и базы данных, записывать изменения ячеек во front matter, а также перемещать и переименовывать страницы вместе со ссылками на них.
- **Чтение и правка документа**: чтобы вставлять новую базу данных или подстраницу и ссылку на неё и превращать блок Dataview в базу данных.
- **Инструменты для Textus AI**: чтобы Textus AI мог создавать базы данных и страницы, читать строки и добавлять их.

## Изменения

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
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `create_database`: Создаёт базу данных в формате Bases из Obsidian: папку заметок, во front matter которых лежат их свойства, и в ней страницу с блоком ```base, показывающим их таблицей, доской, календарём, галереей или списком. Возвращает ссылку на эту страницу, чтобы вставить её туда, куда хочет пользователь.
- `query_rows`: Читает строки базы данных - заметки, которые выбирает её base, по умолчанию те, что в её папке, - каждую с именем, путём и свойствами, с фильтрами и сортировкой.
- `add_row`: Добавляет строку в базу данных: документ в её папке с именем строки и свойствами во front matter. Её покажет каждый блок, показывающий эту папку. Только для папки базы данных (create_database, query_rows); обычная задача — add_task.
- `create_page`: Создаёт страницу: документ с этим заголовком в корне открытой папки или подстраницу в папке рядом с родительской страницей, со значком, если он задан. Возвращает её путь и [[ссылку]] для родительской страницы.
<!-- /ai-tools -->

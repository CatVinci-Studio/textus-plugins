# Граф заметок

Рисует ваши заметки и связи между ними в виде графа: для всей папки или вокруг открытого документа.

- **Ctrl+Alt+G** (**⌘⌥G** на Mac) или **Плагины › Открыть граф заметок** показывает всю папку во вкладке. **Вписать** помещает весь граф на экран.
- Вкладка **Граф** в боковой панели показывает заметки вокруг открытого документа. Кнопка вверху панели «Граф» в боковой панели открывает всю папку.
- Считаются и [[вики-ссылки]], и ссылки на другие документы; две заметки, ссылающиеся друг на друга, соединены одной линией. [[Ссылка]] на ещё не написанную заметку показана как отдельная заметка.
- Щелчок по заметке открывает её. Перетаскивайте заметку, чтобы поставить её на место, фон — чтобы двигаться, а колесо или щипок меняют масштаб. Наведите указатель на заметку, чтобы подсветить её связи. На сенсорном экране первое касание заметки подсвечивает её связи, второе открывает её.
- Граф подстраивается сам: при приближении появляются названия, стрелки показывают направление ссылок, когда их немного, а заметка с большим числом связей крупнее. Без цветовых групп каждая заметка получает цвет своей папки.
- Когда документы в папке меняются, граф перерисовывается.

## Настройки

Кнопка с ползунками вверху полного графа открывает его настройки; у графа в боковой панели их нет.

- **Фильтры**: поиск (`path:ideas`, `file:draft`, `tag:#todo`, `-` в начале исключает); **Теги** показывает #теги как узлы; **Только существующие файлы** скрывает ещё не написанные заметки; **Заметки без связей** (полный граф) показывает заметки без ссылок.
- **Группы**: окрашивают заметки, найденные поиском. **Новая группа** добавляет группу; **Восстановить по умолчанию** отменяет ваши изменения.

В хранилище Obsidian заметки окрашивают и цветовые группы из `graph.json` Obsidian — после ваших собственных.

## Разрешения

- Чтение файлов и документа: чтобы найти заметки и ссылки папки и `graph.json` Obsidian.
- Инструменты для Textus AI: чтобы Textus AI видел заметки вокруг документа.

## Изменения

- **0.5.10** - By touch, a first tap on a note lights it and its links and a second opens it; notes are easier to hit with a finger, and a second finger zooms instead of also moving the graph. Its settings open in Textus's own popover.
- **0.5.9** - Esc while dragging a note or the view puts it back, and a touch the system cancels no longer leaves a drag stuck.
- **0.5.8** - The graph in the sidebar spreads out to fit its panel, instead of starting as a small clump with labels on top of each other. Sorts names with Textus's own order instead of a copy of it, so the package is smaller.
- **0.5.7** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.5.6** - The counts and buttons at the top of the graph tab stay in view: scrolling or pinching over the graph no longer pushes them up under the tab. Labels no longer pile on top of each other: the most linked notes keep theirs and the rest show as you zoom in. A big folder opens already laid out instead of unfolding, and pictures and other attachments a note links to stay out of the graph unless you turn on Attachments in its settings. Switching documents or saving no longer shakes the whole graph loose to settle again.
- **0.5.5** - Standard Markdown links to notes not written yet are placed as Textus places them, and merge with [[links]] to the same note. Fit spreads a small graph over the whole pane, so names no longer sit on each other. Ctrl/Cmd-click opens a note beside the one in front. Labels follow the interface text size, and folder colours follow the theme. The sidebar graph has no settings of its own any more.
- **0.5.4** - A trackpad pinch zooms smoothly, in step with the gesture; with Textus 1.3.13 a pinch on a Mac zooms the graph, not the document behind it. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.5.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.5.2** - Obsidian's colour groups come from the nearest vault, even one above the open folder. Needs Textus 1.3.10.
- **0.5.1** - In an Obsidian vault, the colour groups in `.obsidian/graph.json` colour the notes too.
- **0.5.0** - [[Links]] are matched to notes the same way Textus matches them when you click one.
- **0.4.0** - Textus AI can see the notes around a document (`list_neighbours`).
- **0.3.0** - Textus's own controls and menus; colours from the theme.
- **0.2.0-0.2.1** - A settings panel with filters, search and colour groups; tags as nodes; arrows for link direction; the sidebar graph's depth.
- **0.1.0-0.1.1** - First versions: the whole folder in a tab and the notes around the open document in the sidebar, coloured by folder, smooth with thousands of notes.

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `list_neighbours`: Окрестность документа в графе заметок - переднего, если путь не указан: заметки в нескольких ссылках от него в любую сторону, с расстоянием в ссылках, и ссылки между ними. [[Ссылка]] на несуществующую заметку имеет вид missing.
<!-- /ai-tools -->

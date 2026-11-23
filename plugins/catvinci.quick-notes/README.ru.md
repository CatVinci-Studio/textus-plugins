# Быстрые заметки

Запишите мысль, не уходя из документа; заметка попадёт в файл «Входящие» вашей папки или в сегодняшнюю ежедневную заметку.

- **Ctrl+Alt+N** (**⌘⌥N** на Mac) или **Плагины › Новая быстрая заметка…** спрашивает текст заметки и сохраняет её.
- На компьютере **Новая быстрая заметка…** есть и в значке в трее или в строке меню. Плагин просит Textus работать в фоне, поэтому команда доступна, даже если все окна закрыты.
- Вкладка **Быстрые заметки** в боковой панели показывает заметки, новые сверху. Нажмите **Новая**, чтобы написать заметку прямо там, или правьте заметку прямо в списке.
- В меню действий каждой заметки (кнопка «ещё» или правый щелчок) есть **Вставить** (в место курсора в документе), **Открыть** и **Удалить**. Заметка, хранящаяся в документе, открывается там, на своей строке.
- Удалили по ошибке? **Отменить** внизу вернёт её в течение нескольких секунд. Новая заметка, оставленная пустой, исчезает сама.
- Когда заметок шесть или больше, вверху появляется поле поиска.

## Где хранятся заметки

Заметки хранятся в документе открытой папки, поэтому их видят Obsidian и Cloud Sync. Выберите место в пункте **Сохранять заметки в** в настройках плагина:

- **Файл «Входящие»** (по умолчанию): `Inbox.md` в корне папки или другой документ, указанный в **Файл «Входящие»**. Каждая заметка добавляется в конец как пункт списка с датой и временем, например `- 2026-11-08 14:05 Позвонить Анне`.
- **Сегодняшняя ежедневная заметка**: под заголовком `## Быстрые заметки` (на языке интерфейса), который добавляется, если его нет. У каждой заметки есть время, например `- 14:05 Позвонить Анне`. Папка, имя и шаблон ежедневной заметки следуют настройкам ежедневных заметок папки, например Obsidian; без них это `Daily/YYYY-MM-DD.md`.

Измените файл, и боковая панель последует за ним. Заметки из старых версий переносятся туда один раз, от старых к новым. Если папка не открыта, заметки остаются в Textus.

Работает на компьютере, iPhone, iPad и Android. На телефоне **Новая быстрая заметка…** находится в **Плагины** в меню строки заголовка, а действия с заметкой — под её кнопкой «ещё». Трея там нет, поэтому плагин не просит оставлять Textus работать в фоне.

## Разрешения

- Чтение и запись файлов: для файла «Входящие» или ежедневной заметки.
- Правка документа: чтобы вставить заметку в место курсора.
- Инструменты для Textus AI: чтобы Textus AI мог добавить быструю заметку.

## Изменения

- **0.6.0** - On iPhone, iPad and Android too: **New Quick Note…** under Plugins and the sidebar tab, with New and each note's more button easy to tap. Only the desktop asks to keep Textus running in the background. Needs Textus 1.4.7.
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
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `add_note`: Добавляет быструю заметку в начало списка быстрых заметок на боковой панели, чтобы потом вставить её в документ или открыть как документ. Сегодняшний дневник — append_to_daily_note; задача — add_task.
<!-- /ai-tools -->

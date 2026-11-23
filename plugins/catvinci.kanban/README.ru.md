# Доска задач

Раскладывайте работу по карточкам и спискам на доске, которая хранится как обычный файл Markdown.

- **Плагины › Новая доска задач…** спрашивает имя и создаёт _имя_.md в открытой папке, с `kanban-plugin: board` во front matter и тремя списками: «Сделать», «В работе» и «Готово». Если доска с таким именем уже есть, открывается она.
- Любой файл .md с `kanban-plugin` во front matter открывается как доска. Так хранит доски и плагин Kanban для Obsidian, поэтому каждое приложение открывает доски другого. Старые доски с именем _имя_.kanban.md тоже открываются как доски.
- Каждый список — это заголовок в файле, а каждая карточка — задача под ним, поэтому доску легко читать где угодно.

## На доске

- **Добавить карточку** можно внизу списка. Щёлкните по тексту карточки, чтобы изменить его, и отметьте флажок, когда она готова. Её кнопка ⋯ (или правый щелчок) переносит карточку в другой список или удаляет её; «Отменить» в появившемся уведомлении возвращает её.
- **Добавить список** создаёт новый список и сразу предлагает ввести его название. Щелчок по названию списка позволяет переименовать его; пустой список можно удалить из его меню ⋯.
- На телефоне каждый список занимает весь экран: смахните, чтобы перейти к следующему.
- Перетаскивайте карточки внутри списка и между списками, а список — за его заголовок, чтобы поменять порядок. Остальные расступаются, пока вы тянете. На сенсорном экране задержите палец на карточке и потом тяните; у края экрана телефона доска перелистывается к следующему списку. Если задержать палец и отпустить, не сдвигая, откроется меню карточки.
- Напишите в карточке [[ссылку]] и щёлкните по ней, чтобы открыть эту заметку.
- **Редактировать как Markdown** открывает файл как текст. Доска следит за изменениями, сделанными там или где-то ещё.
- То, что Kanban для Obsidian хранит в файле помимо списков, например свои настройки и отметку списка готовых, остаётся как есть.

```markdown
---
kanban-plugin: board
---

## Сделать

- [ ] Написать план

## Готово

- [x] Выбрать название
```

## Разрешения

- Чтение и запись файлов: чтобы открывать и сохранять доски.
- Инструменты для Textus AI: чтобы Textus AI мог находить и читать доски, добавлять и перемещать карточки.

## Изменения

- **0.4.14** - On a phone or tablet, hold a card a moment to drag it within a list or to another; at the screen's edge on a phone the board turns to the next list, and the page no longer scrolls under the card. Held and let go without moving, a card opens its menu. Dragged near the board's edge, the board scrolls, and a card let go below a short list goes into that list.
- **0.4.13** - A card's ⋯ menu (or a right-click) moves it to another list or deletes it, with Undo, instead of an × that deleted at once - always showing on a touch screen. A new list starts with its name being written. On a phone a list fills the screen and a swipe settles on the next; in a narrow tab, Edit as Markdown goes into the ⋯ menu.
- **0.4.12** - Cards and lists make way at the pace of the rest of Textus.
- **0.4.11** - A list dragged by its head lifts and slides along the board as Textus's own tabs do; Esc puts it back.
- **0.4.10** - A card's checkbox sits on the middle of its first line at any text size.
- **0.4.9** - Right-clicking a card or list name while you edit it (to paste) no longer ends the edit, and an input method's Enter on iPhone and iPad picks its words instead of saving. The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.4.8** - A board with Windows (CRLF) line endings keeps them, and a board changed while you edit (saved as Markdown in Textus, or by a plugin) shows that change instead of writing over it, and says so. The store description now opens with what the plugin does.
- **0.4.7** - A blank line inside a card no longer splits it, and Escape no longer leaves an empty card. The AI leaves ordinary notes alone, and the board fits narrow panels.
- **0.4.6** - The board fades at its edges where lists run past the window.
- **0.4.5** - A dragged card or list stays right under the pointer and lifts like everything dragged in Textus. Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.4** - Dragging a card or a list no longer selects text on the way.
- **0.4.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.2** - Cards and lists follow the pointer as you drag, the others making way. Needs Textus 1.3.10.
- **0.4.1** - Keeps the mark Obsidian's Kanban puts on a done list.
- **0.4.0** - Renamed Task Board (was Kanban). New boards are plain .md files with `kanban-plugin` in their front matter, as Obsidian writes them; .kanban.md boards still open.
- **0.3.1** - Textus AI tells boards apart from tasks written in documents.
- **0.3.0** - Textus AI can list and read boards, add cards and move them.
- **0.2.0** - Textus's own controls and menus.
- **0.1.0-0.1.3** - First versions: boards as Markdown, cards dragged between lists, lists moved by their head, [[links]] that open notes, Edit as Markdown, changes made elsewhere shown at once, Obsidian's settings kept.

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `list_boards`: Перечисляет канбан-доски (файлы kanban-plugin .md) в открытой папке, каждую с её списками и числом карточек в них.
- `read_board`: Читает канбан-доску: её списки по порядку, в каждом текст карточек и отметку, выполнены ли они. Задачи в обычных документах — list_tasks.
- `add_card`: Добавляет карточку в конец списка на канбан-доске. Только для доски (kanban-plugin .md); задача в документе — add_task.
- `move_card`: Перемещает карточку на канбан-доске в другой список или на другое место в её собственном.
<!-- /ai-tools -->

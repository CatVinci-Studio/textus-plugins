# Задачи

Собирает все задачи папки в один список, где их можно отмечать, и позволяет делать запросы, как в Obsidian Tasks.

- Пишите задачу где угодно в виде `- [ ] что сделать`.
- Вкладка **Задачи** на боковой панели показывает задачи всех документов открытой папки — по документам и под заголовками, к которым они относятся.
- Отметьте задачу прямо там или щёлкните по ней, чтобы перейти к ней в документе.
- Укажите у задачи дату (`📅 2026-11-01`, `due:2026-11-01` или `[due:: 2026-11-01]`), и она появится значком. Просроченные задачи и задачи со сроком в ближайшую неделю идут первыми, в разделе **Скоро срок**.
- Поле сверху фильтрует список по словам, имени документа или заголовку.
- Выполненные задачи скрыты, пока вы не включите **Показывать выполненные задачи** в **Настройки › Расширения › Плагины › Задачи**.
- Карточки канбан-доски (документ с `kanban-plugin` в свойствах или `имя.kanban.md`) принадлежат доске и не попадают ни в список на боковой панели, ни в запросы задач.

## Задачи из Obsidian

Задачи, записанные плагином Tasks для Obsidian, работают здесь так же:

- `[/]` — в работе и ещё открыта; `[-]` — отменена и считается завершённой.
- Поля в конце задачи (📅 срок, ⏳ запланировано, 🛫 начало, ➕ создано, ✅ выполнено, ❌ отменено, приоритет 🔺 ⏫ 🔼 🔽 ⏬ и 🔁 повтор) остаются в файле и в списке не показываются.
- Отметка задачи дописывает ✅ и день; снятие отметки убирает дату выполнения или отмены.
- Отметка повторяющейся задачи добавляет следующую строкой выше, со сдвинутыми датами. Понимаются повторы вроде `🔁 every day`, `every 2 weeks`, `every weekday`, `every weekend`, `every Monday`, `every month on the 15th`, `every month on the last`, `every year` и `… when done`.

## Запросы задач

Блок кода `tasks` показывает нужные задачи, по одному правилу в строке, как в Obsidian:

````markdown
```tasks
not done
due before next week
path includes Projects
sort by due
```
````

- **Статус**: `done`, `not done` и `status.type is` (`todo`, `in_progress`, `done` или `cancelled`).
- **Даты**: `due`, `scheduled`, `starts`, `done`, `created`, `cancelled` или `happens` с `before`, `after`, `on`, `in`, `on or before` или `on or after` и датой: 2026-11-01, today, tomorrow, yesterday либо this, next или last с week, month или year. Также `no due date` и `has due date` (и так же для других дат).
- **Текст**: `path`, `folder`, `filename`, `description` или `heading` с `includes` или `does not include`; `tag includes`, `tag does not include`, `has tags` и `no tags`.
- **Другое**: `priority is` (также `above`, `below`, `not`), `is recurring` и `is not recurring`.
- **Порядок**: `sort by` и `group by` (status, due, scheduled, start, done, created, priority, path, folder, filename, heading или description, при желании с `reverse`) и `limit`. Без `sort by` задачи идут в порядке Obsidian Tasks: статус, срок, приоритет, путь.

Строки о внешнем виде (`hide …`, `show …`) пропускаются; любая другая непонятная строка названа под счётчиком. [[Ссылка]] в задаче открывает свою заметку. Отметьте задачу в блоке — она отметится в своём файле; щёлкните — и вы перейдёте к ней.

## Разрешения

Плагин читает документы папки, чтобы найти задачи, и пишет в документ, только чтобы отметить или добавить задачу. Ещё он даёт Textus AI инструменты, перечисленные ниже.

## Изменения

- **0.5.0** - A task query no longer lists a Kanban board's cards, as the sidebar and Textus AI already didn't. Grouped by document, its rows don't repeat the document's name, and a [[link]] in a task opens its note.
- **0.4.7** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.4.6** - The tasks block keeps a gap inside its frame, as other blocks do.
- **0.4.5** - The AI's new task under a heading never lands inside a code block, and **Move finished tasks to the end of their list** works in Windows (CRLF) notes.
- **0.4.4** - A task query in a document draws at the interface's text size, so a wider column shows more of it rather than larger text (Textus 1.4.1).
- **0.4.3** - Ticking a task with an HTML comment in it now works, and a refused tick tells you why. `group by status` sorts in the right order, task blocks fit narrow panes, due dates look like the sidebar's, and typing stays lighter.
- **0.4.2** - Shorter help and empty-state text.
- **0.4.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12. A new setting, **Move finished tasks to the end of their list**: a task ticked in a document or in the list goes after the open ones (it asks once to read and edit the document in front).
- **0.4.0** - Uses the dates built into Textus 1.3.10, which it now needs.
- **0.3.1** - Ships the updated shared date code; nothing else changed.
- **0.3.0** - Obsidian Tasks: `[/]` and `[-]`, the task fields, done dates, repeating tasks and `tasks` query blocks; boards marked with `kanban-plugin` are left out of the list.
- **0.2.1** - Cards on a Kanban board (`name.kanban.md`) are no longer listed.
- **0.2.0** - Textus AI can list, add and tick off tasks.
- **0.1.3** - The list follows the interface language when it changes.
- **0.1.2** - Due dates in local time; counts in each language's plural forms.
- **0.1.0-0.1.1** - First versions: every task in the folder in a sidebar list, ticked off or opened from there, with a filter, due dates and Due soon.

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `list_tasks`: Перечисляет задачи Markdown (- [ ] ...) в документах открытой папки - по умолчанию только незавершённые - с текстом, сроком, путём к документу и номером строки. Фильтрует по состоянию, документу, тегу, сроку и словам. Без карточек канбана (read_board) и напоминаний со временем (list_reminders).
- `add_task`: Добавляет задачу (- [ ] ...) в документ открытой папки: в конец или в конец раздела под заголовком, со сроком, если он задан. Создаёт документ, если его нет. Возвращает, куда она попала. Для того, что должно напомнить в определённое время, — add_reminder; карточка на доске — add_card, строка базы — add_row, строка в сегодняшнем дневнике — append_to_daily_note.
- `complete_task`: Отмечает задачу выполненной (- [x]) - или, при done false, снова открывает её - по пути документа и строке, как их даёт list_tasks. Записывает дату выполнения (✅ ГГГГ-ММ-ДД), как Obsidian Tasks, а для повторяющейся задачи (🔁 every …) добавляет следующую строкой выше.
<!-- /ai-tools -->

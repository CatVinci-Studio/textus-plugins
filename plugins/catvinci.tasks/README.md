# Tasks

List every task in your folder in one place, tick them off there, and query them the way Obsidian Tasks does.

- Write a task anywhere as `- [ ] something to do`.
- The **Tasks** tab in the sidebar lists the tasks of every document in the open folder, by document and under the heading each one sits beneath.
- Tick one off there, or click it to go to it in its document.
- Give a task a date (`📅 2026-11-01`, `due:2026-11-01` or `[due:: 2026-11-01]`) and it shows as a badge. Tasks past due or due within a week are listed first, under **Due soon**.
- The field at the top filters the list by words, the document's name or its heading.
- Finished tasks are hidden unless you turn on **Show finished tasks** in **Settings › Extensions › Plugins › Tasks**.
- Cards on a Kanban board (a document with `kanban-plugin` in its front matter, or `name.kanban.md`) belong to the board and are left out of the sidebar list.

## Tasks written by Obsidian

Tasks written by Obsidian's Tasks plugin work the same here:

- `[/]` is in progress, and still open; `[-]` is cancelled, and finished.
- The fields at the end of a task (📅 due, ⏳ scheduled, 🛫 start, ➕ created, ✅ done, ❌ cancelled, a priority 🔺 ⏫ 🔼 🔽 ⏬, and 🔁 a repeat) stay in the file and are left out of the list.
- Ticking a task writes ✅ and the day; unticking it takes the done or cancelled date off.
- Ticking a task that repeats puts its next one on the line above, its dates moved on. Repeats such as `🔁 every day`, `every 2 weeks`, `every weekday`, `every weekend`, `every Monday`, `every month on the 15th`, `every month on the last`, `every year` and `… when done` are understood.

## Task queries

A `tasks` code block lists the tasks it asks for, one rule a line, as in Obsidian:

````markdown
```tasks
not done
due before next week
path includes Projects
sort by due
```
````

- **Status**: `done`, `not done`, and `status.type is` (`todo`, `in_progress`, `done` or `cancelled`).
- **Dates**: `due`, `scheduled`, `starts`, `done`, `created`, `cancelled` or `happens` with `before`, `after`, `on`, `in`, `on or before` or `on or after` a date: 2026-11-01, today, tomorrow, yesterday, or this, next or last week, month or year. Also `no due date` and `has due date` (and the same for the other dates).
- **Text**: `path`, `folder`, `filename`, `description` or `heading` with `includes` or `does not include`; `tag includes`, `tag does not include`, `has tags` and `no tags`.
- **Other**: `priority is` (also `above`, `below`, `not`), `is recurring` and `is not recurring`.
- **Order**: `sort by` and `group by` (status, due, scheduled, start, done, created, priority, path, folder, filename, heading or description, with `reverse` if you like) and `limit`. Without `sort by`, tasks come in Obsidian Tasks' order: status, due date, priority, path.

Lines about the look (`hide …`, `show …`) are passed over; any other line it can't read is named under the count. The block lists a board's cards too. Tick a task there to tick it in its file; click it to go to it.

## Permissions

The plugin reads the folder's documents to find their tasks, and writes to a document only to tick a task or add one. It also gives Textus AI the tools below. It works on the desktop and on iPhone and iPad.

## Changes

- **0.4.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.0** - Uses the dates built into Textus 1.3.10, which it now needs.
- **0.3.1** - Ships the updated shared date code; nothing else changed.
- **0.3.0** - Obsidian Tasks: `[/]` and `[-]`, the task fields, done dates, repeating tasks and `tasks` query blocks; boards marked with `kanban-plugin` are left out of the list.
- **0.2.1** - Cards on a Kanban board (`name.kanban.md`) are no longer listed.
- **0.2.0** - Textus AI can list, add and tick off tasks.
- **0.1.3** - The list follows the interface language when it changes.
- **0.1.2** - Due dates in local time; counts in each language's plural forms.
- **0.1.0-0.1.1** - First versions: every task in the folder in a sidebar list, ticked off or opened from there, with a filter, due dates and Due soon.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `list_tasks`: Lists the Markdown tasks (- [ ] ...) in the open folder's documents - open ones unless asked otherwise - each with its text, due date, document path and line. Filters by status, document, tag, due date and words. Not a Kanban board's cards (read_board) or timed reminders (list_reminders).
- `add_task`: Adds a task (- [ ] ...) to a document in the open folder: at its end, or at the end of the section under a heading, with a due date if given. Makes the document if there is none. Returns where it went. For something that should notify at a time, use add_reminder; a card on a board is add_card, a database row add_row, a line in today's journal append_to_daily_note.
- `complete_task`: Ticks off a task (- [x]) - or, with done false, opens it again - by its document's path and line, as list_tasks gives them. Writes the done date (✅ YYYY-MM-DD) as Obsidian Tasks does, and for a recurring task (🔁 every …) adds its next occurrence on the line above.
<!-- /ai-tools -->

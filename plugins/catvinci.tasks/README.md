# Tasks

Every task in your folder, in one list.

- Write a task anywhere as `- [ ] something to do`.
- The **Tasks** tab in the sidebar lists the tasks of every document in the open folder.
- Tick one off there, or click it to go to it in its document.
- Whether finished tasks show is in the plugin's settings.
- Give a task a date - `📅 2026-11-01` or `due:2026-11-01` - and it shows as a badge; tasks past due or due within a week are listed first, under **Due soon**.
- The field at the top filters the list by words, the document's name or its heading.
- Cards on a Kanban board (a document with `kanban-plugin` in its front matter, or `name.kanban.md`) are left to the board and are not listed.

## Tasks written by Obsidian

Tasks written by Obsidian's Tasks plugin work the same here:

- `[/]` is in progress, and still open; `[-]` is cancelled, and finished.
- The fields at the end of a task - 📅 due, ⏳ scheduled, 🛫 start, ➕ created, ✅ done, ❌ cancelled, a priority (🔺 ⏫ 🔼 🔽 ⏬) and 🔁 a repeat - stay in the file and are left out of the list.
- Ticking a task writes ✅ and the day; unticking it takes them off.
- Ticking a task that repeats - `🔁 every day`, `every 2 weeks`, `every weekday`, `every Monday`, `every month on the 15th`, `every year`, `… when done` - puts its next one on the line above, its dates moved on.

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

It reads `not done` and `done`; `due`, `scheduled`, `starts`, `done` or `created` with `before`, `after`, `on`, `on or before` or `on or after` a date (2026-11-01, today, tomorrow, yesterday, this, next or last week, month or year); `no due date` and `has due date`; `path`, `filename`, `description` or `heading` `includes` or `does not include`; `tag includes`; `priority is`; `is recurring`; `sort by`, `group by` (path, folder, filename, heading, due, priority, status) and `limit`. Lines about the look (`hide …`, `show …`) are passed over; any other line it can't read is named under the count. Tick a task there to tick it in its file; click it to go to it.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `list_tasks`: Lists the Markdown tasks (- [ ] ...) in the open folder's documents - open ones unless asked otherwise - each with its text, due date, document path and line. Filters by status, document, tag, due date and words. Not a Kanban board's cards (read_board) or timed reminders (list_reminders).
- `add_task`: Adds a task (- [ ] ...) to a document in the open folder: at its end, or at the end of the section under a heading, with a due date if given. Makes the document if there is none. Returns where it went. For something that should notify at a time, use add_reminder; a card on a board is add_card, a database row add_row, a line in today's journal append_to_daily_note.
- `complete_task`: Ticks off a task (- [x]) - or, with done false, opens it again - by its document's path and line, as list_tasks gives them. Writes the done date (✅ YYYY-MM-DD) as Obsidian Tasks does, and for a recurring task (🔁 every …) adds its next occurrence on the line above.
<!-- /ai-tools -->

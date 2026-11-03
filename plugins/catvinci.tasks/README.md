# Tasks

Every task in your folder, in one list.

- Write a task anywhere as `- [ ] something to do`.
- The **Tasks** tab in the sidebar lists the tasks of every document in the open folder.
- Tick one off there, or click it to go to it in its document.
- Whether finished tasks show is in the plugin's settings.
- Give a task a date - `📅 2026-11-01` or `due:2026-11-01` - and it shows as a badge; tasks past due or due within a week are listed first, under **Due soon**.
- The field at the top filters the list by words, the document's name or its heading.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `list_tasks`: Lists the Markdown tasks (- [ ] ...) in the open folder's documents - open ones unless asked otherwise - each with its text, due date, document path and line. Filters by status, document, tag, due date and words.
- `add_task`: Adds a task (- [ ] ...) to a document in the open folder: at its end, or at the end of the section under a heading, with a due date if given. Makes the document if there is none. Returns where it went.
- `complete_task`: Ticks off a task (- [x]) - or, with done false, opens it again - by its document's path and line, as list_tasks gives them.
<!-- /ai-tools -->

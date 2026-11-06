# Reminders

Write `(@2026-11-02 09:00)` in a line - a task, a heading, any line - and you're reminded of it then with a system notification. Click it and the line opens.

- `(@2026-11-02)` alone reminds you at nine that morning.
- `/remind` (or **Remind Me…**) puts the mark in for you: in an hour, tonight, tomorrow, next Monday, or a time you type.
- A ticked task (`- [x] …`) is done: no reminder.
- The **Reminders** tab in the sidebar lists the ones to come.
- Textus keeps the reminders itself: they come while a window is open, and with every window closed when **Keep running in the background** is on (Settings › General). One missed while Textus wasn't running comes when it next starts.

The marks are written as Obsidian's Reminder plugin writes them, so the same notes remind you there too.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `list_reminders`: Lists the coming reminders - (@2026-11-02 09:00) marks in the open folder's documents - soonest first, each with its time, text, document path and line. Tasks by due date are list_tasks.
- `add_reminder`: Adds a reminder as a task line with its time, - [ ] text (@2026-11-02 09:00), at the end of the document in front; a notification comes then. Use it when the user wants to be told at a time; a to-do with only a due date is add_task.
<!-- /ai-tools -->

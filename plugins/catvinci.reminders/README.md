# Reminders

Reminds you of a line at the time you write in it, such as `(@2026-11-02 09:00)`, with a system notification.

Write the mark in any line - a task, a heading, any line. At that time a notification shows the line's text and its document; click it and the line opens.

- `(@2026-11-02)` alone reminds you at nine that morning.
- **Plugins › Remind Me…**, or **Remind Me…** in the slash menu, puts the mark in at the caret for you: in an hour, tonight at 8, tomorrow at 9, next Monday at 9, or a date and time you type.
- A ticked task (`- [x] …`) is done: no reminder.
- The **Reminders** tab in the sidebar lists the ones to come, soonest first; click one to open its line.
- Textus keeps the reminders itself: they come while a window is open, and with every window closed when **Keep running in the background** is on (**Settings › General**). One missed while Textus wasn't running comes when it next starts.

The marks are written as Obsidian's Reminder plugin writes them, so the same notes remind you there too.

It works on desktop and needs Textus 1.3.10 or later. It asks to read the open folder's files, to find the marks; to write in the editor, to put a mark in; to show notifications; and to give Textus AI the two tools below.

## Changes

- **0.3.2** - Two open windows no longer clear each other's reminders, and the list empties when you close the folder. A mistyped time is refused instead of inserting a broken mark.
- **0.3.1** - Shorter help and empty-state text.
- **0.3.0** - Marks written with Textus's own dates; needs Textus 1.3.10.
- **0.2.2-0.2.3** - Updated shared date code.
- **0.2.1** - Textus AI is told when a due date belongs in Tasks instead.
- **0.2.0** - Textus AI can list the coming reminders and add one.
- **0.1.1** - Desktop only, since it runs in the background.
- **0.1.0** - First version: `(@date time)` marks as notifications Textus keeps, even in the background; Remind Me… and the sidebar list.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `list_reminders`: Lists the coming reminders - (@2026-11-02 09:00) marks in the open folder's documents - soonest first, each with its time, text, document path and line. Tasks by due date are list_tasks.
- `add_reminder`: Adds a reminder as a task line with its time, - [ ] text (@2026-11-02 09:00), at the end of the document in front; a notification comes then. Use it when the user wants to be told at a time; a to-do with only a due date is add_task.
<!-- /ai-tools -->

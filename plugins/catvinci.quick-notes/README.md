# Quick Notes

Jot a note down without leaving the document; it goes into your folder's inbox file or today's daily note.

- **Ctrl+Alt+N** (**⌘⌥N** on a Mac), or **Plugins › New Quick Note…**, asks for a note and saves it.
- **New Quick Note…** is also in the tray or menu bar icon. The plugin asks Textus to keep running in the background, so it is there even with every window closed.
- The **Quick Notes** tab in the sidebar lists the notes, newest first. Click **New** to write one there, or edit a note right in the list.
- Each note's actions menu (its more button, or right-click) has **Insert** (at the caret in the document), **Open** and **Delete**. A note kept in a document opens there, at its line.
- Deleted one by mistake? **Undo** at the bottom brings it back for a few seconds. A new note left empty goes by itself.
- Once there are six notes or more, a search field shows at the top.

## Where notes are kept

Notes are kept in a document of the open folder, so Obsidian and Cloud Sync see them. Choose where under **Save notes to** in the plugin's settings:

- **Inbox file** (the default): `Inbox.md` at the top of the folder, or another document set under **Inbox file**. Each note is added at the end as a list item with its date and time, such as `- 2026-11-08 14:05 Call Anna`.
- **Today's daily note**: under a `## Quick notes` heading (in the interface's language), added when missing. Each note has its time, such as `- 14:05 Call Anna`. The daily note's folder, name and template follow the folder's daily notes settings, such as Obsidian's; without them it is `Daily/YYYY-MM-DD.md`.

Edit the file and the sidebar follows. Notes from older versions move into it once, oldest first. With no folder open, notes stay inside Textus.

Runs on the desktop.

## Permissions

- Read and write files: for the inbox file or the daily note.
- Edit the document: to insert a note at the caret.
- Tools for Textus AI: so Textus AI can add a quick note.

## Changes

- **0.5.2** - In the sidebar the panel draws no title of its own, as the sidebar's other tabs.
- **0.5.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.5.0** - Dates and the daily note's template are filled by Textus itself, the same way as in Calendar & Daily Notes and Templates. Needs Textus 1.3.10.
- **0.4.0** - Notes are kept in a document of the folder: `Inbox.md` or today's daily note. Notes from older versions move in once.
- **0.3.1** - Textus AI tells quick notes apart from the daily journal and to-dos.
- **0.3.0** - Textus AI can add a quick note (`add_note`).
- **0.2.0** - Textus's own controls, and an actions menu for each note.
- **0.1.0-0.1.4** - First versions: the shortcut and the tray, the sidebar list, insert, open, delete with Undo, search once there are many, dates on a line of their own; desktop only.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `add_note`: Adds a quick note to the top of the Quick Notes list in the sidebar, to be inserted into a document or opened as one later. Today's journal is append_to_daily_note; a to-do is add_task.
<!-- /ai-tools -->

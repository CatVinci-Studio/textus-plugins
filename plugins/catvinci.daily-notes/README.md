# Calendar & Daily Notes

Keeps a note for each day in a folder of the open folder, with a calendar in the sidebar to reach any of them.

- Press **Ctrl+Alt+J** (**⌘⌥J** on a Mac) or choose **Plugins › Open Today's Note**. Today's note opens; the first time, it is made.
- **Plugins › Open the Day Before** and **Plugins › Open the Day After** go from the day's note in front to the one beside it.
- The **Calendar** tab in the sidebar shows a month and marks the days that have a note. Click a day to open its note, or **Today** to open today's. Weeks start as your region has them.
- A note that is already there is never written over.

## Settings

- **Daily notes folder**: a folder inside the open folder, `Daily` by default.
- **A new day's note**: the text a new note starts with, `# {{date}}` by default. It can hold `{{date}}`, `{{weekday}}`, `{{yesterday}}` and `{{tomorrow}}` (for links such as `[[{{yesterday}}]]`), `{{time}}`, `{{title}}`, `{{date:FORMAT}}` and `{{date+1d}}`; `\n` starts a new line. It can also be the name of a template in the Templates folder, such as `Daily`.
- **Weekly notes** and **Monthly notes**: off by default. Once on, **Plugins › Open This Week's Note** and **Open This Month's Note** open them, and so do the week numbers and the month's name in the calendar. Each has its own folder (`Weekly`, `Monthly`), name format (`gggg-[W]ww` gives `2026-W45`, `YYYY-MM` gives `2026-11`) and template. A weekly template can hold `{{monday:YYYY-MM-DD}}` … `{{sunday}}` for the days of the week.

## Obsidian vaults

In an Obsidian vault, the vault's own daily notes settings decide instead: folder, name format (such as `YYYY/MM/YYYY-MM-DD` or `MMMM Do, YYYY`) and template. Textus never changes them. A vault without daily notes settings keeps its notes at its top, as Obsidian does. `{{date}}`, `{{yesterday}}` and `{{tomorrow}}` are written in the notes' name format. In a vault with the Periodic Notes plugin, its weekly and monthly settings decide.

## Permissions

The plugin reads and writes files in the open folder to find and make the notes, and reads which document is in front to know the day before and after. It also gives Textus AI two tools, listed below. It works on desktop and iPhone and needs Textus 1.3.10 or later.

## Changes

- **0.7.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.7.0** - Dates and templates are filled in by Textus itself, the same way as in the Templates plugin; needs Textus 1.3.10.
- **0.6.0** - Weekly and monthly notes, with their own settings, the calendar's week numbers and month name, and a vault's Periodic Notes settings.
- **0.5.0** - A vault without daily notes settings keeps its notes at its top; `{{date}}`, `{{yesterday}}` and `{{tomorrow}}` follow the notes' name format, `MMMM Do, YYYY` included.
- **0.4.0** - Follows an Obsidian vault's daily notes settings; the starting text can name a template in the Templates folder; `{{date:FORMAT}}` and `{{title}}`.
- **0.3.0** - Textus AI can read a day's note and add to it.
- **0.2.0** - The calendar uses Textus's own controls and follows the interface language when it changes; needs Textus 1.3.2.
- **0.1.3** - Textus 1.3's colors and type.
- **0.1.2** - Weeks start as your region has them; a day's note is never written over.
- **0.1.0-0.1.1** - First versions: today's note with a shortcut, the calendar, the day before and after, `{{weekday}}`, `{{yesterday}}`, `{{tomorrow}}` and `{{time}}` in the template.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `read_daily_note`: Reads the daily note of a day - today's unless a date is given - from the daily notes folder: its path, whether it exists, and its text.
- `append_to_daily_note`: Adds Markdown to the end of a day's daily note - today's unless a date is given - making the note from its template first if there is none. A note to keep for later in the sidebar is add_note; a to-do with a date is add_task.
<!-- /ai-tools -->

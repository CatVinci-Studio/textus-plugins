# Calendar & Daily Notes

A note for each day, and a calendar to get to any of them.

- **Ctrl+Alt+D** (**⌘⌥D** on a Mac), or **Plugins › Open Today's Note**, opens today's note - made the first time.
- The **Calendar** tab in the sidebar shows the month; a day with a note is marked. Click a day to open it.
- The notes are kept in a folder of the open folder. Its name and a new day's starting text are in the plugin's settings; weeks start as your region has them.
- **Plugins › Open the Day Before** and **Open the Day After** go from a day's note to its neighbours.
- The template can hold {{weekday}}, {{yesterday}}, {{tomorrow}} and {{time}} as well as {{date}} - for example `[[{{yesterday}}]]` links each day to the one before.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `read_daily_note`: Reads the daily note of a day - today's unless a date is given - from the daily notes folder: its path, whether it exists, and its text.
- `append_to_daily_note`: Adds Markdown to the end of a day's daily note - today's unless a date is given - making the note from its template first if there is none.
<!-- /ai-tools -->

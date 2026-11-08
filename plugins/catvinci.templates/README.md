# Templates

New documents and snippets from templates of your own, with the date, time and title filled in.

- Templates are Markdown files in the open folder's **Templates** folder - in an Obsidian vault, the folder its Templates settings name - so they go wherever your notes go. Ones an older version kept are moved there once; a name already taken gets a number, and nothing is written over. `{{date:YYYY-MM-DD}}` and `{{time:HH:mm}}` take a format, as in Obsidian.
- **New from Template…** makes a document in the open folder from one of your templates; **Insert Template…** (or `/` in the text) puts one at the caret.
- **Save as Template…** keeps the document in front as a template.
- In a template, `{{date}}`, `{{time}}` and `{{title}}` are filled in when it is used. A Meeting Notes template is there to start with.
- In an Obsidian vault, `{{date}}` and `{{time}}` take the date and time formats of its Templates settings. Templater's common tags are filled in too: `<% tp.date.now("YYYY-MM-DD") %>` (with an offset in days, such as `-1`, or `"P1W"`), `tp.date.today`, `tomorrow` and `yesterday`, `<% tp.file.title %>`, `tp.file.creation_date()` and `tp.file.folder()`; `<% tp.file.cursor() %>` puts the caret there. Scripts and other tags are never run: they stay as written, and a notice names them.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `list_templates`: Lists the user's document templates, each with its name and its Markdown, where {{date}}, {{time}}, {{title}} and Templater's tp.date and tp.file tags are filled in when it is used.
- `create_from_template`: Makes a new document in the open folder from one of the user's templates, its {{date}}, {{time}}, {{title}} and Templater's tp.date and tp.file tags filled in. Returns its path, and in notRun the tags left as written.
<!-- /ai-tools -->

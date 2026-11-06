# Templates

New documents and snippets from templates of your own, with the date, time and title filled in.

- Templates are Markdown files in the open folder's **Templates** folder - in an Obsidian vault, the folder its Templates settings name - so they go wherever your notes go. Ones an older version kept are moved there once; a name already taken gets a number, and nothing is written over. `{{date:YYYY-MM-DD}}` and `{{time:HH:mm}}` take a format, as in Obsidian.
- **New from Template…** makes a document in the open folder from one of your templates; **Insert Template…** (or `/` in the text) puts one at the caret.
- **Save as Template…** keeps the document in front as a template.
- In a template, `{{date}}`, `{{time}}` and `{{title}}` are filled in when it is used. A Meeting Notes template is there to start with.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `list_templates`: Lists the user's document templates, each with its name and its Markdown, where {{date}}, {{time}} and {{title}} are filled in when it is used.
- `create_from_template`: Makes a new document in the open folder from one of the user's templates, its {{date}}, {{time}} and {{title}} filled in. Returns its path.
<!-- /ai-tools -->

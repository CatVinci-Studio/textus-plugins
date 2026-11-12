# Templates

Makes new documents and inserts snippets from templates of your own, with the date, time and title filled in.

Templates are Markdown files in the open folder's **Templates** folder - in an Obsidian vault, the folder its Templates settings name - so they go wherever your notes go. When there are none yet, a **Meeting Notes** template is made to start with.

- **Plugins › New from Template…** makes a document at the top of the open folder from one of your templates. It asks for the name, and refuses one that is already taken.
- **Plugins › Insert Template…**, or **Insert Template…** in the slash menu, puts a template at the caret.
- **Plugins › Save as Template…** keeps the document in front as a template. A name already taken gets a number; nothing is written over.

## What is filled in

- `{{date}}`, `{{time}}` and `{{title}}` are filled in when a template is used; `{{date:YYYY-MM-DD}}` and `{{time:HH:mm}}` take a format, as in Obsidian.
- In an Obsidian vault, `{{date}}` and `{{time}}` take the date and time formats of its Templates settings.
- Templater's common tags are filled in too: `<% tp.date.now("YYYY-MM-DD") %>` (with an offset in days, such as `-1`, or `"P1W"`), `tp.date.today`, `tomorrow` and `yesterday`, `<% tp.file.title %>`, `tp.file.creation_date()` and `tp.file.folder()`; `<% tp.file.cursor() %>` puts the caret there.
- Scripts and other tags are never run: they stay as written, and a notice names them.

It works on desktop and iPhone and needs Textus 1.3.10 or later. It asks to read and write files in the open folder, for the templates and new documents; to read and edit the document in front, to insert a template or save it as one; and gives Textus AI the two tools below.

## Changes

- **0.5.2** - Templates in a hidden or lowercase templates folder, and in its subfolders, now show up. After Insert, the caret lands right after the template.
- **0.5.1** - **New from Template…** from a file's or folder's right-click menu makes the document in that folder.
- **0.5.0** - Templates are filled in by Textus itself, the same way as daily notes; needs Textus 1.3.10.
- **0.4.1** - Templates are listed in natural order: 2 before 10.
- **0.4.0** - Templater's common `tp.date` and `tp.file` tags, and an Obsidian vault's Templates date and time formats; tags that aren't run are named in a notice.
- **0.3.0** - Templates are Markdown files in the Templates folder (a vault's own templates folder in Obsidian), moved there once from where older versions kept them; `{{date:FORMAT}}` and `{{time:FORMAT}}`.
- **0.2.0** - Textus AI can list your templates and make a document from one.
- **0.1.3** - Says where it runs: desktop and iPhone.
- **0.1.2** - New from Template refuses a name that is already taken.
- **0.1.0-0.1.1** - First versions: new documents, inserted snippets and saved templates, with `{{date}}`, `{{time}}` and `{{title}}`; store page and icon.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `list_templates`: Lists the user's document templates, each with its name and its Markdown, where {{date}}, {{time}}, {{title}} and Templater's tp.date and tp.file tags are filled in when it is used.
- `create_from_template`: Makes a new document in the open folder from one of the user's templates, its {{date}}, {{time}}, {{title}} and Templater's tp.date and tp.file tags filled in. Returns its path, and in notRun the tags left as written.
<!-- /ai-tools -->

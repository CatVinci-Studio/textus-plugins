# Vorlagen

Legt neue Dokumente an und fügt Textbausteine aus Ihren eigenen Vorlagen ein, mit Datum, Uhrzeit und Titel schon ausgefüllt.

Vorlagen sind Markdown-Dateien im Ordner **Templates** des geöffneten Ordners (in einem Obsidian-Vault der Ordner, den seine Vorlagen-Einstellungen nennen) und wandern so überallhin mit, wohin Ihre Notizen gehen. Gibt es noch keine, wird zum Start eine Vorlage **Besprechungsnotizen** angelegt.

- **Plugins › Neu aus Vorlage …** legt aus einer Ihrer Vorlagen ein Dokument ganz oben im geöffneten Ordner an. Es fragt nach dem Namen und lehnt einen schon vergebenen ab.
- **Plugins › Vorlage einfügen …** oder **Vorlage einfügen …** im Slash-Menü setzt eine Vorlage am Cursor ein.
- **Plugins › Als Vorlage speichern …** behält das geöffnete Dokument als Vorlage. Ein schon vergebener Name bekommt eine Nummer; nichts wird überschrieben.

## Was ausgefüllt wird

- `{{date}}`, `{{time}}` und `{{title}}` werden beim Verwenden ausgefüllt; `{{date:YYYY-MM-DD}}` und `{{time:HH:mm}}` nehmen ein Format, wie in Obsidian.
- In einem Obsidian-Vault nehmen `{{date}}` und `{{time}}` die Datums- und Zeitformate seiner Vorlagen-Einstellungen.
- Auch die gängigen Tags von Templater werden ausgefüllt: `<% tp.date.now("YYYY-MM-DD") %>` (mit einem Versatz in Tagen wie `-1` oder `"P1W"`), `tp.date.today`, `tomorrow` und `yesterday`, `<% tp.file.title %>`, `tp.file.creation_date()` und `tp.file.folder()`; `<% tp.file.cursor() %>` setzt den Cursor dorthin.
- Skripte und andere Tags werden nie ausgeführt: Sie bleiben, wie sie sind, und eine Meldung nennt sie.

Läuft auf dem Desktop und auf dem iPhone und braucht Textus 1.3.10 oder neuer. Es fragt nach Lese- und Schreibzugriff auf Dateien im geöffneten Ordner, für Vorlagen und neue Dokumente, nach Lesen und Bearbeiten des geöffneten Dokuments, um eine Vorlage einzufügen oder es als Vorlage zu speichern, und gibt Textus AI die beiden Werkzeuge unten.

## Änderungen

- **0.5.6** - Its page no longer says which devices it runs on: the store shows that. It names the Textus it needs, 1.4.3.
- **0.5.5** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller. Needs Textus 1.4.3.
- **0.5.4** - A taken name gets the next free one as the file is written, never a clash (Textus 1.4.3).
- **0.5.3** - The store description now opens with what the plugin does.
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
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `list_templates`: Listet die Dokumentvorlagen des Nutzers auf, jede mit Name und Markdown, in dem {{date}}, {{time}}, {{title}} und Templaters tp.date- und tp.file-Tags beim Verwenden ausgefüllt werden.
- `create_from_template`: Legt aus einer Vorlage des Nutzers ein neues Dokument im geöffneten Ordner an, mit ausgefüllten {{date}}, {{time}}, {{title}} und Templaters tp.date- und tp.file-Tags. Gibt seinen Pfad zurück und in notRun die unverändert gelassenen Tags.
<!-- /ai-tools -->

# Vorlagen

Neue Dokumente und Bausteine aus eigenen Vorlagen, mit Datum, Uhrzeit und Titel ausgefüllt.

- Vorlagen sind Markdown-Dateien im Ordner **Templates** des geöffneten Ordners – in einem Obsidian-Vault der Ordner aus seinen Vorlagen-Einstellungen –, sie wandern also mit Ihren Notizen. Von älteren Versionen gespeicherte werden einmal dorthin verschoben; ein vergebener Name bekommt eine Nummer, nichts wird überschrieben. `{{date:YYYY-MM-DD}}` und `{{time:HH:mm}}` nehmen ein Format, wie in Obsidian.
- **Neu aus Vorlage …** legt im geöffneten Ordner ein Dokument aus einer Vorlage an; **Vorlage einfügen …** (oder `/` im Text) setzt sie an die Schreibmarke.
- **Als Vorlage speichern …** speichert das vordere Dokument als Vorlage.
- In einer Vorlage werden `{{date}}`, `{{time}}` und `{{title}}` beim Verwenden ausgefüllt. Für den Anfang gibt es eine Vorlage für Besprechungsnotizen.
- In einem Obsidian-Vault nehmen `{{date}}` und `{{time}}` die Datums- und Zeitformate aus seinen Vorlagen-Einstellungen. Auch Templaters gängige Tags werden ausgefüllt: `<% tp.date.now("YYYY-MM-DD") %>` (mit einem Versatz in Tagen wie `-1` oder `"P1W"`), `tp.date.today`, `tomorrow` und `yesterday`, `<% tp.file.title %>`, `tp.file.creation_date()` und `tp.file.folder()`; bei `<% tp.file.cursor() %>` steht danach die Schreibmarke. Skripte und andere Tags werden nie ausgeführt: Sie bleiben, wie sie sind, und ein Hinweis nennt sie.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `list_templates`: Listet die Dokumentvorlagen des Nutzers auf, jede mit Name und Markdown, in dem {{date}}, {{time}}, {{title}} und Templaters tp.date- und tp.file-Tags beim Verwenden ausgefüllt werden.
- `create_from_template`: Legt aus einer Vorlage des Nutzers ein neues Dokument im geöffneten Ordner an, mit ausgefüllten {{date}}, {{time}}, {{title}} und Templaters tp.date- und tp.file-Tags. Gibt seinen Pfad zurück und in notRun die unverändert gelassenen Tags.
<!-- /ai-tools -->

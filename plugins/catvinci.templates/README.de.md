# Vorlagen

Neue Dokumente und Bausteine aus eigenen Vorlagen, mit Datum, Uhrzeit und Titel ausgefüllt.

- **Neu aus Vorlage …** legt im geöffneten Ordner ein Dokument aus einer Vorlage an; **Vorlage einfügen …** (oder `/` im Text) setzt sie an die Schreibmarke.
- **Als Vorlage speichern …** speichert das vordere Dokument als Vorlage.
- In einer Vorlage werden `{{date}}`, `{{time}}` und `{{title}}` beim Verwenden ausgefüllt. Für den Anfang gibt es eine Vorlage für Besprechungsnotizen.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `list_templates`: Listet die Dokumentvorlagen des Nutzers auf, jede mit Name und Markdown, in dem {{date}}, {{time}} und {{title}} beim Verwenden ausgefüllt werden.
- `create_from_template`: Legt aus einer Vorlage des Nutzers ein neues Dokument im geöffneten Ordner an, mit ausgefüllten {{date}}, {{time}} und {{title}}. Gibt seinen Pfad zurück.
<!-- /ai-tools -->

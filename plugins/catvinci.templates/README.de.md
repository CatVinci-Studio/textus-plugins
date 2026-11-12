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

- **0.5.2** - Vorlagen in einem versteckten oder kleingeschriebenen Vorlagenordner und in seinen Unterordnern erscheinen jetzt. Nach dem Einfügen steht der Cursor direkt hinter der Vorlage.
- **0.5.1** - **Neu aus Vorlage …** im Kontextmenü einer Datei oder eines Ordners legt das Dokument in diesem Ordner an.
- **0.5.0** - Vorlagen füllt Textus selbst aus, genauso wie Tagesnotizen; braucht Textus 1.3.10.
- **0.4.1** - Vorlagen stehen in natürlicher Reihenfolge: 2 vor 10.
- **0.4.0** - Die gängigen `tp.date`- und `tp.file`-Tags von Templater und die Datums- und Zeitformate der Vorlagen-Einstellungen eines Obsidian-Vaults; nicht ausgeführte Tags nennt eine Meldung.
- **0.3.0** - Vorlagen sind Markdown-Dateien im Ordner Templates (in Obsidian der Vorlagenordner des Vaults), einmal dorthin verschoben, wo ältere Versionen sie aufbewahrten; `{{date:FORMAT}}` und `{{time:FORMAT}}`.
- **0.2.0** - Textus AI kann Ihre Vorlagen auflisten und aus einer ein Dokument anlegen.
- **0.1.3** - Nennt, wo es läuft: Desktop und iPhone.
- **0.1.2** - Neu aus Vorlage lehnt einen schon vergebenen Namen ab.
- **0.1.0-0.1.1** - Erste Versionen: neue Dokumente, eingefügte Textbausteine und gespeicherte Vorlagen mit `{{date}}`, `{{time}}` und `{{title}}`; Seite im Store und Symbol.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `list_templates`: Listet die Dokumentvorlagen des Nutzers auf, jede mit Name und Markdown, in dem {{date}}, {{time}}, {{title}} und Templaters tp.date- und tp.file-Tags beim Verwenden ausgefüllt werden.
- `create_from_template`: Legt aus einer Vorlage des Nutzers ein neues Dokument im geöffneten Ordner an, mit ausgefüllten {{date}}, {{time}}, {{title}} und Templaters tp.date- und tp.file-Tags. Gibt seinen Pfad zurück und in notRun die unverändert gelassenen Tags.
<!-- /ai-tools -->

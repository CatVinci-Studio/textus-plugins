# Zotero

Zitiere beim Schreiben aus deiner Zotero-Bibliothek.

## Bevor du anfängst

Zotero 7 oder neuer (auch Zotero 10) muss auf demselben Computer laufen, mit **Einstellungen › Erweitert › „Anderen Anwendungen auf diesem Computer erlauben, mit Zotero zu kommunizieren“** eingeschaltet. Das Plugin spricht nur mit Zotero auf deinem Computer; nichts verlässt ihn.

## Zitieren

- Drücke **Ctrl+Alt+R** (**⌘⌥R** auf dem Mac), wähle **Zitat aus Zotero einfügen…** im Kontextmenü oder **Plugins › Zitat aus Zotero einfügen…**. Zuletzt zitierte Werke stehen oben, danach folgt eine Suche in deiner Bibliothek.
- Sind Wörter markiert, wird nach ihnen gesucht.
- Wähle einen Eintrag, und das Zitat steht an der Einfügemarke.
- Bleibt der Zeiger auf einem Zitat oder einem Link zu einem Zotero-Eintrag, siehst du Autoren, Jahr, Erscheinungsort und den Anfang des Abstracts.
- **Plugins › Literaturverzeichnis einfügen** hängt einen Abschnitt **Literatur** mit allen Werken an, die das Dokument zitiert, sortiert nach Erstautor und Jahr. Noch einmal ausgeführt, wird das Verzeichnis ersetzt statt doppelt eingefügt.

## Wie ein Zitat geschrieben wird

Wähle es in den Einstellungen des Plugins unter **Ein Zitat wird geschrieben als**:

- **Ein Pandoc-Schlüssel: [@key]** (Standard). Daraus werden formatierte Literaturangaben, wenn du mit Pandoc exportierst und unter **Einstellungen › Editor & Design › Exportieren** ein Literaturverzeichnis (.bib) gewählt ist.
- **Autor und Jahr: (Autor, 2024)**.
- **Ein Obsidian-Notizlink: [[@key]]**, ein Link zur Literaturnotiz des Eintrags. Gibt es die Notiz noch nicht, bietet das Plugin an, sie anzulegen.
- **Ein Link, der Zotero öffnet**.

Der Zitierschlüssel kommt aus dem Feld Citation Key des Eintrags (oder einer Zeile `Citation Key:` in Extra, wie Better BibTeX sie schreibt).

## Literaturnotizen

- **Plugins › Neue Literaturnotiz aus Zotero…** legt `@citekey.md` an (oder öffnet sie, wenn es sie gibt) – mit Titel, Autoren, Jahr, Abstract, DOI oder URL des Eintrags und seinen Markierungen und Notizen aus Zotero.
- Die Notizen landen in **References** im geöffneten Ordner; ändern lässt sich das unter **Ordner für Literaturnotizen**.
- **Vorlage für Literaturnotizen** kann auf eine Markdown-Datei im Ordner zeigen, etwa `Templates/Literature.md`, mit `{{title}}`, `{{authors}}`, `{{year}}`, `{{abstract}}`, `{{citekey}}`, `{{DOI}}`, `{{URL}}`, `{{highlights}}`, `{{notes}}` und `{{date:YYYY-MM-DD}}`. Leer bleibt es bei einer einfachen Notiz mit Front Matter.
- In einem Obsidian-Vault gelten Ordner und Vorlage aus den Plugins Zotero Integration oder Citations. Eine Vorlage in einer anderen Vorlagensprache wird durch die einfache Notiz ersetzt.

## Berechtigungen

- **Netzwerk, nur localhost:23119**: um Zoteros lokale API auf diesem Computer zu erreichen.
- **Dokument lesen und bearbeiten**: um Zitate und das Literaturverzeichnis einzufügen und nach markierten Wörtern zu suchen.
- **Dateien im geöffneten Ordner lesen und schreiben**: um Vorlagen und die Zotero-Einstellungen eines Vaults zu lesen und Literaturnotizen anzulegen.
- **Werkzeuge für Textus AI**: damit Textus AI deine Bibliothek durchsuchen kann.

## Änderungen

- **0.4.6** - A simpler icon, drawn in the text colour.
- **0.4.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.4.4** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller. Needs Textus 1.4.3.
- **0.4.3** - A citation now replaces the selected words; the References list no longer says Zotero is unreachable when it answers, and hover previews show up more reliably.
- **0.4.2** - Shorter help and empty-state text.
- **0.4.1** - Its code is split into smaller files by what each part does; nothing changes in use.
- **0.4.0** - literature note templates are filled by Textus's own template engine; needs Textus 1.3.10
- **0.3.0** - literature notes from Zotero, with a template and an Obsidian vault's settings; citations as `[[@citekey]]`
- **0.2.1** - the shortcut moves from Ctrl+Alt+C to Ctrl+Alt+R
- **0.2.0** - a tool for Textus AI, `search_library`
- **0.1.3** - listed for the desktop only
- **0.1.2** - works with Zotero 10's local API; the references list is replaced when made again, and code is never read for citations
- **0.1.0-0.1.1** - first versions: citing with recent works first, hover cards for citations, the references list, four citation styles

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `search_library`: Durchsucht die Zotero-Bibliothek des Nutzers auf diesem Computer (Zotero 7 oder neuer muss laufen): Schlüssel, Titel, Autoren, Jahr, Art, Erscheinungsort und Zitierschlüssel jedes Eintrags sowie das Zitat zum Einfügen im gewählten Stil. Schlägt mit einem Hinweis fehl, wenn Zotero nicht erreichbar ist.
<!-- /ai-tools -->

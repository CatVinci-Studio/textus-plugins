# Zotero

Zitiere beim Schreiben aus deiner Zotero-Bibliothek.

## Bevor du anfängst

Zotero 7 oder neuer (auch Zotero 10) muss auf demselben Computer laufen, mit **Einstellungen › Erweitert › „Anderen Anwendungen auf diesem Computer erlauben, mit Zotero zu kommunizieren“** eingeschaltet. Das Plugin spricht nur mit Zotero auf deinem Computer; nichts verlässt ihn. Es läuft auf dem Desktop.

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

- **0.4.3** - Ein Zitat ersetzt jetzt die markierten Wörter; das Literaturverzeichnis meldet nicht mehr, Zotero sei nicht erreichbar, wenn es antwortet, und die Vorschau beim Überfahren erscheint zuverlässiger.
- **0.4.2** - Kürzere Hilfe- und Leertexte.
- **0.4.1** - Sein Code ist nach Aufgaben in kleinere Dateien aufgeteilt; in der Nutzung ändert sich nichts.
- **0.4.0** - Vorlagen für Literaturnotizen füllt die Vorlagen-Engine von Textus; braucht Textus 1.3.10
- **0.3.0** - Literaturnotizen aus Zotero, mit Vorlage und den Einstellungen eines Obsidian-Vaults; Zitate als `[[@citekey]]`
- **0.2.1** - das Tastenkürzel wechselt von Ctrl+Alt+C zu Ctrl+Alt+R
- **0.2.0** - ein Werkzeug für Textus AI, `search_library`
- **0.1.3** - nur noch für den Desktop angeboten
- **0.1.2** - funktioniert mit der lokalen API von Zotero 10; das Literaturverzeichnis wird beim erneuten Einfügen ersetzt, und Code wird nicht mehr als Zitat gelesen
- **0.1.0-0.1.1** - erste Versionen: Zitieren mit zuletzt zitierten Werken oben, Karten beim Zeigen auf ein Zitat, das Literaturverzeichnis, vier Zitierweisen

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `search_library`: Durchsucht die Zotero-Bibliothek des Nutzers auf diesem Computer (Zotero 7 oder neuer muss laufen): Schlüssel, Titel, Autoren, Jahr, Art, Erscheinungsort und Zitierschlüssel jedes Eintrags sowie das Zitat zum Einfügen im gewählten Stil. Schlägt mit einem Hinweis fehl, wenn Zotero nicht erreichbar ist.
<!-- /ai-tools -->

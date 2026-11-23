# Schnellnotizen

Notieren Sie etwas, ohne das Dokument zu verlassen; die Notiz landet in der Eingangsdatei Ihres Ordners oder in der heutigen Tagesnotiz.

- **Strg+Alt+N** (**⌘⌥N** auf dem Mac) oder **Plugins › Neue Schnellnotiz…** fragt nach einer Notiz und speichert sie.
- Auf dem Desktop steht **Neue Schnellnotiz…** auch im Symbol im Infobereich oder in der Menüleiste. Das Plugin bittet Textus, im Hintergrund weiterzulaufen, daher ist es auch da, wenn alle Fenster geschlossen sind.
- Der Reiter **Schnellnotizen** in der Seitenleiste listet die Notizen, die neueste oben. Klicken Sie auf **Neu**, um dort eine zu schreiben, oder ändern Sie eine Notiz direkt in der Liste.
- Das Aktionsmenü jeder Notiz (ihre Mehr-Schaltfläche oder Rechtsklick) bietet **Einfügen** (an der Einfügemarke im Dokument), **Öffnen** und **Löschen**. Eine Notiz, die in einem Dokument steht, öffnet sich dort an ihrer Zeile.
- Aus Versehen gelöscht? **Rückgängig** unten holt sie für ein paar Sekunden zurück. Eine neue, leer gelassene Notiz verschwindet von selbst.
- Ab sechs Notizen erscheint oben ein Suchfeld.

## Wo die Notizen stehen

Die Notizen stehen in einem Dokument des geöffneten Ordners, so sehen Obsidian und Cloud Sync sie. Wählen Sie den Ort unter **Notizen speichern in** in den Einstellungen des Plugins:

- **Eingangsdatei** (Standard): `Inbox.md` oben im Ordner oder ein anderes Dokument, das unter **Eingangsdatei** eingetragen ist. Jede Notiz kommt ans Ende, als Listeneintrag mit Datum und Uhrzeit, etwa `- 2026-11-08 14:05 Anna anrufen`.
- **Heutige Tagesnotiz**: unter einer Überschrift `## Schnelle Notizen` (in der Sprache der Oberfläche), die bei Bedarf angelegt wird. Jede Notiz trägt ihre Uhrzeit, etwa `- 14:05 Anna anrufen`. Ordner, Name und Vorlage der Tagesnotiz folgen den Tagesnotiz-Einstellungen des Ordners, etwa denen von Obsidian; ohne sie ist es `Daily/YYYY-MM-DD.md`.

Ändern Sie die Datei, folgt die Seitenleiste. Notizen aus älteren Versionen wandern einmal dorthin, die älteste zuerst. Ohne geöffneten Ordner bleiben die Notizen in Textus.

Auf dem Telefon steht **Neue Schnellnotiz…** unter **Plugins** im Menü der Titelzeile, und die Aktionen einer Notiz liegen hinter ihrer Mehr-Schaltfläche. Dort gibt es keinen Infobereich, daher bittet das Plugin nicht darum, Textus im Hintergrund laufen zu lassen.

## Berechtigungen

- Dateien lesen und schreiben: für die Eingangsdatei oder die Tagesnotiz.
- Dokument bearbeiten: um eine Notiz an der Einfügemarke einzufügen.
- Werkzeuge für Textus AI: damit Textus AI eine Schnellnotiz hinzufügen kann.

## Änderungen

- **0.6.0** - On iPhone, iPad and Android too: **New Quick Note…** under Plugins and the sidebar tab, with New and each note's more button easy to tap. Only the desktop asks to keep Textus running in the background. Needs Textus 1.4.7. Its page no longer says which devices it runs on: the store shows that.
- **0.5.5** - Its buttons' names and tooltips come from Textus, as on its other pages.
- **0.5.4** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.5.3** - New while searching clears the search, so the new note shows; right-clicking a note's text also offers undo, cut, copy and paste; a search with no match says so.
- **0.5.2** - In the sidebar the panel draws no title of its own, as the sidebar's other tabs. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout. An empty list says what Quick Notes is for and offers New; a note's box grows with its text.
- **0.5.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.5.0** - Dates and the daily note's template are filled by Textus itself, the same way as in Calendar & Daily Notes and Templates. Needs Textus 1.3.10.
- **0.4.0** - Notes are kept in a document of the folder: `Inbox.md` or today's daily note. Notes from older versions move in once.
- **0.3.1** - Textus AI tells quick notes apart from the daily journal and to-dos.
- **0.3.0** - Textus AI can add a quick note (`add_note`).
- **0.2.0** - Textus's own controls, and an actions menu for each note.
- **0.1.0-0.1.4** - First versions: the shortcut and the tray, the sidebar list, insert, open, delete with Undo, search once there are many, dates on a line of their own; desktop only.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `add_note`: Fügt oben in der Liste der Schnellnotizen in der Seitenleiste eine Notiz hinzu, die sich später in ein Dokument einfügen oder als Dokument öffnen lässt. Das heutige Journal ist append_to_daily_note; eine Aufgabe add_task.
<!-- /ai-tools -->

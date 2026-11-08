# Schnellnotizen

Notieren Sie etwas, ohne das Dokument zu verlassen; die Notiz landet in der Eingangsdatei Ihres Ordners oder in der heutigen Tagesnotiz.

- **Strg+Alt+N** (**⌘⌥N** auf dem Mac) oder **Plugins › Neue Schnellnotiz…** fragt nach einer Notiz und speichert sie.
- **Neue Schnellnotiz…** steht auch im Symbol im Infobereich oder in der Menüleiste. Das Plugin bittet Textus, im Hintergrund weiterzulaufen, daher ist es auch da, wenn alle Fenster geschlossen sind.
- Der Reiter **Schnellnotizen** in der Seitenleiste listet die Notizen, die neueste oben. Klicken Sie auf **Neu**, um dort eine zu schreiben, oder ändern Sie eine Notiz direkt in der Liste.
- Das Aktionsmenü jeder Notiz (ihre Mehr-Schaltfläche oder Rechtsklick) bietet **Einfügen** (an der Einfügemarke im Dokument), **Öffnen** und **Löschen**. Eine Notiz, die in einem Dokument steht, öffnet sich dort an ihrer Zeile.
- Aus Versehen gelöscht? **Rückgängig** unten holt sie für ein paar Sekunden zurück. Eine neue, leer gelassene Notiz verschwindet von selbst.
- Ab sechs Notizen erscheint oben ein Suchfeld.

## Wo die Notizen stehen

Die Notizen stehen in einem Dokument des geöffneten Ordners, so sehen Obsidian und Cloud Sync sie. Wählen Sie den Ort unter **Notizen speichern in** in den Einstellungen des Plugins:

- **Eingangsdatei** (Standard): `Inbox.md` oben im Ordner oder ein anderes Dokument, das unter **Eingangsdatei** eingetragen ist. Jede Notiz kommt ans Ende, als Listeneintrag mit Datum und Uhrzeit, etwa `- 2026-11-08 14:05 Anna anrufen`.
- **Heutige Tagesnotiz**: unter einer Überschrift `## Schnelle Notizen` (in der Sprache der Oberfläche), die bei Bedarf angelegt wird. Jede Notiz trägt ihre Uhrzeit, etwa `- 14:05 Anna anrufen`. Ordner, Name und Vorlage der Tagesnotiz folgen den Tagesnotiz-Einstellungen des Ordners, etwa denen von Obsidian; ohne sie ist es `Daily/YYYY-MM-DD.md`.

Ändern Sie die Datei, folgt die Seitenleiste. Notizen aus älteren Versionen wandern einmal dorthin, die älteste zuerst. Ohne geöffneten Ordner bleiben die Notizen in Textus.

Läuft auf dem Desktop.

## Berechtigungen

- Dateien lesen und schreiben: für die Eingangsdatei oder die Tagesnotiz.
- Dokument bearbeiten: um eine Notiz an der Einfügemarke einzufügen.
- Werkzeuge für Textus AI: damit Textus AI eine Schnellnotiz hinzufügen kann.

## Änderungen

- **0.5.0** - Datumsangaben und die Vorlage der Tagesnotiz füllt Textus selbst aus, wie bei Kalender und Tagesnotizen und bei Vorlagen. Benötigt Textus 1.3.10.
- **0.4.0** - Notizen stehen in einem Dokument des Ordners: `Inbox.md` oder der heutigen Tagesnotiz. Notizen älterer Versionen wandern einmal dorthin.
- **0.3.1** - Textus AI unterscheidet Schnellnotizen vom Tagebuch und von Aufgaben.
- **0.3.0** - Textus AI kann eine Schnellnotiz hinzufügen (`add_note`).
- **0.2.0** - Textus' eigene Bedienelemente und ein Aktionsmenü für jede Notiz.
- **0.1.0-0.1.4** - Erste Versionen: Tastenkürzel und Infobereich, die Liste in der Seitenleiste, Einfügen, Öffnen, Löschen mit Rückgängig, Suche bei vielen Notizen, Datum auf eigener Zeile; nur Desktop.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `add_note`: Fügt oben in der Liste der Schnellnotizen in der Seitenleiste eine Notiz hinzu, die sich später in ein Dokument einfügen oder als Dokument öffnen lässt. Das heutige Journal ist append_to_daily_note; eine Aufgabe add_task.
<!-- /ai-tools -->

# Schnellvorschau

Lesen Sie, wohin ein Link führt, ohne ihn zu öffnen: Ruht der Zeiger auf einem Link zu einem anderen Dokument, zeigt eine Karte dessen Text.

- Lassen Sie den Zeiger auf einem Link zu einem anderen Dokument ruhen, einem Markdown-Link oder einem [[Wiki-Link]].
- Eine Karte daneben zeigt den Anfang des Dokuments, ohne seine Eigenschaften. Bei einem Link auf eine Überschrift (`#Überschrift`) zeigt sie diesen Abschnitt, bei einem Link auf einen Block (`#^id`) diesen Block.
- Die Karte zeigt bis zu etwa 1.500 Zeichen, am Ende eines Absatzes abgeschnitten. **Öffnen** geht zum Dokument; **Anheften** hält die Karte offen, während Sie schreiben.
- Nur Dokumente im geöffneten Ordner werden angezeigt.

Das Plugin fragt nach Lesezugriff auf den Editor (um zu sehen, auf welchen Link Sie zeigen) und auf Dateien (um das verlinkte Dokument zu zeigen). Es ändert nie eine Datei. Es läuft auf dem Desktop sowie auf iPhone und iPad.

## Änderungen

- **0.2.3** - The store description now opens with what the plugin does.
- **0.2.2** - A link to a nested heading (`[[Note#A#B]]`) shows that heading's section, as a click opens it. Needs Textus 1.4.0.
- **0.2.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.0** - A link to a block (`#^id`) shows that block. Needs Textus 1.3.9.
- **0.1.3** - Says where it runs: the desktop, iPhone and iPad.
- **0.1.2** - The card's length is fixed instead of a setting.
- **0.1.0-0.1.1** - First versions: a card for links to documents, with the document's opening or the section the link names, and Open and Pin.

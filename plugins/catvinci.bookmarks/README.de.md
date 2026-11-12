# Lesezeichen

Setzen Sie ein Lesezeichen auf eine Stelle und springen Sie über die Seitenleiste dorthin zurück, in jedem Dokument.

Markieren Sie ein paar Wörter und wählen Sie **Auswahl als Lesezeichen**: per Rechtsklick auf die Auswahl oder über **Plugins › Auswahl als Lesezeichen**. Speichern Sie das Dokument vorher, denn das Lesezeichen verweist auf seine Datei.

Der Reiter **Lesezeichen** in der Seitenleiste listet sie nach Dokument. Ein Klick öffnet das Dokument an diesen Wörtern. Zum Entfernen klicken Sie ein Lesezeichen mit rechts an und wählen **Lesezeichen entfernen**. Wird ein Dokument umbenannt oder verschoben, folgen ihm seine Lesezeichen.

## Obsidian-Vaults

Ist der geöffnete Ordner ein Obsidian-Vault (er enthält einen Ordner `.obsidian`):

- Obsidians eigene Lesezeichen aus `.obsidian/bookmarks.json` erscheinen ebenfalls im Reiter, unter **Obsidian-Lesezeichen** und in Obsidians Gruppen. Lesezeichen auf Notizen, Überschriften und Blöcke werden gelistet, Suchen, Ordner und Ähnliches nicht.

## Berechtigungen

- Dokument lesen: um die Auswahl zu lesen.
- Dateien lesen: für Obsidians `bookmarks.json`.
- Werkzeuge für Textus AI: damit Textus AI Ihre Lesezeichen auflisten kann.

## Änderungen

- **0.4.4** - Obsidians Lesezeichen werden weiter gelistet, aber nicht mehr zurückgeschrieben: Seit Textus 1.4 ändern Plugins `.obsidian` nicht. Braucht Textus 1.4.0.
- **0.4.3** - Die Liste ist nach dem Pfad des Dokuments im Ordner gruppiert, eine Gruppe pro Dokument; lange Stellen enden an einem Wort mit „…“; scheitert die Block-ID in einem Vault, bleibt das Lesezeichen trotzdem erhalten.
- **0.4.2** - Kürzere Hilfe- und Leertexte.
- **0.4.1** - Seine Seite sagt jetzt in einem Satz, was es tut, was es kann und was sich in jeder Version geändert hat.
- **0.4.0** - In einem Obsidian-Vault werden neue Lesezeichen auch in Obsidians `bookmarks.json` geschrieben und dort entfernt und umbenannt.
- **0.3.0** - Listet Obsidians eigene Lesezeichen des Vaults auf Notizen, Überschriften und Blöcke.
- **0.2.1** - Pfade über Code, den sich mehrere Plugins teilen; in der Bedienung ändert sich nichts.
- **0.2.0** - Textus AI kann Ihre Lesezeichen auflisten (`list_bookmarks`).
- **0.1.0-0.1.2** - Erste Versionen: Auswahl als Lesezeichen, Liste nach Dokument in der Seitenleiste, Lesezeichen folgen Umbenennungen; Store-Seite und Symbol; läuft auf dem Desktop und unter iOS.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `list_bookmarks`: Listet die Lesezeichen des Nutzers auf: die markierten Worte in jedem Dokument, mit dem Pfad des Dokuments im geöffneten Ordner.
<!-- /ai-tools -->

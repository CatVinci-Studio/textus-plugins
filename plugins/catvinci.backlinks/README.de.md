# Bidirektionale Links

> Links wie `[[Notiz]]` sind in Textus eingebaut: Sie schreiben und öffnen sie ohne Plugin. Dieses Plugin hilft beim Schreiben, zeigt an Ort und Stelle, worauf sie zeigen, und listet, wer auf das geöffnete Dokument verlinkt.

## Verlinken beim Schreiben

- Tippe `[[` und wähle im Panel, das sich öffnet, eine Notiz – nach Namen, erster Überschrift oder einem `aliases`-Eintrag im Front Matter. Ein Alias wird als `[[Notiz|Alias]]` geschrieben.
- Nach `#` die Überschriften der Notiz: `[[Notiz#Überschrift]]`. `[[#` listet die des Dokuments selbst.
- Nach `#^` ihre Blöcke: Absätze, Listeneinträge, Tabellen, Zitate. Einer ohne ID bekommt in dieser Notiz eine an seinem Ende (`^1a2b3c`), so wie Obsidian sie schreibt.
- Markiere ein paar Wörter und tippe `[[`, um sie zu einem Link zu machen.
- Links werden so geschrieben, wie der Ordner sie schreibt: in einem Obsidian-Vault im Linkformat des Vaults.

## Einbettungen

- `![[Notiz]]` zeigt die Notiz an Ort und Stelle, `![[Notiz#Überschrift]]` diesen Abschnitt und `![[Notiz#^id]]` diesen Block – schreibgeschützt und aktuell, wenn sich die Notiz ändert.
- Setze den Cursor in die Zeile, um den Link selbst zu bearbeiten.

## Rückverweise in der Seitenleiste

Was auf das geöffnete Dokument verlinkt und wohin es verlinkt – im Tab **Bidirektionale Links** der Seitenleiste.

- **Verlinkte Erwähnungen**: die Zeilen anderer Notizen, die mit [[Wiki-Links]] oder Links auf diese Datei hierher führen. Ein Klick springt dorthin.
- **Unverlinkte Erwähnungen**: Zeilen, die diese Notiz – nach Dateiname, erster Überschrift oder `aliases` im Front Matter – ohne Link nennen. Rechtsklick und **Verlinken** macht daraus einen [[Link]].
- **Ausgehende Links**: die Notizen, auf die diese verlinkt, auch solche, die es noch nicht gibt.
- Das Feld oben filtert die Liste.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `list_backlinks`: Listet für ein Dokument - das vordere, wenn kein Pfad angegeben ist - die Notizen auf, die darauf verlinken (Pfad, Zeile, Text der Zeile), die Zeilen, die es ohne Link nennen, und die Notizen, auf die es verlinkt.
<!-- /ai-tools -->

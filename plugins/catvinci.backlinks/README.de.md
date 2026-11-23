# Bidirektionale Links

Verlinke Notizen, Überschriften und Blöcke beim Tippen von `[[`, bette sie mit `![[` ein und sieh in der Seitenleiste, was auf das geöffnete Dokument verlinkt.

Links wie `[[Notiz]]` sind in Textus eingebaut: Du kannst sie ohne Plugin schreiben und öffnen. Dieses Plugin hilft beim Schreiben, zeigt an Ort und Stelle, worauf ein Link zeigt, und sammelt die Links rund um das Dokument, das du liest. Es läuft auf dem Desktop und unter iOS.

## Beim Tippen verlinken

- Tippe `[[` und wähle im Feld, das sich öffnet, eine Notiz – nach Dateiname, erster Überschrift oder einem `aliases`-Eintrag im Front Matter. Ein Alias wird als `[[Notiz|Alias]]` geschrieben.
- Nach `#` die Überschriften der Notiz: `[[Notiz#Überschrift]]`. `[[#` zeigt die des eigenen Dokuments.
- Nach `#^` ihre Blöcke: Absätze, Listenpunkte, Tabellen, Zitate. Ein Block ohne ID bekommt in dieser Notiz eine an seinem Ende (`^1a2b3c`), so wie Obsidian sie schreibt.
- Markiere ein paar Wörter und tippe `[[`, um daraus einen Link zu machen.
- Links werden so geschrieben, wie der Ordner sie schreibt: nach seiner eigenen Wahl oder dem Linkformat eines Obsidian-Vaults; sonst so, wie die Notiz schon verlinkt; sonst als Standardlink, `[Nov 8](Week45/Nov%208.md)`, der sich in jeder App öffnet. Ein [[Link]], der einen Pfad braucht, zeigt den Namen der Notiz.

## Einbettungen

- `![[Notiz]]` zeigt die Notiz an Ort und Stelle, `![[Notiz#Überschrift]]` diesen Abschnitt und `![[Notiz#^id]]` diesen Block. Einbettungen sind schreibgeschützt und folgen Änderungen an der Notiz.
- Setze den Cursor in die Zeile, um den Link selbst zu bearbeiten.

## Links in der Seitenleiste

Der Tab **Bidirektionale Links** in der Seitenleiste zeigt, was auf das geöffnete Dokument verlinkt und wohin es verlinkt.

- **Verlinkte Erwähnungen**: die Zeilen anderer Notizen, die hierher verlinken – mit [[Wiki-Links]] oder Links auf diese Datei. Ein Klick führt dorthin.
- **Unverlinkte Erwähnungen**: Zeilen, die diese Notiz nennen (nach Dateiname, erster Überschrift oder `aliases`), ohne zu verlinken. Rechtsklick und **Verlinken** macht daraus einen Link. Steht in der Zeile ein Alias, bleibt er der Text des Links.
- **Ausgehende Links**: die Notizen, auf die diese verlinkt, auch solche, die es noch nicht gibt.
- Das Feld oben filtert die Liste.

## Standardlinks oder [[Wikilinks]]

- **Plugins › Neue Links: Standard oder [[Wiki]]…** wählt, wie neue Links im geöffneten Ordner geschrieben werden. Die Wahl steht in der `.textus/settings.json` des Ordners; Textus und die anderen Plugins folgen ihr.
- **Plugins › Links in Standardlinks umwandeln…** und **Links in [[Wikilinks]] umwandeln…** schreiben die Links des Dokuments im Vordergrund oder aller Notizen im Ordner um. Sie sagen zuerst, wie viele Links sich ändern; jeder führt weiter zum selben Ziel. Code, Front Matter und ein Link, dessen Notiz nicht zu finden ist, bleiben, wie sie sind; Bilder und andere Dateien bleiben Standardlinks.

## Berechtigungen

- **Dokument lesen und bearbeiten**: um Links beim Tippen zu vervollständigen und eine Auswahl zum Link zu machen.
- **Dateien im geöffneten Ordner lesen und schreiben**: um Links und Erwähnungen zu finden, eine unverlinkte Erwähnung zu verlinken und einem Block seine `^id` zu geben.
- **Werkzeuge für Textus AI**: damit Textus AI die Links eines Dokuments auflisten kann.

## Änderungen

- **0.4.7** - Code kept for Textus versions it no longer runs on is gone.
- **0.4.6** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.4.5** - Unlinked mentions open on the right line, and Link Style is set by Textus itself (Textus 1.4.3).
- **0.4.4** - The Convert Links commands leave links inside a code block alone and convert the ones after it, and Unlinked mentions no longer lists or links names in front matter or code.
- **0.4.3** - Standard links to notes that don't exist yet now show under Outgoing links, a note's links to its own headings no longer list the note itself, and dragging a divider no longer redraws the panel.
- **0.4.2** - Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.4.1** - In a note with no links yet, [[ writes a standard link: the [[ being typed was taken for a wiki link the note already had.
- **0.4.0** - New Links: Standard or [[Wiki]]… chooses how the folder writes new links, and Convert Links turns a note's or the whole folder's links from one way into the other; [[ writes the folder's way, a standard link where nothing says otherwise.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - `[[` completion for notes, headings and blocks; `![[` embeds; renamed from Backlinks to Two-way Links
- **0.2.1** - the description says "two-way links", so a store search finds it
- **0.2.0** - a tool for Textus AI, `list_backlinks`
- **0.1.0-0.1.1** - first versions: linked and unlinked mentions with **Link**, outgoing links and a filter; suggested for documents with wiki links

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `list_backlinks`: Listet für ein Dokument - das vordere, wenn kein Pfad angegeben ist - die Notizen auf, die darauf verlinken (Pfad, Zeile, Text der Zeile), die Zeilen, die es ohne Link nennen, und die Notizen, auf die es verlinkt.
<!-- /ai-tools -->

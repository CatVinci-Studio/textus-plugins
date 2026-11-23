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

- **0.4.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.4.4** - Obsidian's bookmarks are listed as before but no longer written: Textus 1.4 keeps plugins out of `.obsidian`. Needs Textus 1.4.0.
- **0.4.3** - Rows are grouped by the document's path in the folder, one group per document; long passages end at a word with "…"; a failed block-id edit in a vault keeps the bookmark.
- **0.4.2** - Shorter help and empty-state text.
- **0.4.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.0** - In an Obsidian vault, new bookmarks are written to Obsidian's `bookmarks.json` too, and removed and renamed there.
- **0.3.0** - Lists the vault's own Obsidian bookmarks of notes, headings and blocks.
- **0.2.1** - Paths handled by code shared with other plugins; nothing changes in use.
- **0.2.0** - Textus AI can list your bookmarks (`list_bookmarks`).
- **0.1.0-0.1.2** - First versions: bookmark a selection, the sidebar list by document, bookmarks that follow renames; store page and icon; runs on desktop and iOS.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `list_bookmarks`: Listet die Lesezeichen des Nutzers auf: die markierten Worte in jedem Dokument, mit dem Pfad des Dokuments im geöffneten Ordner.
<!-- /ai-tools -->

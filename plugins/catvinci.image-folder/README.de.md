# Bilder beim Dokument

Legt die Bilder jedes Dokuments in einen gleichnamigen Ordner direkt daneben, wie Typora und VS Code: Die Bilder von `Note.md` kommen nach `Note.assets/`.

Es gibt nichts einzuschalten oder einzustellen; nach der Installation arbeitet es von selbst.

- Fügen Sie ein Bild in ein gespeichertes Dokument ein oder ziehen Sie es hinein. Textus speichert das Bild zuerst, dann verschiebt dieses Plugin es in den Bilderordner des Dokuments und ändert den Link in `Note.assets/bild.png`. Ein schon vergebener Name bekommt eine Nummer; nichts wird überschrieben. Lässt sich der Link nicht ändern, kommt das Bild an seinen alten Platz zurück.
- Benennen Sie ein Dokument in seinem Ordner um, wird sein Bilderordner mit umbenannt, samt Links - außer ein anderes Dokument verlinkt ebenfalls in diesen Ordner; dann bleibt beides, wie es ist.
- Bilder, die schon in Ihren Dokumenten sind, bleiben, wo sie sind.
- In einem Obsidian-Vault mit eingestelltem Anhangsordner und in einem Logseq-Graphen bleiben Bilder dort, wo diese App sie ablegt.

Es verarbeitet PNG-, JPEG-, GIF-, WebP-, AVIF-, BMP-, SVG-, ICO-, HEIC- und TIFF-Bilder. Es läuft auf dem Desktop und braucht Textus 1.3.0 oder neuer. Es fragt nach Lese- und Schreibzugriff auf Dateien, um Bilder zu verschieben und ihre Ordner umzubenennen, und nach Lesen und Bearbeiten des geöffneten Dokuments, um den Link auf ein verschobenes Bild zu ändern.

## Änderungen

- **0.1.8** - Its page no longer says which devices it runs on: the store shows that. It names the Textus it needs, 1.4.0.
- **0.1.7** - The store description now opens with what the plugin does.
- **0.1.6** - Adding many pictures at once (a sync, a folder copied in) no longer reads the open document over and over.
- **0.1.5** - In an Obsidian vault, pictures stay where the vault's attachment setting puts them again: the setting is read through Textus.
- **0.1.4** - Leaves pictures where a document's Typora image folder setting puts them, and no longer moves a folder while some links to it may still be unchecked.
- **0.1.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.2** - Leaves pictures where an Obsidian vault's attachment folder setting or a Logseq graph puts them.
- **0.1.1** - A shorter name: Images Follow Document.
- **0.1.0** - First version: pasted and dropped pictures move into `Note.assets/`, and the folder follows a renamed document.

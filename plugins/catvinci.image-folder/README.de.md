# Bilder beim Dokument

Legt die Bilder jedes Dokuments in einen gleichnamigen Ordner direkt daneben, wie Typora und VS Code: Die Bilder von `Note.md` kommen nach `Note.assets/`.

Es gibt nichts einzuschalten oder einzustellen; nach der Installation arbeitet es von selbst.

- Fügen Sie ein Bild in ein gespeichertes Dokument ein oder ziehen Sie es hinein. Textus speichert das Bild zuerst, dann verschiebt dieses Plugin es in den Bilderordner des Dokuments und ändert den Link in `Note.assets/bild.png`. Ein schon vergebener Name bekommt eine Nummer; nichts wird überschrieben. Lässt sich der Link nicht ändern, kommt das Bild an seinen alten Platz zurück.
- Benennen Sie ein Dokument in seinem Ordner um, wird sein Bilderordner mit umbenannt, samt Links - außer ein anderes Dokument verlinkt ebenfalls in diesen Ordner; dann bleibt beides, wie es ist.
- Bilder, die schon in Ihren Dokumenten sind, bleiben, wo sie sind.
- In einem Obsidian-Vault mit eingestelltem Anhangsordner und in einem Logseq-Graphen bleiben Bilder dort, wo diese App sie ablegt.

Es verarbeitet PNG-, JPEG-, GIF-, WebP-, AVIF-, BMP-, SVG-, ICO-, HEIC- und TIFF-Bilder. Es läuft auf dem Desktop und braucht Textus 1.3.0 oder neuer. Es fragt nach Lese- und Schreibzugriff auf Dateien, um Bilder zu verschieben und ihre Ordner umzubenennen, und nach Lesen und Bearbeiten des geöffneten Dokuments, um den Link auf ein verschobenes Bild zu ändern.

## Änderungen

- **0.1.7** - Die Store-Beschreibung beginnt jetzt mit dem, was das Plugin tut.
- **0.1.6** - Viele Bilder auf einmal (eine Synchronisierung, ein kopierter Ordner) lesen das offene Dokument nicht mehr immer wieder.
- **0.1.5** - In einem Obsidian-Vault bleiben Bilder wieder dort, wo die Anhang-Einstellung des Vaults sie ablegt: Die Einstellung wird über Textus gelesen.
- **0.1.4** - Lässt Bilder dort, wo die Typora-Bildordner-Einstellung eines Dokuments sie ablegt, und verschiebt keinen Ordner mehr, solange Links darauf noch ungeprüft sein könnten.
- **0.1.3** - Seine Seite sagt jetzt in einem Satz, was es tut, was es kann und was sich in jeder Version geändert hat.
- **0.1.2** - Lässt Bilder dort, wo der Anhangsordner eines Obsidian-Vaults oder ein Logseq-Graph sie ablegt.
- **0.1.1** - Ein kürzerer Name: Bilder beim Dokument.
- **0.1.0** - Erste Version: eingefügte und hineingezogene Bilder kommen nach `Note.assets/`, und der Ordner folgt dem umbenannten Dokument.

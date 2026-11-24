# Logseq-Ordner

Öffnet einen Logseq-Graphen so, wie Logseq ihn schreibt: Links per Seitenname, Bilder in assets, Journale in ihrem Ordner und Datumsformat.

## Was es tut

- Ist der Ordner, den Sie öffnen, oder ein Ordner darüber ein Logseq-Graph, der als Dateien gespeichert ist (er hat `logseq/config.edn`), schreibt Textus Links per Seitenname (`[[Page]]`), legt Seiten, die aus einem Link entstehen, in `pages/` (oder Ihrem `:pages-directory`) ab, und das Plugin **Kalender und Tagesnotizen** legt Journale in `journals/` ab, benannt nach Ihrem `:journal/file-name-format`.
- Den Bilderordner von Logseq, `assets/`, bietet einmal eine Karte in der Ecke an. Nehmen Sie ihn, wird er in der `.textus/settings.json` des Ordners gespeichert; behalten Sie Ihren, fragt Textus nicht wieder.
- Wikilinks im Graphen werden auch ohne dieses Plugin vom Ordner des Graphen aus gefunden.

## Berechtigungen

Es fragt nur danach, **die Dateien des geöffneten Ordners zu lesen**: Textus gibt ihm `logseq/config.edn`, und es sagt, was die Datei bedeutet. Es ändert nichts.

## Änderungen

- **0.1.2** - A simpler icon, drawn in the text colour.
- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it.
- **0.1.0** - First version: Logseq's settings offered when a Logseq graph is opened. Needs Textus 1.4.6.

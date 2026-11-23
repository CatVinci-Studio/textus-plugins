# Zeitleiste

Zeichnet Ereignisse als Zeitleiste, eines pro Zeile: wann | was | mehr.

## Eine Zeitleiste zeichnen

- Schreibe einen Codeblock in `timeline` mit einem Ereignis pro Zeile: wann, was, und auf Wunsch eine Notiz, getrennt durch `|`. Die Zeitleiste erscheint darunter, und die Quelle zeigt sich wieder, wenn du in den Block klickst.
- Die Ereignisse stehen in der Reihenfolge, in der du sie schreibst, an einer Linie mit je einem Punkt. „Wann“ kann beliebiger Text sein: ein Datum, ein Jahr, „Tag 3“.
- Leere Zeilen werden übersprungen. Was nach einem dritten `|` steht, wird nicht gezeigt.
- `height=400` nach der Sprache legt die Höhe der Zeichnung fest.
- Sie nimmt die Farben des Themes und wird beim Themewechsel neu gezeichnet.
- Beim Export nach HTML, PDF oder Word kommt die Zeitleiste als Bild mit.

## Beispiel

```timeline
2024-03 | Erster Entwurf | Gliederung und zwei Kapitel
2024-09 | Durchsicht | Anmerkungen von drei Lesern
2025-01 | Erschienen
```

## Berechtigungen

Es braucht nur **Werkzeuge für Textus AI**, damit Textus AI einen Block prüfen kann, bevor es ihn schreibt. Es liest keine Dateien und zeichnet alles auf deinem Gerät, auf dem Desktop und unter iOS.

## Änderungen

- **0.4.0** - A database can be shown as a timeline: pick Timeline among its views, and its dated rows line up in order; a click opens a row. Needs Textus 1.4.6.
- **0.3.3** - A date no longer breaks in the middle ("2024-0" over "3"); a chart drawn while its block was folded fits once it opens.
- **0.3.2** - long notes and dates wrap to fit a narrow island, the timeline uses the document's font, and an empty block says what to write
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - a tool for Textus AI, `check_timeline`
- **0.2.0** - the theme's colors, drawn again when the theme changes
- **0.1.3** - text in the theme's colors on Textus 1.3
- **0.1.2** - keeps up with quick edits: an older drawing never replaces a newer one
- **0.1.0-0.1.1** - first versions: events drawn as a timeline, a height setting, pictures in exports

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `check_timeline`: Prüft die Quelle eines ```timeline-Blocks - ein Ereignis pro Zeile, geschrieben als wann | was | mehr -, bevor er in ein Dokument kommt, ohne ihn zu zeichnen. Gibt ok zurück oder die Probleme, die zuerst zu beheben sind. Die Quelle ohne ihren Zaun übergeben.
<!-- /ai-tools -->

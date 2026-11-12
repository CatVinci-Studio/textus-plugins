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

- **0.3.2** - lange Notizen und Daten brechen in einem schmalen Bereich um, die Schrift des Dokuments wird verwendet, und ein leerer Block sagt, was hineingehört
- **0.3.1** - Seine Seite sagt jetzt in einem Satz, was es tut, was es kann und was sich in jeder Version geändert hat.
- **0.3.0** - ein Werkzeug für Textus AI, `check_timeline`
- **0.2.0** - die Farben des Themes, neu gezeichnet beim Themewechsel
- **0.1.3** - Text in den Farben des Themes unter Textus 1.3
- **0.1.2** - hält mit schnellem Tippen Schritt: eine ältere Zeichnung ersetzt keine neuere mehr
- **0.1.0-0.1.1** - erste Versionen: Ereignisse als Zeitleiste, Höhe einstellbar, Bilder im Export

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `check_timeline`: Prüft die Quelle eines ```timeline-Blocks - ein Ereignis pro Zeile, geschrieben als wann | was | mehr -, bevor er in ein Dokument kommt, ohne ihn zu zeichnen. Gibt ok zurück oder die Probleme, die zuerst zu beheben sind. Die Quelle ohne ihren Zaun übergeben.
<!-- /ai-tools -->

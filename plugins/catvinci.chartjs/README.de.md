# Chart.js

Zeichnet einfache Diagramme - Linien, Balken, Kreise und mehr - aus einer Chart.js-Konfiguration in einem Codeblock.

Schreiben Sie einen Codeblock mit der Sprache `chartjs`, der eine Chart.js-4-Konfiguration enthält: `type`, `data` mit `labels` und `datasets` und bei Bedarf `options`. Das Diagramm erscheint direkt darunter, und ein Klick in den Block zeigt die Quelle wieder zum Bearbeiten.

- Diagrammtypen: `line`, `bar`, `pie`, `doughnut`, `polarArea`, `radar`, `scatter` und `bubble`.
- Die Konfiguration ist JSON, aber auch handgeschriebene Formen gehen: Schlüssel ohne Anführungszeichen, einfache Anführungszeichen, Kommas am Ende und Kommentare. Funktionen werden nicht ausgeführt.
- Datenreihen ohne eigene Farben bekommen der Reihe nach die Farben des Themes, und das Diagramm wird beim Wechsel zwischen hell und dunkel neu gezeichnet.
- Mit `height=400` hinter `chartjs` in der ersten Zeile legen Sie die Höhe in Pixeln fest (Standard 300).
- Enthält die Konfiguration einen Fehler, sagt eine Zeile unter dem Block, was nicht stimmt.
- Exporte nach HTML, PDF und Word enthalten das Diagramm als Bild.

Es braucht Textus 1.3.2 oder neuer. Es fragt nach einer einzigen Berechtigung, Werkzeuge für Textus AI, damit Textus AI einen `chartjs`-Block prüfen kann, bevor er ihn in ein Dokument schreibt.

## Beispiel

```chartjs
{
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [{ label: "Words", data: [1200, 1900, 3000] }]
  }
}
```

## Änderungen

- **0.3.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.3.4** - Its package lists the libraries it carries, with their licenses.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Charts redraw to fit a narrower or wider panel, labels follow the theme's font and text size, and the error line is red again.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - Textus AI can check a `chartjs` block before writing it (`check_chartjs`).
- **0.2.0** - Series take the theme's colors; needs Textus 1.3.2.
- **0.1.3** - Uses Textus's renamed document colors.
- **0.1.2** - While you type, the chart always shows the latest text.
- **0.1.0-0.1.1** - First versions: `chartjs` blocks drawn under their source, `height=`, pictures in exports; store page and icon.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `check_chartjs`: Prüft die Quelle eines ```chartjs-Blocks - eine Chart.js-4-Konfiguration als JSON: type, data mit labels und datasets, options -, bevor er in ein Dokument kommt, ohne ihn zu zeichnen. Gibt ok zurück oder die Probleme, die zuerst zu beheben sind. Die Quelle ohne ihren Zaun übergeben.
<!-- /ai-tools -->

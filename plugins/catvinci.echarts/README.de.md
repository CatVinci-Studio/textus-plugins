# ECharts

Zeichnet ein Diagramm in Ihr Dokument, aus einer ECharts-Option in einem Codeblock.

Schreiben Sie einen Codeblock mit der Sprache `echarts` und setzen Sie eine ECharts-Option hinein. Das Diagramm erscheint unter dem Block; ein Klick in den Block zeigt den Quelltext wieder zum Bearbeiten.

- Die Option ist JSON und darf locker geschrieben sein: Schlüssel ohne Anführungszeichen, einfache Anführungszeichen, Kommas am Ende und Kommentare gehen. Funktionen (etwa eine `formatter`-Funktion) gehen nicht, denn im Block wird nichts ausgeführt.
- Balken, Linien, Torten, Streudiagramme, Netzdiagramme, Tachos, Trichter, Bäume, Treemaps, Sunbursts, Sankey-Diagramme, Heatmaps, Kerzencharts und die übrigen ECharts-Serien werden gezeichnet. Kartenserien nicht: Sie brauchen Kartendaten, die ein Block nicht laden kann.
- `height=400` hinter der Sprache legt die Höhe des Diagramms in Pixeln fest (Standard 320).
- Das Diagramm übernimmt die Farben Ihres Themes und wird beim Wechsel des Themes neu gezeichnet.
- Lässt sich die Option nicht zeichnen, sagt der Block, was nicht stimmt.
- Beim Export als HTML, PDF oder Word kommt das Diagramm als Bild mit.

Das Plugin fragt nur nach einer Berechtigung: um Textus AI das unten aufgeführte Werkzeug `check_echarts` zu geben, das einen Block prüft, bevor Textus AI ihn in ein Dokument schreibt.

## Beispiel

```echarts
{
  xAxis: { type: "category", data: ["Mon", "Tue", "Wed"] },
  yAxis: { type: "value" },
  series: [{ type: "bar", data: [120, 200, 150] }]
}
```

## Änderungen

- **0.3.6** - A simpler icon, drawn in the text colour.
- **0.3.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.3.4** - Its package lists the libraries it carries, with their licenses.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Charts redraw when the panel width changes, and their text and default height follow the app's zoom and font.
- **0.3.1** - Its description no longer lists maps, which a block can't load.
- **0.3.0** - Textus AI can check an `echarts` block before it writes one.
- **0.2.0** - Series colors come from the theme's tones. Needs Textus 1.3.2.
- **0.1.3** - Uses the theme's document text color and footnote size under their Textus 1.3 names.
- **0.1.0-0.1.2** - First versions: `echarts` code blocks drawn in the document, `height=`, and exports as a picture.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `check_echarts`: Prüft die Quelle eines ```echarts-Blocks - eine ECharts-Option als JSON: series mit ihren Typen und die Achsen oder Komponenten, auf denen sie liegen -, bevor er in ein Dokument kommt, ohne ihn zu zeichnen. Gibt ok zurück oder die Probleme, die zuerst zu beheben sind. Die Quelle ohne ihren Zaun übergeben.
<!-- /ai-tools -->

# ECharts

Zeichnet ein Diagramm in Ihr Dokument, aus einer ECharts-Option in einem Codeblock.

Schreiben Sie einen Codeblock mit der Sprache `echarts` und setzen Sie eine ECharts-Option hinein. Das Diagramm erscheint unter dem Block; ein Klick in den Block zeigt den Quelltext wieder zum Bearbeiten.

- Die Option ist JSON und darf locker geschrieben sein: Schlüssel ohne Anführungszeichen, einfache Anführungszeichen, Kommas am Ende und Kommentare gehen. Funktionen (etwa eine `formatter`-Funktion) gehen nicht, denn im Block wird nichts ausgeführt.
- Balken, Linien, Torten, Streudiagramme, Netzdiagramme, Tachos, Trichter, Bäume, Treemaps, Sunbursts, Sankey-Diagramme, Heatmaps, Kerzencharts und die übrigen ECharts-Serien werden gezeichnet. Kartenserien nicht: Sie brauchen Kartendaten, die ein Block nicht laden kann.
- `height=400` hinter der Sprache legt die Höhe des Diagramms in Pixeln fest (Standard 320).
- Das Diagramm übernimmt die Farben Ihres Themes und wird beim Wechsel des Themes neu gezeichnet.
- Lässt sich die Option nicht zeichnen, sagt der Block, was nicht stimmt.
- Beim Export als HTML, PDF oder Word kommt das Diagramm als Bild mit.

Das Plugin fragt nur nach einer Berechtigung: um Textus AI das unten aufgeführte Werkzeug `check_echarts` zu geben, das einen Block prüft, bevor Textus AI ihn in ein Dokument schreibt. Es läuft auf dem Desktop sowie auf iPhone und iPad.

## Beispiel

```echarts
{
  xAxis: { type: "category", data: ["Mon", "Tue", "Wed"] },
  yAxis: { type: "value" },
  series: [{ type: "bar", data: [120, 200, 150] }]
}
```

## Änderungen

- **0.3.1** - Die Beschreibung nennt keine Karten mehr, die ein Block nicht laden kann.
- **0.3.0** - Textus AI kann einen `echarts`-Block prüfen, bevor es ihn schreibt.
- **0.2.0** - Die Farben der Serien kommen aus den Tönen des Themes. Benötigt Textus 1.3.2.
- **0.1.3** - Liest Textfarbe und Fußnotengröße des Dokuments unter ihren Namen aus Textus 1.3.
- **0.1.0-0.1.2** - Erste Versionen: `echarts`-Codeblöcke im Dokument gezeichnet, `height=` und Export als Bild.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `check_echarts`: Prüft die Quelle eines ```echarts-Blocks - eine ECharts-Option als JSON: series mit ihren Typen und die Achsen oder Komponenten, auf denen sie liegen -, bevor er in ein Dokument kommt, ohne ihn zu zeichnen. Gibt ok zurück oder die Probleme, die zuerst zu beheben sind. Die Quelle ohne ihren Zaun übergeben.
<!-- /ai-tools -->

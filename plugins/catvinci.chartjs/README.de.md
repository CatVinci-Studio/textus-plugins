# Chart.js

Zeichnet einfache Diagramme - Linien, Balken, Kreise und mehr - aus einer Chart.js-Konfiguration in einem Codeblock.

Schreiben Sie einen Codeblock mit der Sprache `chartjs`, der eine Chart.js-4-Konfiguration enthält: `type`, `data` mit `labels` und `datasets` und bei Bedarf `options`. Das Diagramm erscheint direkt darunter, und ein Klick in den Block zeigt die Quelle wieder zum Bearbeiten.

- Diagrammtypen: `line`, `bar`, `pie`, `doughnut`, `polarArea`, `radar`, `scatter` und `bubble`.
- Die Konfiguration ist JSON, aber auch handgeschriebene Formen gehen: Schlüssel ohne Anführungszeichen, einfache Anführungszeichen, Kommas am Ende und Kommentare. Funktionen werden nicht ausgeführt.
- Datenreihen ohne eigene Farben bekommen der Reihe nach die Farben des Themes, und das Diagramm wird beim Wechsel zwischen hell und dunkel neu gezeichnet.
- Mit `height=400` hinter `chartjs` in der ersten Zeile legen Sie die Höhe in Pixeln fest (Standard 300).
- Enthält die Konfiguration einen Fehler, sagt eine Zeile unter dem Block, was nicht stimmt.
- Exporte nach HTML, PDF und Word enthalten das Diagramm als Bild.

Läuft auf dem Desktop und auf dem iPhone und braucht Textus 1.3.2 oder neuer. Es fragt nach einer einzigen Berechtigung, Werkzeuge für Textus AI, damit Textus AI einen `chartjs`-Block prüfen kann, bevor er ihn in ein Dokument schreibt.

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

- **0.3.2** - Diagramme werden neu gezeichnet, wenn das Feld schmaler oder breiter wird; Beschriftungen folgen Schrift und Textgröße des Themes, und die Fehlerzeile ist wieder rot.
- **0.3.1** - Seine Seite sagt jetzt in einem Satz, was es tut, was es kann und was sich in jeder Version geändert hat.
- **0.3.0** - Textus AI kann einen `chartjs`-Block prüfen, bevor es ihn schreibt (`check_chartjs`).
- **0.2.0** - Datenreihen bekommen die Farben des Themes; braucht Textus 1.3.2.
- **0.1.3** - Nutzt die umbenannten Dokumentfarben von Textus.
- **0.1.2** - Beim Tippen zeigt das Diagramm immer den neuesten Text.
- **0.1.0-0.1.1** - Erste Versionen: `chartjs`-Blöcke unter ihrer Quelle gezeichnet, `height=`, Bilder beim Export; Seite im Store und Symbol.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `check_chartjs`: Prüft die Quelle eines ```chartjs-Blocks - eine Chart.js-4-Konfiguration als JSON: type, data mit labels und datasets, options -, bevor er in ein Dokument kommt, ohne ihn zu zeichnen. Gibt ok zurück oder die Probleme, die zuerst zu beheben sind. Die Quelle ohne ihren Zaun übergeben.
<!-- /ai-tools -->

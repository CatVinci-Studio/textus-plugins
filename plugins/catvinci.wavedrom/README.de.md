# WaveDrom

Zeichnet digitale Zeitdiagramme und Registerfelder aus WaveJSON.

## Ein Diagramm zeichnen

- Schreibe einen Codeblock in `wavedrom` mit WaveJSON darin. Das Diagramm erscheint darunter, und die Quelle zeigt sich wieder, wenn du in den Block klickst.
- `signal` enthält die Signale: jedes mit `name`, einem `wave`-String (`p n h l 0 1 x z . |` und `= 2-9` für Werte) und `data` für die Beschriftung der Werte. Eine Liste, die mit einer Beschriftung beginnt, gruppiert Signale; `{}` lässt eine Lücke.
- `reg` zeichnet stattdessen die Felder eines Registers: `{ reg: [{ bits: 8, name: "data" }] }`.
- Von Hand geschriebenes JSON geht: Schlüssel ohne Anführungszeichen, einfache Anführungszeichen, Kommas am Ende und `//`-Kommentare.
- Ein Fehler in der Quelle wird unter dem Block genannt.
- `height=400` nach der Sprache legt die Höhe der Zeichnung fest.
- In einem dunklen Theme nutzt es WaveDroms dunkle Darstellung. Beim Export nach HTML, PDF oder Word kommt das Diagramm als Bild mit, in den Farben des Exports gezeichnet.

## Beispiel

```wavedrom
{ signal: [
  { name: "clk",  wave: "p....." },
  { name: "data", wave: "x.345x", data: ["a", "b", "c"] }
]}
```

## Berechtigungen

Es braucht nur **Werkzeuge für Textus AI**, damit Textus AI einen Block prüfen kann, bevor es ihn schreibt. WaveDrom ist im Plugin enthalten: Es liest keine Dateien und zeichnet alles auf deinem Gerät, auf dem Desktop und unter iOS.

## Änderungen

- **0.3.5** - Its package lists the libraries it carries, with their licenses.
- **0.3.4** - A very long diagram shrinks only as far as its labels stay readable, then scrolls sideways (a phone).
- **0.3.3** - Readable in dark mode: the lines and text take the theme's colours on the page's own background; a diagram drawn while its block was folded fits once it opens. A long diagram shrinks to the column instead of being cut off.
- **0.3.2** - Diagrams take the theme's font and line colour, grow with the document's zoom, and `height=` now resizes the diagram itself.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - a tool for Textus AI, `check_wavedrom`
- **0.2.0** - drawn again when the theme changes, with the chart page of Textus 1.3.2
- **0.1.3** - text in the theme's colors on Textus 1.3
- **0.1.2** - exports carry the diagram in the export's colors
- **0.1.0-0.1.1** - first versions: WaveJSON drawn with WaveDrom, dark skin, a height setting, pictures in exports

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `check_wavedrom`: Prüft die Quelle eines ```wavedrom-Blocks - WaveJSON: Signalspuren mit ihren wave-Zeichenketten und data, oder die Felder eines Registers -, bevor er in ein Dokument kommt, ohne ihn zu zeichnen. Gibt ok zurück oder die Probleme, die zuerst zu beheben sind. Die Quelle ohne ihren Zaun übergeben.
<!-- /ai-tools -->

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

- **0.3.0** - ein Werkzeug für Textus AI, `check_wavedrom`
- **0.2.0** - neu gezeichnet beim Themewechsel, mit der Diagrammseite von Textus 1.3.2
- **0.1.3** - Text in den Farben des Themes unter Textus 1.3
- **0.1.2** - Exporte enthalten das Diagramm in den Farben des Exports
- **0.1.0-0.1.1** - erste Versionen: WaveJSON mit WaveDrom gezeichnet, dunkle Darstellung, Höhe einstellbar, Bilder im Export

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `check_wavedrom`: Prüft die Quelle eines ```wavedrom-Blocks - WaveJSON: Signalspuren mit ihren wave-Zeichenketten und data, oder die Felder eines Registers -, bevor er in ein Dokument kommt, ohne ihn zu zeichnen. Gibt ok zurück oder die Probleme, die zuerst zu beheben sind. Die Quelle ohne ihren Zaun übergeben.
<!-- /ai-tools -->

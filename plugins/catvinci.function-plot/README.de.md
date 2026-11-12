# Funktionsgraph

Zeichnet Graphen von Funktionen in x, einer pro Zeile, etwa sin(x) oder x^2 - 1.

## Einen Graphen zeichnen

- Schreibe einen Codeblock in `function-plot` mit einer Funktion pro Zeile. Der Graph erscheint darunter, und die Quelle zeigt sich wieder, wenn du in den Block klickst.
- Eine Zeile darf mit `y =` beginnen. `2x` und `3sin(x)` bedeuten Multiplikation.
- Es kennt + - * / ^, Klammern, x, pi (π), e und sin, cos, tan, asin, acos, atan, sinh, cosh, tanh, exp, ln, log (Basis 10), sqrt, abs, floor und ceil.
- x läuft von -10 bis 10. Mit `xmin=-5 xmax=5` nach der Sprache änderst du das; `ymin` und `ymax` legen den y-Bereich fest, der sich sonst nach den Kurven richtet.
- `height=400` nach der Sprache legt die Höhe der Zeichnung fest.
- Eine Zeile, die sich nicht lesen lässt, wird unter dem Block mit dem Fehler genannt.
- Jede Kurve bekommt eine Farbe aus dem Theme, und der Graph wird neu gezeichnet, wenn das Theme wechselt.
- Beim Export nach HTML, PDF oder Word kommt der Graph als Bild mit.

## Beispiel

```function-plot xmin=-5 xmax=5
sin(x)
x^2 / 4 - 1
```

## Berechtigungen

Es braucht nur **Werkzeuge für Textus AI**, damit Textus AI einen Block prüfen kann, bevor es ihn schreibt. Es liest keine Dateien und zeichnet alles auf deinem Gerät, auf dem Desktop und unter iOS.

## Änderungen

- **0.3.2** - Steile Kurven wie tan(x) behalten ihre Form und brechen an Asymptoten ab; eine Funktion ohne zeichenbaren Teil sagt das; π und 2xsin(x) werden gelesen; die Prüfung von Textus AI nutzt den x-Bereich des Zauns.
- **0.3.1** - Seine Seite sagt jetzt in einem Satz, was es tut, was es kann und was sich in jeder Version geändert hat.
- **0.3.0** - ein Werkzeug für Textus AI, `check_function_plot`
- **0.2.0** - Kurven und Achsen in den Farben des Themes, neu gezeichnet beim Themewechsel
- **0.1.3** - Text in den Farben des Themes unter Textus 1.3
- **0.1.2** - -x^2 gilt als -(x^2), und ein Bereich, der bei 0 endet, bleibt erhalten
- **0.1.0-0.1.1** - erste Versionen: Funktionen in x als Bild, Höhe und Bereich einstellbar, Bilder im Export

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `check_function_plot`: Prüft die Quelle eines ```function-plot-Blocks - Funktionen von x, eine pro Zeile, mit + - * / ^, Klammern, pi, e und den üblichen Funktionen -, bevor er in ein Dokument kommt, ohne ihn zu zeichnen. Gibt ok zurück oder die Probleme, die zuerst zu beheben sind. Die Quelle ohne ihren Zaun übergeben, die Angaben des Zauns (xmin=0 xmax=100) als meta.
<!-- /ai-tools -->

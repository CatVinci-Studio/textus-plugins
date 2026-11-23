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

Es braucht nur **Werkzeuge für Textus AI**, damit Textus AI einen Block prüfen kann, bevor es ihn schreibt. Es liest keine Dateien und zeichnet alles auf deinem Gerät.

## Änderungen

- **0.3.4** - Its page no longer says which devices it runs on: the store shows that. Its page receives Textus's messages by the API's current name.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Steep curves like tan(x) keep their shape and break at asymptotes; a function with nothing to draw says so; π and 2xsin(x) are read; Textus AI's check uses the fence's x range.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - a tool for Textus AI, `check_function_plot`
- **0.2.0** - curves and axes in the theme's colors, drawn again when the theme changes
- **0.1.3** - text in the theme's colors on Textus 1.3
- **0.1.2** - -x^2 reads as -(x^2), and a range that ends at 0 is kept
- **0.1.0-0.1.1** - first versions: functions of x drawn as a picture, height and range settings, pictures in exports

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `check_function_plot`: Prüft die Quelle eines ```function-plot-Blocks - Funktionen von x, eine pro Zeile, mit + - * / ^, Klammern, pi, e und den üblichen Funktionen -, bevor er in ein Dokument kommt, ohne ihn zu zeichnen. Gibt ok zurück oder die Probleme, die zuerst zu beheben sind. Die Quelle ohne ihren Zaun übergeben, die Angaben des Zauns (xmin=0 xmax=100) als meta.
<!-- /ai-tools -->

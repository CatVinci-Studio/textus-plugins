# Funktionsgraph

Funktionsgraphen, einer pro Zeile: sin(x), x^2 - 1.

- Schreiben Sie einen Codeblock in `function-plot`: Er wird darunter gezeichnet, und seine Quelle erscheint wieder, wenn Sie hineinklicken.
- `height=400` nach der Sprache legt die Höhe der Zeichnung fest.
- Beim Export nach HTML, PDF oder Word kommt die Zeichnung als Bild mit.
- `xmin=-5 xmax=5` (und `ymin`, `ymax`) nach der Sprache legen den Bereich fest; es kennt + - * / ^, x, pi, e und sin, cos, tan, exp, ln, log, sqrt, abs.

## Beispiel

```function-plot
sin(x)
x^2 / 4 - 1
```

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `check_function_plot`: Prüft die Quelle eines ```function-plot-Blocks - Funktionen von x, eine pro Zeile, mit + - * / ^, Klammern, pi, e und den üblichen Funktionen -, bevor er in ein Dokument kommt, ohne ihn zu zeichnen. Gibt ok zurück oder die Probleme, die zuerst zu beheben sind. Die Quelle ohne ihren Zaun übergeben.
<!-- /ai-tools -->

# Noten (ABC)

Zeichnet Noten aus ABC-Notation, die in einem Codeblock steht.

Schreiben Sie einen Codeblock mit der Sprache `abc`. Die Noten erscheinen direkt darunter, und ein Klick in den Block zeigt die Quelle wieder zum Bearbeiten.

- Die Takte brechen passend zur Spalte um, sodass die Noten auch in einem schmalen Bereich lesbar bleiben.
- Die Noten haben die Textfarbe des Themes und werden beim Wechsel zwischen hell und dunkel neu gezeichnet.
- Exporte nach HTML, PDF und Word enthalten die Noten als Bild.

Es braucht Textus 1.3.2 oder neuer. Es fragt nach einer einzigen Berechtigung, Werkzeuge für Textus AI, damit Textus AI einen `abc`-Block prüfen kann, bevor er ihn in ein Dokument schreibt.

## Beispiel

```abc
X:1
T:Scale
M:4/4
L:1/4
K:C
C D E F | G A B c |
```

## Änderungen

- **0.3.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.3.4** - Its package lists the libraries it carries, with their licenses.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Bars wrap to the column instead of the whole score shrinking; clicking a note no longer turns it red; `check_abc` accepts full mode names, any note length, `+:` lines, `` ` `` and `$`; `height=` is gone.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - Textus AI can check an `abc` block before writing it (`check_abc`).
- **0.2.0** - The notes follow the theme's text color; needs Textus 1.3.2.
- **0.1.3** - Uses Textus's renamed document colors.
- **0.1.2** - Exported pictures keep the music's width and height.
- **0.1.0-0.1.1** - First versions: `abc` blocks drawn under their source, `height=`, pictures in exports; store page and icon.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `check_abc`: Prüft die Quelle eines ```abc-Blocks - ABC-Notenschrift: ein Kopf aus Feldern, der mit K: endet, dann die Noten -, bevor er in ein Dokument kommt, ohne ihn zu zeichnen. Gibt ok zurück oder die Probleme, die zuerst zu beheben sind. Die Quelle ohne ihren Zaun übergeben.
<!-- /ai-tools -->

# Noten (ABC)

Zeichnet Noten aus ABC-Notation, die in einem Codeblock steht.

Schreiben Sie einen Codeblock mit der Sprache `abc`. Die Noten erscheinen direkt darunter, und ein Klick in den Block zeigt die Quelle wieder zum Bearbeiten.

- Mit `height=400` hinter `abc` in der ersten Zeile legen Sie die Höhe der Zeichnung in Pixeln fest.
- Die Noten haben die Textfarbe des Themes und werden beim Wechsel zwischen hell und dunkel neu gezeichnet.
- Exporte nach HTML, PDF und Word enthalten die Noten als Bild.

Läuft auf dem Desktop und auf dem iPhone und braucht Textus 1.3.2 oder neuer. Es fragt nach einer einzigen Berechtigung, Werkzeuge für Textus AI, damit Textus AI einen `abc`-Block prüfen kann, bevor er ihn in ein Dokument schreibt.

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

- **0.3.0** - Textus AI kann einen `abc`-Block prüfen, bevor es ihn schreibt (`check_abc`).
- **0.2.0** - Die Noten folgen der Textfarbe des Themes; braucht Textus 1.3.2.
- **0.1.3** - Nutzt die umbenannten Dokumentfarben von Textus.
- **0.1.2** - Exportierte Bilder behalten Breite und Höhe der Noten.
- **0.1.0-0.1.1** - Erste Versionen: `abc`-Blöcke unter ihrer Quelle gezeichnet, `height=`, Bilder beim Export; Seite im Store und Symbol.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `check_abc`: Prüft die Quelle eines ```abc-Blocks - ABC-Notenschrift: ein Kopf aus Feldern, der mit K: endet, dann die Noten -, bevor er in ein Dokument kommt, ohne ihn zu zeichnen. Gibt ok zurück oder die Probleme, die zuerst zu beheben sind. Die Quelle ohne ihren Zaun übergeben.
<!-- /ai-tools -->

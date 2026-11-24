# MDX

Für MDX-Dokumente – das Markdown mit Komponenten, das Docusaurus, Nextra
und andere Website-Werkzeuge nutzen. Textus öffnet `.mdx`-Dateien von selbst
und lässt ihre Imports, `{expressions}` und Komponenten genau so, wie sie
geschrieben sind; dieses Plugin fügt hinzu:

- **Probleme unterstrichen.** Der MDX-Compiler selbst prüft das Dokument,
  während Sie schreiben, und das erste Problem, das er findet, wird an
  seiner Stelle unterstrichen, mit Zeile und dem, was falsch ist.
- **MDX-Vorschau.** Das Dokument daneben gezeichnet: Tabs, Callouts
  (`<Callout>`, `<Admonition>`, `:::tip`) und `<details>` im Aussehen von
  Textus, jede andere Komponente als Karte mit Namen und Attributen. Nichts
  vom Code des Dokuments wird ausgeführt.
- **Als Markdown speichern / Als MDX speichern.** Eine Kopie neben dem
  Dokument: Callouts werden zu GitHub-Hinweisen, Tabs zu Abschnitten mit
  Überschrift, und eine Komponente ohne Inhalt bleibt als Kommentar; in die
  andere Richtung werden geschweifte Klammern und `<` maskiert und Kommentare
  und `<br>` so geschrieben, wie MDX sie verlangt.

Sie finden diese im Plugins-Menü oder per Rechtsklick in einem `.mdx`-Dokument.

## Berechtigungen

- **Dokument lesen**: um es beim Schreiben zu prüfen und zu zeichnen.
- **Dateien lesen und schreiben**: um eine .mdx-Datei zu prüfen, die Textus AI nennt, und die umgewandelte Kopie neben dem Dokument zu speichern.
- **Werkzeuge für Textus AI**: damit Textus AI MDX prüfen kann, das es schreibt.

## Änderungen

- **0.1.4** - Its icon is MDX's own logo.
- **0.1.3** - Its page is in every language Textus speaks.
- **0.1.2** - Its package lists the libraries it carries, with their licenses.
- **0.1.1** - Preview MDX on a phone, where the preview shows alone, draws the document it was opened from instead of an empty page.
- **0.1.0** - First version: problems underlined by MDX's compiler, Preview MDX, Save as Markdown and Save as MDX, and check_mdx for Textus AI.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `check_mdx`: Prüft MDX mit dem offiziellen MDX-Compiler und nennt das erste Problem mit Zeile und Spalte. Nach dem Schreiben oder Ändern eines .mdx-Dokuments verwenden, bevor du sagst, dass es funktioniert.
<!-- /ai-tools -->

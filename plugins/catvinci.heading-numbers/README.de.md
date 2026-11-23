# Überschriften-Nummern

Zeigt beim Schreiben Nummern vor Ihren Überschriften (1, 1.1, 1.2), ohne den Text zu ändern.

- Jede Überschrift zeigt beim Schreiben ihre Nummer davor: 1, 1.1, 1.2, 2… Die Nummern werden nur angezeigt; der Text des Dokuments bleibt, wie er ist.
- Die Nummerierung beginnt bei der obersten Überschriftenebene des Dokuments, oder eine Ebene tiefer, wenn diese Ebene nur den Titel enthält.
- Ein Dokument, dessen Überschriften schon von Hand nummeriert sind, bekommt keine zusätzlichen Nummern. Das ist der Fall, wenn die meisten Überschriften der obersten Ebene mit einer Nummer wie `1.`, `1.2`, `一、`, `第一章` oder `(一)` beginnen.
- Obsidian: `number headings: off` in den Eigenschaften eines Dokuments (die Einstellung des Obsidian-Plugins Number Headings) schaltet die Nummern für dieses Dokument ab.
- **Nummern in Exporten** (**Einstellungen › Erweiterungen › Plugins › Überschriften-Nummern**, standardmäßig an): HTML- und PDF-Exporte zeigen dieselben Nummern.

Das Plugin liest die Überschriften des offenen Dokuments (Berechtigung, den Editor zu lesen) und gibt Textus AI das unten aufgeführte Werkzeug `number_headings` (Berechtigung für KI-Werkzeuge). Das Werkzeug gibt den Text mit eingefügten oder entfernten Nummern zurück; es ändert keine Datei. Es läuft auf dem Desktop sowie auf iPhone und iPad.

## Änderungen

- **0.2.4** - With two documents open side by side, both show their heading numbers, not only the one you are typing in.
- **0.2.3** - Front matter and code blocks no longer get numbers by mistake, and exports number only top-level headings, like the editor.
- **0.2.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.1** - No numbers on a document numbered by hand, or one whose front matter says `number headings: off`.
- **0.2.0** - Textus AI can write heading numbers into Markdown, or take them out.
- **0.1.3** - Says where it runs: the desktop, iPhone and iPad.
- **0.1.2** - Numbering starts at the document's own top heading level instead of a setting.
- **0.1.0-0.1.1** - First versions: numbers before headings while writing, and in HTML and PDF exports.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `number_headings`: Schreibt Nummern in die Überschriften von Markdown - 1, 1.1, 1.2 -, gezählt wie der Editor sie zeigt (ein einzelner Titel bleibt ohne), und ersetzt vorhandene Nummern; mit remove nimmt es sie heraus. Gibt den Text zurück; schreibt nichts.
<!-- /ai-tools -->

# Überschriften-Nummern

Zeigt beim Schreiben Nummern vor Ihren Überschriften (1, 1.1, 1.2), ohne den Text zu ändern.

- Jede Überschrift zeigt beim Schreiben ihre Nummer davor: 1, 1.1, 1.2, 2… Die Nummern werden nur angezeigt; der Text des Dokuments bleibt, wie er ist.
- Die Nummerierung beginnt bei der obersten Überschriftenebene des Dokuments, oder eine Ebene tiefer, wenn diese Ebene nur den Titel enthält.
- Ein Dokument, dessen Überschriften schon von Hand nummeriert sind, bekommt keine zusätzlichen Nummern. Das ist der Fall, wenn die meisten Überschriften der obersten Ebene mit einer Nummer wie `1.`, `1.2`, `一、`, `第一章` oder `(一)` beginnen.
- Obsidian: `number headings: off` in den Eigenschaften eines Dokuments (die Einstellung des Obsidian-Plugins Number Headings) schaltet die Nummern für dieses Dokument ab.
- **Nummern in Exporten** (**Einstellungen › Erweiterungen › Plugins › Überschriften-Nummern**, standardmäßig an): HTML- und PDF-Exporte zeigen dieselben Nummern.

Das Plugin liest die Überschriften des offenen Dokuments (Berechtigung, den Editor zu lesen) und gibt Textus AI das unten aufgeführte Werkzeug `number_headings` (Berechtigung für KI-Werkzeuge). Das Werkzeug gibt den Text mit eingefügten oder entfernten Nummern zurück; es ändert keine Datei. Es läuft auf dem Desktop sowie auf iPhone und iPad.

## Änderungen

- **0.2.3** - Front Matter und Codeblöcke bekommen keine falschen Nummern mehr, und Exporte nummerieren wie der Editor nur Überschriften der obersten Ebene.
- **0.2.2** - Seine Seite sagt jetzt in einem Satz, was es tut, was es kann und was sich in jeder Version geändert hat.
- **0.2.1** - Keine Nummern bei einem von Hand nummerierten Dokument oder einem mit `number headings: off` in den Eigenschaften.
- **0.2.0** - Textus AI kann Nummern in die Überschriften eines Markdown-Texts schreiben oder sie entfernen.
- **0.1.3** - Nennt, wo es läuft: Desktop, iPhone und iPad.
- **0.1.2** - Die Nummerierung beginnt bei der obersten Überschriftenebene des Dokuments statt nach einer Einstellung.
- **0.1.0-0.1.1** - Erste Versionen: Nummern vor Überschriften beim Schreiben und in HTML- und PDF-Exporten.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `number_headings`: Schreibt Nummern in die Überschriften von Markdown - 1, 1.1, 1.2 -, gezählt wie der Editor sie zeigt (ein einzelner Titel bleibt ohne), und ersetzt vorhandene Nummern; mit remove nimmt es sie heraus. Gibt den Text zurück; schreibt nichts.
<!-- /ai-tools -->

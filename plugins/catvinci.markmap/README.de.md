# Mindmap

Zeichnet eine Markdown-Gliederung aus Überschriften und Listen als Mindmap in einem Codeblock.

Schreiben Sie einen Codeblock mit der Sprache `markmap` und setzen Sie eine Gliederung hinein: Überschriften (`#`, `##`) und Listeneinträge werden zu den Ästen der Mindmap. Die Mindmap erscheint unter dem Block; ein Klick in den Block zeigt den Quelltext wieder zum Bearbeiten.

- Ziehen Sie die Mindmap, um sie zu verschieben, und zoomen Sie hinein oder heraus. Ein Klick auf den Punkt eines Asts klappt ihn ein oder aus.
- `height=400` hinter der Sprache legt die Höhe der Mindmap in Pixeln fest (Standard 360).
- Die Äste übernehmen die Farben Ihres Themes, und die Mindmap wird beim Wechsel des Themes neu gezeichnet.
- Beim Export als HTML, PDF oder Word kommt die Mindmap als Bild mit, auch wenn sie gerade nicht zu sehen ist.

Das Plugin nutzt [markmap](https://markmap.js.org). Es fragt nur nach einer Berechtigung: um Textus AI das unten aufgeführte Werkzeug `check_markmap` zu geben, das einen Block prüft, bevor Textus AI ihn in ein Dokument schreibt. Es läuft auf dem Desktop sowie auf iPhone und iPad.

## Beispiel

```markmap
# Project
## Goals
- Ship 1.3
- Write the guide
## People
- Writers
- Reviewers
```

## Änderungen

- **0.3.1** - Eine Mindmap außerhalb des sichtbaren Bereichs wird als Bild exportiert statt als Quelltext.
- **0.3.0** - Textus AI kann einen `markmap`-Block prüfen, bevor es ihn schreibt.
- **0.2.0** - Die Farben der Äste kommen aus den Tönen des Themes. Benötigt Textus 1.3.2.
- **0.1.3** - Liest Textfarbe und Fußnotengröße des Dokuments unter ihren Namen aus Textus 1.3.
- **0.1.0-0.1.2** - Erste Versionen: `markmap`-Codeblöcke im Dokument gezeichnet, `height=` und Export als Bild in den Farben des Exports.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `check_markmap`: Prüft die Quelle eines ```markmap-Blocks - eine Markdown-Gliederung, deren Überschriften und Listenpunkte die Äste der Mindmap sind -, bevor er in ein Dokument kommt, ohne ihn zu zeichnen. Gibt ok zurück oder die Probleme, die zuerst zu beheben sind. Die Quelle ohne ihren Zaun übergeben.
<!-- /ai-tools -->

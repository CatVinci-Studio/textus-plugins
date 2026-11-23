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

- **0.3.8** - The mind map fills its block: a small one grows (up to twice its size) to the block's width and the height you give it, and it follows the note's zoom instead of being cut off on the right. Its page no longer says which devices it runs on: the store shows that.
- **0.3.7** - Its package lists the libraries it carries, with their licenses.
- **0.3.6** - A mind map drawn before its note was laid out no longer shows an error.
- **0.3.5** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.4** - Editing a mind map for a long time no longer makes Textus use more and more memory.
- **0.3.3** - Scrolling over a mind map now scrolls the note; pinch or Ctrl-scroll to zoom. The map uses your theme's font and colors, in dark mode too, and opens fully fitted.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - A mind map scrolled out of sight exports as its picture instead of its source.
- **0.3.0** - Textus AI can check a `markmap` block before it writes one.
- **0.2.0** - Branch colors come from the theme's tones. Needs Textus 1.3.2.
- **0.1.3** - Uses the theme's document text color and footnote size under their Textus 1.3 names.
- **0.1.0-0.1.2** - First versions: `markmap` code blocks drawn in the document, `height=`, and exports as a picture in the export's colors.

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `check_markmap`: Prüft die Quelle eines ```markmap-Blocks - eine Markdown-Gliederung, deren Überschriften und Listenpunkte die Äste der Mindmap sind -, bevor er in ein Dokument kommt, ohne ihn zu zeichnen. Gibt ok zurück oder die Probleme, die zuerst zu beheben sind. Die Quelle ohne ihren Zaun übergeben.
<!-- /ai-tools -->

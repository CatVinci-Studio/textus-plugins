# Mindmap

Zeichnet eine Markdown-Gliederung (Überschriften und Listen) als Mindmap.

- Schreiben Sie einen Codeblock in `markmap`: Er wird darunter gezeichnet, und seine Quelle erscheint wieder, wenn Sie hineinklicken.
- `height=400` nach der Sprache legt die Höhe der Zeichnung fest.
- Beim Export nach HTML, PDF oder Word kommt die Zeichnung als Bild mit.

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

<!-- ai-tools -->
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `check_markmap`: Prüft die Quelle eines ```markmap-Blocks - eine Markdown-Gliederung, deren Überschriften und Listenpunkte die Äste der Mindmap sind -, bevor er in ein Dokument kommt, ohne ihn zu zeichnen. Gibt ok zurück oder die Probleme, die zuerst zu beheben sind. Die Quelle ohne ihren Zaun übergeben.
<!-- /ai-tools -->

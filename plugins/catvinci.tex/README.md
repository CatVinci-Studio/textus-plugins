# TeX

Open LaTeX and BibTeX files (.tex, .bib, .sty, .cls) as plain text to edit, with their commands, comments and fields coloured, for quick changes to a paper. It doesn't compile them.

## What it does

- A `.tex`, `.ltx`, `.sty` or `.cls` file opens as its own text, ready to edit: commands, braces, `%` comments and `$…$` maths are coloured as LaTeX.
- A `.bib` file opens the same way: entry types (`@article`), citation keys, field names and values each get their own colour.
- Nothing is read as Markdown, and nothing is changed but what you type: the file is saved exactly as you left it.
- Code blocks in `bibtex or `bib are coloured too.
- The colours follow your theme. Find (Cmd/Ctrl+F), undo and zoom work as in source mode.

Without the plugin, these files still show as plain text, read-only.

## Permissions

None. It only tells Textus which files to open as text and how to colour them; it runs no code.

## Changes

- **0.1.0** - First version: LaTeX and BibTeX files edited as coloured plain text. Needs Textus 1.4.8-rc.3.

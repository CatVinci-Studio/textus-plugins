# Tidy

Underlines Markdown that breaks common rules and fixes it, and tidies blank lines, spaces, punctuation and line breaks.

It works like Obsidian's Linter, and every change is one undo step.

## Markdown

- Words that break a common Markdown rule are underlined; rest the pointer on one to see which rule and why.
- **Fix Markdown** (right-click, or the Plugins menu) fixes what can be fixed.
- Each block is checked on its own, so rules about the document as a whole (heading levels, the first line, blank lines between blocks) are left out.

## Text

Each command works on the selection, or - after asking - on the whole document. Find them in the Plugins menu or the command palette.

- **Remove Blank Lines**: empty paragraphs go; in a selection, every blank line goes.
- **Remove Trailing Spaces**: the spaces and tabs at the ends of lines; a line break's two spaces stay.
- **Chinese Punctuation in Chinese Text**: 你好,世界? becomes 你好，世界？. Decimals like 1.3.8 and English sentences are left alone.
- **English Punctuation in English Text**: Hello，world！ becomes Hello, world!; marks next to Chinese stay.
- **Full-Width Letters and Digits to ASCII**: ＡＢＣ１２３ becomes ABC123.
- **Join Selected Lines** (also on right-click): the selected lines become one, with no space between Chinese and one between words.

## Settings

- **Underline Markdown that breaks a rule**: turn it off to see no underlines; Fix Markdown still works.
- **Rules to leave alone**: markdownlint rules, one per line (MD009 or no-trailing-spaces), neither underlined nor fixed.

## Left as written

Code, formulas, front matter, links, #tags, reminders (@…), %% comments, HTML and reference definitions ([d]: url) are never flagged or changed - nor is what Obsidian writes: block ids (^1a2b3c), Dataview fields (key:: value, [key:: value]), ==highlights== and the fields of Obsidian Tasks (📅 2026-11-07, 🔁 every week, 🆔 abc123). Joining lines keeps a field on a line of its own. Brackets change in pairs: 价格(USD) becomes 价格（USD）.

CJK Spacing, the plugin that puts spaces between Chinese and Latin text, leaves the same things alone.

## Permissions

- Read and edit the document: to check it and make the fixes.
- Tools for Textus AI: so Textus AI can check Markdown with the same rules.

## Changes

- **0.3.0** - Renamed Tidy (was Markdown Lint): Text Tidy's six text commands moved in; settings to turn off underlines or single rules; Obsidian's own syntax left as written.
- **0.2.1** - Tags, links, reminders and reference definitions are never flagged: the same list CJK Spacing leaves alone.
- **0.2.0** - Textus AI can check Markdown (`lint_markdown`).
- **0.1.0-0.1.2** - First versions: underlines that explain the rule, and Fix Markdown; store page and icon; runs on desktop and iOS.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `lint_markdown`: Checks Markdown - given, or the document in front - with markdownlint's rules, as the editor underlines them: each issue's line, rule, description and whether it can be fixed; with fix, also the fixed text. Changes nothing itself.
<!-- /ai-tools -->

# Heading Numbers

Show numbers before your headings as you write (1, 1.1, 1.2) without changing the text.

- Each heading shows its number in front of it while you write: 1, 1.1, 1.2, 2… The numbers are only drawn; the text of the document stays as it is.
- Numbering starts at the document's top heading level, or one level below when that level holds only the title.
- A document that already numbers its headings by hand gets no extra numbers. That is the case when most top-level headings start with a number such as `1.`, `1.2`, `一、`, `第一章` or `(一)`.
- Obsidian: `number headings: off` in a document's front matter (the setting Obsidian's Number Headings plugin uses) turns the numbers off for that document.
- **Numbers in exports** (**Settings › Extensions › Plugins › Heading Numbers**, on by default): HTML and PDF exports show the same numbers.

The plugin reads the open document's headings (permission to read the editor) and gives Textus AI the `number_headings` tool below (permission for AI tools). The tool returns the text with numbers written in, or taken out; it doesn't change any file. It works on the desktop and on iPhone and iPad.

## Changes

- **0.2.3** - Front matter and code blocks no longer get numbers by mistake, and exports number only top-level headings, like the editor.
- **0.2.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.1** - No numbers on a document numbered by hand, or one whose front matter says `number headings: off`.
- **0.2.0** - Textus AI can write heading numbers into Markdown, or take them out.
- **0.1.3** - Says where it runs: the desktop, iPhone and iPad.
- **0.1.2** - Numbering starts at the document's own top heading level instead of a setting.
- **0.1.0-0.1.1** - First versions: numbers before headings while writing, and in HTML and PDF exports.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `number_headings`: Writes numbers into the headings of some Markdown - 1, 1.1, 1.2 - counted as the editor shows them (a lone title heading isn't numbered), replacing numbers already there; or, with remove, takes them out. Returns the text; writes nothing.
<!-- /ai-tools -->

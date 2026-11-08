# CJK Spacing

Puts a space between Chinese or Japanese text and Latin letters or numbers.

## Spacing a document

- Choose **Plugins › Add Spaces Between CJK and Latin**, or the same item in the right-click menu. 用Textus写作 becomes 用 Textus 写作. The whole document changes in one undo step, and a notice says how many blocks changed.
- Turn on **Also when saving** in the plugin's settings to space every document as it is saved. Only paragraphs, headings, lists and other prose change.
- Korean is left alone: it puts spaces between words itself.

## What stays as written

- Code, formulas, links and wiki links, footnotes, #tags, reminders (@…), %% comments, HTML and front matter - on save too.
- What Obsidian writes: block ids (^1a2b3c), Dataview fields (key:: value), ==highlights== and the fields of Obsidian Tasks (📅 2026-11-07).

## Permissions

- **Read and edit the document**: to space the document in front.
- **Write files**: to space a document as it is saved, when **Also when saving** is on.
- **Tools for Textus AI**: so Textus AI can space some text for you.

## Changes

- **0.2.3** - Its Textus AI tool says what it does: Chinese and Japanese, not Korean.
- **0.2.2** - leaves Obsidian's block ids, Dataview fields, highlights and Tasks fields as written
- **0.2.1** - leaves #tags, reminders and %% comments alone; on save only prose blocks change
- **0.2.0** - a tool for Textus AI, `fix_cjk_spacing`
- **0.1.3** - runs on the desktop and on iOS
- **0.1.2** - leaves links, wiki links, footnotes, tags and front matter alone
- **0.1.0-0.1.1** - first versions: the command in the right-click and Plugins menus, and spacing on save

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `fix_cjk_spacing`: Puts a space between Chinese or Japanese characters and Latin letters or digits in some Markdown, leaving code and links alone, as the plugin's command does. Returns the spaced text; writes nothing.
<!-- /ai-tools -->

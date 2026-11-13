# Writing Stats

Shows word counts, reading time and a daily writing goal in the sidebar.

Open the **Writing Stats** tab in the sidebar:

- **This document**: words, characters and reading time.
- **Selection**: words and characters of what you selected.
- **Today**: the words you added today, across all documents, against a daily goal, and the days in a row you met it. Set the goal in the plugin's settings under **Daily goal**: 500 unless you change it, 0 for none.
- **Whole folder**: expand it to count words, characters and documents across the open folder.

Chinese, Japanese and Korean are counted by character, other scripts by word. Markdown's own marks - `#`, `*`, link addresses, front matter - aren't counted. Reading time assumes 230 words or 400 CJK characters a minute.

It works on desktop and iPhone and needs Textus 1.3.0 or later. It asks to read the editor and the open folder's files, to count them, and gives Textus AI the tool below.

## Changes

- **0.2.4** - The store description now opens with what the plugin does.
- **0.2.3** - Today now counts only the words you type yourself, not changes from sync or AI, and stays quick in large folders. A negative daily goal is no longer shown as met.
- **0.2.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.1** - Updated shared path code.
- **0.2.0** - Textus AI can count the words of a document or a folder.
- **0.1.1** - Says where it runs: desktop and iPhone.
- **0.1.0** - First version: the document, the selection, today against a goal, the streak and the whole folder.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `count_words`: Counts words, characters and minutes to read for a document, every document in a folder, or the document in front - a Chinese, Japanese or Korean character counts as a word, Markdown's marks don't.
<!-- /ai-tools -->

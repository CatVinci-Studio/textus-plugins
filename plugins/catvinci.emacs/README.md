# Emacs

Lets you move, mark, kill and yank in the editor with Emacs keys.

The keys work as soon as the plugin is installed. **Plugins › Turn Emacs Keys On or Off** switches them, and so does a click on **Emacs** in the status bar, which also shows **Mark** while the mark is set and **C-x-** while C-x waits for its second key. Only the keys below are taken; typing stays the editor's own. In a Markdown document a "line" is a paragraph, a heading, a list item, or a line of a code block.

- **Moving**: **C-f C-b C-n C-p**, **C-a C-e**, **M-f M-b**, **M-< M->**, **M-{ M-}** by paragraph, **C-v M-v** by twenty lines.
- **Mark and region**: **C-SPC** sets the mark, and moves then extend the region (the arrow keys too); **C-g** drops it; **C-x h** selects the whole document.
- **Kill ring**: **C-k** kills to the end of the line (at the end, it joins the next line), **C-w** kills the region, **M-w** copies it, **M-d** and **M-DEL** kill a word forward or back. Kills in a row join into one. **C-y** yanks the newest kill, and **M-y** right after it swaps in older ones. **C-d** deletes one character without touching the kill ring.
- **Case**: **M-u**, **M-l** and **M-c** upper-case, lower-case and capitalize the next word.
- **Undo and save**: **C-/**, **C-_** or **C-x u** undo; **C-x C-s** saves.

On a Mac, Textus's shortcuts are on ⌘, so every Ctrl key is Emacs's. On Windows and Linux, Ctrl keys are Textus's and the system's (copy, paste, cut, select all, bold, find), so only the M- keys, C-SPC and C-g are Emacs's until you turn on **Take Ctrl keys the app uses** in the plugin's settings.

It works on desktop and iPhone. It asks for one permission, editor keys, to take these keys in the editor.

## Changes

- **0.1.4** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.3** - Says where it runs: desktop and iPhone.
- **0.1.2** - C-x no longer sticks; C-d and C-y leave the clipboard and the region alone.
- **0.1.0-0.1.1** - First versions: moves, the mark and region, a kill ring with C-y and M-y, M-u M-l M-c, undo and C-x keys; store page and icon.

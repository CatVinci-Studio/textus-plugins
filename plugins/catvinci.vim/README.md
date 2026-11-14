# Vim

Use Vim's modes and keys in the Textus editor.

- **Plugins › Turn Vim Keys On or Off** switches them. While they are on, the status bar shows the mode (NORMAL, INSERT, VISUAL, V-LINE); its menu turns Vim off.
- Normal, insert, visual and visual-line modes, with motions (**h j k l**, **w b e**, **0 ^ $**, **gg G**, **f t F T** with **;** and **,**, **Ctrl+D** and **Ctrl+U**), operators (**d c y**, **dd**, **x**, **p P**, **r**, and **iw**/**aw**), counts, a register, **u** and **Ctrl+R** to undo and redo, and **.** to repeat.
- A line is a paragraph, a heading, a list item or a code block's line: **j** and **k** go through all of them, **}** and **{** block by block. **zz**, **zt** and **zb** bring the caret's line to the middle, top or bottom of the window.
- **~** flips the case under the caret; in visual mode **~**, **U** and **u** flip, upper-case or lower-case the selection.
- **s** and a letter, then a label, jumps anywhere on screen (flash); the nearest places get the first labels. **d**, **c** or **y** before **s** deletes, changes or copies up to there.
- **:** opens the command palette with Vim's commands first: **:w** saves, **:q** closes the tab, **:wq** does both, **:12** goes to line 12, **:u** and **:redo** undo and redo, and any of Textus's commands can be found there too.
- On a Mac, normal mode types with a Roman keyboard, so an input method such as Pinyin doesn't catch the keys; your own comes back in insert mode.

Settings, in **Settings › Extensions › Plugins › Vim**:

- **Jump with s (flash)**: on by default. Off, **s** is Vim's own (delete a character and insert).
- **Leave insert mode with**: two letters typed quickly in insert mode that work as Escape, such as `jk`. Empty means Escape and **Ctrl+[** only.
- **Key mappings**: lines as in a vimrc (`map`, `noremap`, `nnoremap`, `inoremap`, `vnoremap` and `let mapleader`), such as `inoremap jj <Esc>` or `nnoremap <leader>w :w<CR>`.

Obsidian: in an Obsidian vault, its `.obsidian.vimrc` (from the Vimrc Support plugin) is read too, after your own lines, and read again when it changes. Open the vault itself, not a folder inside it.

The plugin asks to take keys in the editor (to run Vim's keys) and to read files (only to read `.obsidian.vimrc`). It works on the desktop.

## Changes

- **0.2.8** - Desktop only: a phone's on-screen keyboard types its letters into the text instead of running them as Vim keys.
- **0.2.7** - The status bar's mode opens a menu that turns Vim off; `.obsidian.vimrc` is read again when you come back to Textus; leaving visual mode with **:** always works.
- **0.2.6** - Shorter help and empty-state text.
- **0.2.5** - Its code is split into smaller files by what each part does; nothing changes in use.
- **0.2.4** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.3** - Reads an Obsidian vault's `.obsidian.vimrc`; mapping the same keys again replaces the earlier mapping.
- **0.2.2** - **zz**, **zt** and **zb** bring the caret's line to the middle, top or bottom of the window.
- **0.2.1** - Says where it runs: the desktop, iPhone and iPad.
- **0.2.0** - **:** opens the command palette with Vim's commands first; flash shows its labels after one letter; normal mode types Roman on a Mac.
- **0.1.0-0.1.1** - First versions: modes, motions, operators, counts, dot repeat, flash with **ds**, **cs** and **ys**, the command line (**:w**, **:q**, **:wq**, **:12**), vimrc key mappings and the case keys.

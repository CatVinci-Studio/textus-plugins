# Vim

Режимы и клавиши Vim в редакторе Textus.

- **Плагины › Включить или выключить клавиши Vim** переключает их. Пока они включены, в строке состояния виден режим (NORMAL, INSERT, VISUAL, V-LINE); его меню выключает Vim.
- Обычный режим, вставка, визуальный и построчный визуальный, с перемещениями (**h j k l**, **w b e**, **0 ^ $**, **gg G**, **f t F T** с **;** и **,**, **Ctrl+D** и **Ctrl+U**), операторами (**d c y**, **dd**, **x**, **p P**, **r**, а также **iw**/**aw**), счётчиками, регистром, отменой и возвратом по **u** и **Ctrl+R** и повтором по **.**.
- Строка — это абзац, заголовок, пункт списка или строка блока кода: **j** и **k** проходят по всем ним, **}** и **{** — по блокам. **zz**, **zt** и **zb** ставят строку с курсором в середину, вверх или вниз окна.
- **~** меняет регистр буквы под курсором; в визуальном режиме **~**, **U** и **u** меняют регистр выделения, делают его прописным или строчным.
- **s** и буква, затем метка, — прыжок в любое место экрана (flash); ближайшие места получают первые метки. **d**, **c** или **y** перед **s** удаляет, меняет или копирует до этого места.
- **:** открывает палитру команд, где первыми идут команды Vim: **:w** сохраняет, **:q** закрывает вкладку, **:wq** делает и то и другое, **:12** переходит к строке 12, **:u** и **:redo** отменяют и возвращают; там же можно найти любую команду Textus.
- На Mac обычный режим печатает с латинской раскладки, чтобы метод ввода вроде пиньиня не перехватывал клавиши; ваш возвращается в режиме вставки.

Настройки — в **Настройки › Расширения › Плагины › Vim**:

- **Прыжок по s (flash)**: по умолчанию включён. Если выключить, **s** работает как в Vim (удалить символ и перейти к вставке).
- **Выход из режима вставки**: две буквы, быстро набранные в режиме вставки, которые работают как Escape, например `jk`. Пусто — только Escape и **Ctrl+[**.
- **Привязки клавиш**: строки как в vimrc (`map`, `noremap`, `nnoremap`, `inoremap`, `vnoremap` и `let mapleader`), например `inoremap jj <Esc>` или `nnoremap <leader>w :w<CR>`.

Obsidian: в хранилище Obsidian читается и его `.obsidian.vimrc` (файл плагина Vimrc Support) — после ваших строк, и перечитывается, когда он меняется. Открывайте само хранилище, а не папку внутри него.

Плагин просит разрешения принимать клавиши в редакторе (чтобы выполнять команды Vim) и читать файлы (только чтобы прочитать `.obsidian.vimrc`). Работает на компьютере.

## Изменения

- **0.2.9** - Needs Textus 1.3.0-beta.8 or later, the first with everything it uses.
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

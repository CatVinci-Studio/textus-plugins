# Vim

Usa los modos y las teclas de Vim en el editor de Textus.

- **Complementos › Activar o desactivar las teclas de Vim** los enciende y apaga. Mientras están activos, la barra de estado muestra el modo (NORMAL, INSERT, VISUAL, V-LINE); su menú apaga Vim.
- Modos normal, inserción, visual y visual por líneas, con movimientos (**h j k l**, **w b e**, **0 ^ $**, **gg G**, **f t F T** con **;** y **,**, **Ctrl+D** y **Ctrl+U**), operadores (**d c y**, **dd**, **x**, **p P**, **r**, e **iw**/**aw**), contadores, un registro, **u** y **Ctrl+R** para deshacer y rehacer, y **.** para repetir.
- Una línea es un párrafo, un título, un elemento de lista o una línea de un bloque de código: **j** y **k** pasan por todos ellos, **}** y **{** de bloque en bloque. **zz**, **zt** y **zb** llevan la línea del cursor al centro, arriba o abajo de la ventana.
- **~** cambia mayúsculas y minúsculas bajo el cursor; en modo visual, **~**, **U** y **u** invierten, pasan a mayúsculas o a minúsculas la selección.
- **s** y una letra, luego una etiqueta, salta a cualquier punto de la pantalla (flash); los lugares más cercanos reciben las primeras etiquetas. **d**, **c** o **y** antes de **s** borra, cambia o copia hasta ahí.
- **:** abre la paleta de comandos con los de Vim primero: **:w** guarda, **:q** cierra la pestaña, **:wq** hace ambas cosas, **:12** va a la línea 12, **:u** y **:redo** deshacen y rehacen, y ahí también están todos los comandos de Textus.
- En un Mac, el modo normal escribe con un teclado latino, para que un método de entrada como Pinyin no capture las teclas; el tuyo vuelve en el modo de inserción.

Ajustes, en **Ajustes › Extensiones › Complementos › Vim**:

- **Saltar con s (flash)**: activado por defecto. Desactivado, **s** hace lo de Vim (borrar un carácter e insertar).
- **Salir del modo de inserción con**: dos letras tecleadas rápido en modo de inserción que valen como Escape, por ejemplo `jk`. Vacío: solo Escape y **Ctrl+[**.
- **Asignaciones de teclas**: líneas como en un vimrc (`map`, `noremap`, `nnoremap`, `inoremap`, `vnoremap` y `let mapleader`), por ejemplo `inoremap jj <Esc>` o `nnoremap <leader>w :w<CR>`.

Obsidian: en una bóveda de Obsidian también se lee su `.obsidian.vimrc` (el del plugin Vimrc Support), después de tus propias líneas, y se vuelve a leer cuando cambia. Abre la bóveda misma, no una carpeta dentro de ella.

El plugin pide tomar las teclas en el editor (para ejecutar las de Vim) y leer archivos (solo para leer `.obsidian.vimrc`). Funciona en el escritorio.

## Cambios

- **0.2.10** - Its page no longer says which devices it runs on: the store shows that.
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

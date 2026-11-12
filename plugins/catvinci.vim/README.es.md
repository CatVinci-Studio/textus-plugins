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

El plugin pide tomar las teclas en el editor (para ejecutar las de Vim) y leer archivos (solo para leer `.obsidian.vimrc`). Funciona en el escritorio y en iPhone y iPad.

## Cambios

- **0.2.7** - El modo de la barra de estado abre un menú que apaga Vim; `.obsidian.vimrc` se vuelve a leer al volver a Textus; salir del modo visual con **:** siempre funciona.
- **0.2.6** - Textos de ayuda y de estado vacío más breves.
- **0.2.5** - Su código se divide en archivos más pequeños según lo que hace cada parte; nada cambia al usarlo.
- **0.2.4** - Su página dice ahora en una frase qué hace, qué puede hacer y qué cambió en cada versión.
- **0.2.3** - Lee el `.obsidian.vimrc` de una bóveda de Obsidian; asignar de nuevo las mismas teclas sustituye la asignación anterior.
- **0.2.2** - **zz**, **zt** y **zb** llevan la línea del cursor al centro, arriba o abajo de la ventana.
- **0.2.1** - Indica dónde funciona: escritorio, iPhone y iPad.
- **0.2.0** - **:** abre la paleta de comandos con los de Vim primero; flash muestra sus etiquetas tras una letra; el modo normal escribe con teclado latino en Mac.
- **0.1.0-0.1.1** - Primeras versiones: modos, movimientos, operadores, contadores, repetición con punto, flash con **ds**, **cs** e **ys**, la línea de órdenes (**:w**, **:q**, **:wq**, **:12**), asignaciones como en un vimrc y las teclas de mayúsculas.

# Vim

Use os modos e as teclas do Vim no editor do Textus.

- **Plugins › Ligar ou desligar as teclas do Vim** liga e desliga. Enquanto estão ligadas, a barra de status mostra o modo (NORMAL, INSERT, VISUAL, V-LINE); o menu dele desliga o Vim.
- Modos normal, inserção, visual e visual por linha, com movimentos (**h j k l**, **w b e**, **0 ^ $**, **gg G**, **f t F T** com **;** e **,**, **Ctrl+D** e **Ctrl+U**), operadores (**d c y**, **dd**, **x**, **p P**, **r** e **iw**/**aw**), contagens, um registrador, **u** e **Ctrl+R** para desfazer e refazer, e **.** para repetir.
- Uma linha é um parágrafo, um título, um item de lista ou uma linha de um bloco de código: **j** e **k** passam por todos eles, **}** e **{** de bloco em bloco. **zz**, **zt** e **zb** levam a linha do cursor para o meio, o topo ou o fim da janela.
- **~** troca maiúscula e minúscula sob o cursor; no modo visual, **~**, **U** e **u** invertem, passam para maiúsculas ou para minúsculas a seleção.
- **s** e uma letra, depois um rótulo, pula para qualquer lugar da tela (flash); os lugares mais próximos recebem os primeiros rótulos. **d**, **c** ou **y** antes de **s** apaga, muda ou copia até ali.
- **:** abre a paleta de comandos com os do Vim primeiro: **:w** salva, **:q** fecha a aba, **:wq** faz as duas coisas, **:12** vai para a linha 12, **:u** e **:redo** desfazem e refazem, e todos os comandos do Textus também estão ali.
- No Mac, o modo normal digita com um teclado latino, para que um método de entrada como o pinyin não capture as teclas; o seu volta no modo de inserção.

Configurações, em **Ajustes › Extensões › Plugins › Vim**:

- **Pular com s (flash)**: ligado por padrão. Desligado, **s** faz o que faz no Vim (apagar um caractere e inserir).
- **Sair do modo de inserção com**: duas letras digitadas rápido no modo de inserção que valem como Escape, como `jk`. Vazio: só Escape e **Ctrl+[**.
- **Mapeamentos de teclas**: linhas como num vimrc (`map`, `noremap`, `nnoremap`, `inoremap`, `vnoremap` e `let mapleader`), por exemplo `inoremap jj <Esc>` ou `nnoremap <leader>w :w<CR>`.

Obsidian: num cofre do Obsidian, o `.obsidian.vimrc` dele (o do plugin Vimrc Support) também é lido, depois das suas linhas, e lido de novo quando muda. Abra o próprio cofre, não uma pasta dentro dele.

O plugin pede para receber as teclas no editor (para executar as do Vim) e para ler arquivos (só para ler `.obsidian.vimrc`). Funciona no computador.

## Alterações

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

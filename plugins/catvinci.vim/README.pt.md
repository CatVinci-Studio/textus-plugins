# Vim

Use os modos e as teclas do Vim no editor do Textus.

- **Plugins › Ligar ou desligar as teclas do Vim** liga e desliga. Enquanto estão ligadas, a barra de status mostra o modo (NORMAL, INSERT, VISUAL, V-LINE); clique nele para desligar o Vim.
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

Obsidian: num cofre do Obsidian, o `.obsidian.vimrc` dele (o do plugin Vimrc Support) também é lido, depois das suas linhas, e lido de novo quando muda.

O plugin pede para receber as teclas no editor (para executar as do Vim) e para ler arquivos (só para ler `.obsidian.vimrc`). Funciona no computador, no iPhone e no iPad.

## Alterações

- **0.2.5** - Seu código foi dividido em arquivos menores conforme o que cada parte faz; nada muda no uso.
- **0.2.4** - Sua página agora diz numa frase o que ele faz, o que pode fazer e o que mudou em cada versão.
- **0.2.3** - Lê o `.obsidian.vimrc` de um cofre do Obsidian; mapear de novo as mesmas teclas substitui o mapeamento anterior.
- **0.2.2** - **zz**, **zt** e **zb** levam a linha do cursor para o meio, o topo ou o fim da janela.
- **0.2.1** - Diz onde funciona: computador, iPhone e iPad.
- **0.2.0** - **:** abre a paleta de comandos com os do Vim primeiro; o flash mostra os rótulos depois de uma letra; o modo normal digita em latino no Mac.
- **0.1.0-0.1.1** - Primeiras versões: modos, movimentos, operadores, contagens, repetição com ponto, flash com **ds**, **cs** e **ys**, a linha de comando (**:w**, **:q**, **:wq**, **:12**), mapeamentos como num vimrc e as teclas de maiúsculas.

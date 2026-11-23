# Emacs

Permite mover-se, marcar, cortar (kill) e colar (yank) no editor com as teclas do Emacs.

As teclas funcionam assim que o plugin é instalado. **Plugins › Ligar ou desligar as teclas do Emacs** liga-as e desliga-as, tal como um clique em **Emacs** na barra de estado, que também mostra **Marca** enquanto há uma marca e **C-x-** enquanto C-x espera a segunda tecla. Só as teclas abaixo são tomadas; escrever continua a ser do editor. Num documento Markdown, uma «linha» é um parágrafo, um título, um item de lista ou uma linha de um bloco de código.

- **Mover**: **C-f C-b C-n C-p**, **C-a C-e**, **M-f M-b**, **M-< M->**, **M-{ M-}** por parágrafo, **C-v M-v** de vinte em vinte linhas.
- **Marca e região**: **C-SPC** põe a marca e os movimentos seguintes (as setas também) alargam a região; **C-g** tira-a; **C-x h** seleciona o documento inteiro.
- **Kill ring**: **C-k** corta até ao fim da linha (no fim, junta-a à seguinte), **C-w** corta a região, **M-w** copia-a, **M-d** e **M-DEL** cortam uma palavra para a frente ou para trás. Cortes seguidos juntam-se num só. **C-y** cola o corte mais recente e **M-y** logo a seguir troca-o por outros mais antigos. **C-d** apaga um carácter sem mexer no kill ring.
- **Maiúsculas**: **M-u**, **M-l** e **M-c** põem a palavra seguinte em maiúsculas, em minúsculas ou com inicial maiúscula.
- **Desfazer e guardar**: **C-/**, **C-_** ou **C-x u** desfazem; **C-x C-s** guarda.

No Mac, os atalhos do Textus estão no ⌘, por isso todas as teclas Ctrl são do Emacs. No Windows e no Linux, as teclas Ctrl são do Textus e do sistema (copiar, colar, cortar, selecionar tudo, negrito, procurar), por isso só as teclas M-, C-SPC e C-g são do Emacs até ligar **Usar também as teclas Ctrl do app** nos ajustes do plugin.

Funciona no computador e no iPhone. Pede uma única permissão, teclas do editor, para tomar estas teclas no editor.

## Alterações

- **0.1.7** - Its page says that on a tablet it needs a keyboard, instead of which devices it runs on.
- **0.1.6** - C-x C-s and C-x C-g work again on Windows and Linux. The status bar shows Emacs only while it really has the keys.
- **0.1.5** - Shorter help and empty-state text.
- **0.1.4** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.3** - Says where it runs: desktop and iPhone.
- **0.1.2** - C-x no longer sticks; C-d and C-y leave the clipboard and the region alone.
- **0.1.0-0.1.1** - First versions: moves, the mark and region, a kill ring with C-y and M-y, M-u M-l M-c, undo and C-x keys; store page and icon.

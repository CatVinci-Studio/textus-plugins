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

- **0.1.6** - C-x C-s e C-x C-g voltaram a funcionar no Windows e no Linux. A barra de status mostra Emacs só quando ele realmente está com as teclas.
- **0.1.5** - Textos de ajuda e de estado vazio mais curtos.
- **0.1.4** - Sua página agora diz numa frase o que ele faz, o que pode fazer e o que mudou em cada versão.
- **0.1.3** - Indica onde funciona: computador e iPhone.
- **0.1.2** - C-x já não fica preso; C-d e C-y não mexem na área de transferência nem na região.
- **0.1.0-0.1.1** - Primeiras versões: movimentos, marca e região, kill ring com C-y e M-y, M-u M-l M-c, desfazer e teclas C-x; página na loja e ícone.

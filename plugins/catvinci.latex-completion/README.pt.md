# Autocompletar LaTeX

Sugere comandos LaTeX enquanto escreve uma fórmula.

- Numa fórmula (entre `$ … $` ou num bloco de matemática), escreva uma barra invertida e o início de um comando, como `\fr` ou `\alp`. Uma barra invertida sozinha mostra os mais comuns.
- A lista mostra os comandos que correspondem, cada um com o que desenha: mais de 200, de `\frac` a `\begin{pmatrix}`. Primeiro vêm os que começam pelo que escreveu e depois os que o contêm, sem distinguir maiúsculas.
- Letras pela ordem também encontram um comando: `\rarr` é `\rightarrow`, `\lra` é `\leftrightarrow`.
- **Enter** ou **Tab** escreve o escolhido, com o cursor dentro das chavetas; **Esc** fecha a lista. `\left(`, `\left[` e `\left\{` vêm com o seu `\right`.

Funciona no computador e no iPhone e precisa do Textus 1.3.0 ou mais recente. Pede uma única permissão, ler o editor, para ver o que escreve na fórmula.

## Alterações

- **0.1.4** - Um comando digitado por inteiro vem primeiro, então Enter o mantém (\in continua \in); um comando sem chaves é escrito com um espaço depois; com o Textus 1.3.13 a lista fecha assim que o comando é escrito.
- **0.1.3** - Sua página agora diz numa frase o que ele faz, o que pode fazer e o que mudou em cada versão.
- **0.1.2** - Indica onde funciona: computador e iPhone.
- **0.1.0-0.1.1** - Primeiras versões: mais de 200 comandos com o que cada um desenha, procura por letras pela ordem, chavetas e cursor no lugar, pares de parênteses que crescem; página na loja e ícone.

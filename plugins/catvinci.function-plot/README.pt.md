# Gráfico de funções

Desenha gráficos de funções de x, uma por linha, como sin(x) ou x^2 - 1.

## Desenhar um gráfico

- Escreva um bloco de código em `function-plot` com uma função por linha. O gráfico é desenhado abaixo, e o código volta a aparecer ao clicar no bloco.
- Uma linha pode começar com `y =`. `2x` e `3sin(x)` são multiplicações.
- Entende + - * / ^, parênteses, x, pi, e e sin, cos, tan, asin, acos, atan, sinh, cosh, tanh, exp, ln, log (base 10), sqrt, abs, floor e ceil.
- x vai de -10 a 10. Escreva `xmin=-5 xmax=5` depois da linguagem para mudar; `ymin` e `ymax` fixam o intervalo de y, que senão se ajusta às curvas.
- `height=400` depois da linguagem define a altura do desenho.
- Uma linha que não pode ser lida é indicada abaixo do bloco, com o problema.
- Cada curva usa uma cor do tema, e o gráfico é redesenhado quando o tema muda.
- Ao exportar para HTML, PDF ou Word, o gráfico vai como imagem.

## Exemplo

```function-plot xmin=-5 xmax=5
sin(x)
x^2 / 4 - 1
```

## Permissões

Pede apenas **Ferramentas para o Textus AI**, para que o Textus AI possa verificar um bloco antes de escrevê-lo. Não lê arquivos e desenha tudo no seu aparelho, no computador e no iOS.

## Alterações

- **0.3.1** - Sua página agora diz numa frase o que ele faz, o que pode fazer e o que mudou em cada versão.
- **0.3.0** - uma ferramenta para o Textus AI, `check_function_plot`
- **0.2.0** - curvas e eixos nas cores do tema, redesenhados quando o tema muda
- **0.1.3** - texto nas cores do tema no Textus 1.3
- **0.1.2** - -x^2 é lido como -(x^2), e um intervalo que termina em 0 é respeitado
- **0.1.0-0.1.1** - primeiras versões: funções de x desenhadas como imagem, altura e intervalo ajustáveis, imagens na exportação

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `check_function_plot`: Verifica o código de um bloco ```function-plot - funções de x, uma por linha, com + - * / ^, parênteses, pi, e e as funções habituais - antes de entrar num documento, sem o desenhar. Devolve ok, ou os problemas a corrigir primeiro. Passe o código sem a cerca.
<!-- /ai-tools -->

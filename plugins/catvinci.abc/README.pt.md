# Partituras (ABC)

Desenha partituras a partir de notação ABC escrita num bloco de código.

Escreva um bloco de código com a linguagem `abc`. A música aparece desenhada logo abaixo, e um clique no bloco volta a mostrar o código para editar.

- Escreva `height=400` depois de `abc` na primeira linha para definir a altura do desenho em píxeis.
- As notas usam a cor do texto do tema e são desenhadas de novo ao alternar entre claro e escuro.
- Ao exportar para HTML, PDF ou Word, a música vai como imagem.

Funciona no computador e no iPhone e precisa do Textus 1.3.2 ou mais recente. Pede uma única permissão, ferramentas do Textus AI, para que o Textus AI possa verificar um bloco `abc` antes de o escrever num documento.

## Exemplo

```abc
X:1
T:Scale
M:4/4
L:1/4
K:C
C D E F | G A B c |
```

## Alterações

- **0.3.1** - Sua página agora diz numa frase o que ele faz, o que pode fazer e o que mudou em cada versão.
- **0.3.0** - O Textus AI pode verificar um bloco `abc` antes de o escrever (`check_abc`).
- **0.2.0** - As notas seguem a cor do texto do tema; precisa do Textus 1.3.2.
- **0.1.3** - Usa as cores do documento com os novos nomes do Textus.
- **0.1.2** - As imagens exportadas mantêm a largura e a altura da música.
- **0.1.0-0.1.1** - Primeiras versões: blocos `abc` desenhados sob o código, `height=`, imagens ao exportar; página na loja e ícone.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `check_abc`: Verifica o código de um bloco ```abc - notação musical ABC: um cabeçalho de campos que termina em K:, e depois as notas - antes de entrar num documento, sem o desenhar. Devolve ok, ou os problemas a corrigir primeiro. Passe o código sem a cerca.
<!-- /ai-tools -->

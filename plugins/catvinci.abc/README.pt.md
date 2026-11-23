# Partituras (ABC)

Desenha partituras a partir de notação ABC escrita num bloco de código.

Escreva um bloco de código com a linguagem `abc`. A música aparece desenhada logo abaixo, e um clique no bloco volta a mostrar o código para editar.

- Os compassos quebram de linha para caber na coluna, então as notas continuam legíveis num painel estreito.
- As notas usam a cor do texto do tema e são desenhadas de novo ao alternar entre claro e escuro.
- Ao exportar para HTML, PDF ou Word, a música vai como imagem.

Precisa do Textus 1.3.2 ou mais recente. Pede uma única permissão, ferramentas do Textus AI, para que o Textus AI possa verificar um bloco `abc` antes de o escrever num documento.

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

- **0.3.5** - Its page no longer says which devices it runs on: the store shows that. Its page receives Textus's messages by the API's current name.
- **0.3.4** - Its package lists the libraries it carries, with their licenses.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Bars wrap to the column instead of the whole score shrinking; clicking a note no longer turns it red; `check_abc` accepts full mode names, any note length, `+:` lines, `` ` `` and `$`; `height=` is gone.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - Textus AI can check an `abc` block before writing it (`check_abc`).
- **0.2.0** - The notes follow the theme's text color; needs Textus 1.3.2.
- **0.1.3** - Uses Textus's renamed document colors.
- **0.1.2** - Exported pictures keep the music's width and height.
- **0.1.0-0.1.1** - First versions: `abc` blocks drawn under their source, `height=`, pictures in exports; store page and icon.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `check_abc`: Verifica o código de um bloco ```abc - notação musical ABC: um cabeçalho de campos que termina em K:, e depois as notas - antes de entrar num documento, sem o desenhar. Devolve ok, ou os problemas a corrigir primeiro. Passe o código sem a cerca.
<!-- /ai-tools -->

# Mapa mental

Desenha um esboço em Markdown, com títulos e listas, como mapa mental dentro de um bloco de código.

Escreva um bloco de código com a linguagem `markmap` e coloque nele um esboço: os títulos (`#`, `##`) e os itens de lista são os ramos do mapa. O mapa é desenhado abaixo do bloco; clique no bloco para ver e editar o código de novo.

- Arraste o mapa para movê-lo e aproxime ou afaste com o zoom. Clique no ponto de um ramo para recolhê-lo ou expandi-lo.
- Escreva `height=400` depois da linguagem para definir a altura do mapa em pixels (360 por padrão).
- Os ramos usam as cores do seu tema, e o mapa é desenhado de novo quando você troca de tema.
- Ao exportar para HTML, PDF ou Word, o mapa vai como imagem, mesmo fora da área visível.

O plugin usa o [markmap](https://markmap.js.org). Pede uma única permissão, para dar ao Textus AI a ferramenta `check_markmap` listada abaixo: ela verifica um bloco antes de o Textus AI escrevê-lo num documento. Funciona no computador, no iPhone e no iPad.

## Exemplo

```markmap
# Project
## Goals
- Ship 1.3
- Write the guide
## People
- Writers
- Reviewers
```

## Alterações

- **0.3.2** - Sua página agora diz numa frase o que ele faz, o que pode fazer e o que mudou em cada versão.
- **0.3.1** - Um mapa mental fora da área visível é exportado como imagem e não como código.
- **0.3.0** - O Textus AI pode verificar um bloco `markmap` antes de escrevê-lo.
- **0.2.0** - As cores dos ramos vêm dos tons do tema. Requer Textus 1.3.2.
- **0.1.3** - Usa a cor do texto do documento e o tamanho das notas de rodapé do tema pelos nomes do Textus 1.3.
- **0.1.0-0.1.2** - Primeiras versões: blocos `markmap` desenhados no documento, `height=` e exportação como imagem nas cores da exportação.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `check_markmap`: Verifica o código de um bloco ```markmap - um esquema em Markdown cujos títulos e itens de lista são os ramos do mapa mental - antes de entrar num documento, sem o desenhar. Devolve ok, ou os problemas a corrigir primeiro. Passe o código sem a cerca.
<!-- /ai-tools -->

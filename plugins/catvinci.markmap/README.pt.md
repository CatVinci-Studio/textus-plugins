# Mapa mental

Desenha um esboço em Markdown, com títulos e listas, como mapa mental dentro de um bloco de código.

Escreva um bloco de código com a linguagem `markmap` e coloque nele um esboço: os títulos (`#`, `##`) e os itens de lista são os ramos do mapa. O mapa é desenhado abaixo do bloco; clique no bloco para ver e editar o código de novo.

- Arraste o mapa para movê-lo e aproxime ou afaste com o zoom. Clique no ponto de um ramo para recolhê-lo ou expandi-lo.
- Escreva `height=400` depois da linguagem para definir a altura do mapa em pixels (360 por padrão).
- Os ramos usam as cores do seu tema, e o mapa é desenhado de novo quando você troca de tema.
- Ao exportar para HTML, PDF ou Word, o mapa vai como imagem, mesmo fora da área visível.

O plugin usa o [markmap](https://markmap.js.org). Pede uma única permissão, para dar ao Textus AI a ferramenta `check_markmap` listada abaixo: ela verifica um bloco antes de o Textus AI escrevê-lo num documento.

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

- **0.3.9** - Its icon is markmap's own logo.
- **0.3.8** - The mind map fills its block: a small one grows (up to twice its size) to the block's width and the height you give it, and it follows the note's zoom instead of being cut off on the right. Its page no longer says which devices it runs on: the store shows that.
- **0.3.7** - Its package lists the libraries it carries, with their licenses.
- **0.3.6** - A mind map drawn before its note was laid out no longer shows an error.
- **0.3.5** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.4** - Editing a mind map for a long time no longer makes Textus use more and more memory.
- **0.3.3** - Scrolling over a mind map now scrolls the note; pinch or Ctrl-scroll to zoom. The map uses your theme's font and colors, in dark mode too, and opens fully fitted.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - A mind map scrolled out of sight exports as its picture instead of its source.
- **0.3.0** - Textus AI can check a `markmap` block before it writes one.
- **0.2.0** - Branch colors come from the theme's tones. Needs Textus 1.3.2.
- **0.1.3** - Uses the theme's document text color and footnote size under their Textus 1.3 names.
- **0.1.0-0.1.2** - First versions: `markmap` code blocks drawn in the document, `height=`, and exports as a picture in the export's colors.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `check_markmap`: Verifica o código de um bloco ```markmap - um esquema em Markdown cujos títulos e itens de lista são os ramos do mapa mental - antes de entrar num documento, sem o desenhar. Devolve ok, ou os problemas a corrigir primeiro. Passe o código sem a cerca.
<!-- /ai-tools -->

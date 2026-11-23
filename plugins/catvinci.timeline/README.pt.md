# Linha do tempo

Desenha eventos como uma linha do tempo, um por linha: quando | o quê | mais.

## Desenhar uma linha do tempo

- Escreva um bloco de código em `timeline` com um evento por linha: quando aconteceu, o que aconteceu e uma nota opcional, separados por `|`. A linha do tempo é desenhada abaixo, e o código volta a aparecer ao clicar no bloco.
- Os eventos aparecem na ordem em que você os escreve, ao longo de uma linha, com um ponto para cada um. "Quando" pode ser qualquer texto: uma data, um ano, "Dia 3".
- Linhas vazias são puladas. O que vem depois de um terceiro `|` não aparece.
- `height=400` depois da linguagem define a altura do desenho.
- Usa as cores do tema e é redesenhada quando o tema muda.
- Ao exportar para HTML, PDF ou Word, a linha do tempo vai como imagem.

## Exemplo

```timeline
2024-03 | Primeiro rascunho | O roteiro e dois capítulos
2024-09 | Revisão | Notas de três leitores
2025-01 | Publicado
```

## Permissões

Pede apenas **Ferramentas para o Textus AI**, para que o Textus AI possa verificar um bloco antes de escrevê-lo. Não lê arquivos e desenha tudo no seu aparelho.

## Alterações

- **0.4.1** - Its page no longer says which devices it runs on: the store shows that.
- **0.4.0** - A database can be shown as a timeline: pick Timeline among its views, and its dated rows line up in order; a click opens a row. Needs Textus 1.4.6.
- **0.3.3** - A date no longer breaks in the middle ("2024-0" over "3"); a chart drawn while its block was folded fits once it opens.
- **0.3.2** - long notes and dates wrap to fit a narrow island, the timeline uses the document's font, and an empty block says what to write
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - a tool for Textus AI, `check_timeline`
- **0.2.0** - the theme's colors, drawn again when the theme changes
- **0.1.3** - text in the theme's colors on Textus 1.3
- **0.1.2** - keeps up with quick edits: an older drawing never replaces a newer one
- **0.1.0-0.1.1** - first versions: events drawn as a timeline, a height setting, pictures in exports

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `check_timeline`: Verifica o código de um bloco ```timeline - um acontecimento por linha, escrito quando | o quê | mais - antes de entrar num documento, sem o desenhar. Devolve ok, ou os problemas a corrigir primeiro. Passe o código sem a cerca.
<!-- /ai-tools -->

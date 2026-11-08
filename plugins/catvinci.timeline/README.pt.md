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

Pede apenas **Ferramentas para o Textus AI**, para que o Textus AI possa verificar um bloco antes de escrevê-lo. Não lê arquivos e desenha tudo no seu aparelho, no computador e no iOS.

## Alterações

- **0.3.0** - uma ferramenta para o Textus AI, `check_timeline`
- **0.2.0** - as cores do tema, redesenhada quando o tema muda
- **0.1.3** - texto nas cores do tema no Textus 1.3
- **0.1.2** - acompanha edições rápidas: um desenho antigo não substitui mais um novo
- **0.1.0-0.1.1** - primeiras versões: eventos desenhados como linha do tempo, altura ajustável, imagens na exportação

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `check_timeline`: Verifica o código de um bloco ```timeline - um acontecimento por linha, escrito quando | o quê | mais - antes de entrar num documento, sem o desenhar. Devolve ok, ou os problemas a corrigir primeiro. Passe o código sem a cerca.
<!-- /ai-tools -->

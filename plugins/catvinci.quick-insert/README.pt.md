# Inserção rápida

Digite `/` para títulos, listas, tabelas e outros blocos, `:` para um emoji e `@` para uma data.

## O menu /

Digite `/` no início de uma linha ou depois de um espaço e escolha o que colocar ali - os blocos do próprio Textus, os mesmos do menu Formatar:

- **Texto, Título 1–3**, e **listas com marcadores, numeradas e de tarefas**
- **Citação, Destaque, Bloco de código, Fórmula, Tabela, Divisor**

Escolher um transforma nele a linha em que você está. Outros plugins acrescentam os próprios blocos ao menu (um banco de dados, um cartão de link, um lembrete, um modelo).

Continue digitando para estreitar a lista: `/tabela`, `/tab` - em qualquer idioma, e os nomes em chinês também pelo pinyin (`/biaoge`).

## Emoji

Digite `:` e uma palavra para um emoji: `:tada` dá 🎉, `:+1` 👍, `:笑` 😄.

## Datas

Digite `@` e um dia, e escolha a data que ele indica:

- English: `@today`, `@tomorrow`, `@yesterday`, `@friday`, `@next friday`, `@in 3 days`, `@next week`
- 中文: `@今天`、`@明天`、`@后天`、`@周五`、`@下周五`、`@星期三`、`@3天后`、`@下周` (ou `@後天`、`@下週五`、`@禮拜三`、`@3天後`)
- 日本語: `@今日`、`@明日`、`@明後日`、`@金曜日`、`@来週金曜日`、`@3日後`

As semanas começam na segunda-feira, e um dia da semana sozinho é o próximo.

A data é escrita como `2026-11-06`. Defina **Inserir como** nos ajustes do plugin para **Um link para a nota do dia** para escrever, em vez disso, um link para a nota diária desse dia, do jeito que a pasta escreve links: um link padrão como `[2026-11-06](Daily/2026-11-06.md)` ou, num cofre do Obsidian ou numa pasta cujas notas usam links wiki, `[[2026-11-06]]` com o nome e a pasta que os ajustes de notas diárias dela indicam, como `[[November 6th, 2026]]` ou `[[Journal/2026/11/2026-11-06]]`. Numa pasta sem esses ajustes, as notas diárias são procuradas em `Daily/`.

A lista se abre depois de um espaço, no início de uma linha ou depois de um colchete - não num endereço como `me@example.com` nem numa citação como `[@key]`. Depois de `(` o `@` fica, então `(@tomorrow` vira um lembrete, `(@2026-11-06`.

Tudo o que ele insere é Markdown comum.

## Permissões

- **Ler e editar o documento**: para inserir blocos, emojis e datas.
- **Ler arquivos**: para ler os ajustes de notas diárias de um cofre, para os links de dias.
- **Ferramentas para o Textus AI**: para que o Textus AI possa transformar um dia dito por palavras na data dele.

## Alterações

- **0.5.1** - Its page is in every language Textus speaks. Needs Textus 1.4.4 itself, not a test version of it.
- **0.5.0** - The `/` menu lists Textus's own blocks, the Format menu's, so it always matches the app; Turn into… is gone from it, since picking a block turns the line you're on (the block handle's ⋮⋮ also has Turn Into). Needs Textus 1.4.4
- **0.4.3** - Dates in Traditional Chinese like 後天, 3天後 and 下週五 now work. A bare @ lists your app language's dates first, and day links are right relative to the note.
- **0.4.2** - Shares Two-way Links' fix for working out how a note links.
- **0.4.1** - a day's link is a standard link, [2026-11-08](Journal/2026-11-08.md), unless the folder or the note already uses [[wiki links]]
- **0.4.0** - day links are written the way the folder writes links, on Textus 1.3.10's dates; needs Textus 1.3.10
- **0.3.1** - carries the updated shared date code
- **0.3.0** - Natural Dates merged in: `@` dates in English, Chinese and Japanese, links to daily notes, and the `parse_date` tool for Textus AI
- **0.2.0** - **Today's date** leaves the `/` menu for `@today`
- **0.1.0-0.1.1** - first versions: the `/` menu, **Turn into…**, emoji after `:`

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `parse_date`: Transforma um dia dito por palavras - em inglês, chinês ou japonês, como os conhece o preenchimento @ do plugin (tomorrow, next wednesday, in 3 days, 下周五, 明後日) - na sua data, YYYY-MM-DD, contada a partir de hoje. As semanas começam à segunda; um dia da semana sozinho é o próximo.
<!-- /ai-tools -->

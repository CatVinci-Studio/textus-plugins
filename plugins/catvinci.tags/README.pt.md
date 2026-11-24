# Tags

Lista na barra lateral todas as `#tags` da pasta aberta, com quantas notas usam cada uma.

- A aba **Tags** lista as tags, as mais usadas primeiro. Tags aninhadas (`#projeto/alfa`) formam uma árvore, como no Obsidian, e a contagem de uma tag inclui as notas das tags que estão abaixo dela. Digite no campo de filtro para estreitar a lista.
- Abra uma tag para ver as notas dela, e clique numa para abri-la.
- Clique com o botão direito numa tag e escolha **Renomear…** para renomeá-la em todas as notas, junto com as tags aninhadas nela (`#projeto/alfa` vira `#novo/alfa`). Maiúsculas e minúsculas não fazem diferença. Renomeie-a para uma tag que você já tem, e as duas viram uma só. Uma tag tem letras, números, `_`, `-` e `/`, e não só números.
- As tags no front matter (`tags: [a, b]`, ou uma lista sob `tags:`) também são renomeadas. Código, código em linha, endereços de links e tags mais longas que começam igual (`#rascunhos` quando você renomeia `#rascunho`) ficam como estão.

## Permissões

- Ler arquivos: para encontrar as tags da pasta.
- Gravar arquivos: para renomear uma tag nas notas que a têm.
- Ferramentas para o Textus AI: para que o Textus AI possa listar as suas tags e as notas com uma tag.

## Alterações

- **0.3.7** - Its page is in every language Textus speaks.
- **0.3.6** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller.
- **0.3.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.3.4** - Renaming leaves `[[#Heading]]` links alone, and a ``` line inside a `~~~` block no longer ends the code.
- **0.3.3** - Tags match in any letter case, as their counts do; renaming a tag moves its nested tags too and no longer touches link addresses or front-matter tags like `project-x`; tags like `a/` or `a//b` are refused.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - Tags used equally often are listed in natural name order ("Week2" before "Week10").
- **0.3.0** - Nested tags form a tree, each counting the notes of the tags under it; Textus AI finds a tag's nested tags too.
- **0.2.0** - Textus AI can list your tags and the notes with a tag (`list_tags`, `notes_with_tag`).
- **0.1.0-0.1.1** - First versions: tags with their counts, a tag's notes, renaming and merging in every note; runs on desktop and iOS.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `list_tags`: Lista todas as #tags dos documentos da pasta aberta com quantos documentos usam cada uma, as mais usadas primeiro.
- `notes_with_tag`: Lista os documentos da pasta aberta que têm uma #tag, cada um com o título, o caminho e as tags.
<!-- /ai-tools -->

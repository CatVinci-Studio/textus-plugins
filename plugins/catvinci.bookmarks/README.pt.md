# Favoritos

Marque um trecho e volte a ele pela barra lateral, em qualquer documento.

Selecione algumas palavras e escolha **Marcar a seleção**: clique com o botão direito na seleção ou use **Plugins › Marcar a seleção**. Salve o documento antes, porque o favorito aponta para o arquivo dele.

A aba **Favoritos** da barra lateral lista os favoritos por documento. Clique em um para abrir o documento nessas palavras. Para remover, clique com o botão direito e escolha **Remover favorito**. Se o documento for renomeado ou movido, os favoritos vão junto.

## Cofres do Obsidian

Quando a pasta aberta é um cofre do Obsidian (tem uma pasta `.obsidian`):

- Os favoritos do próprio Obsidian, em `.obsidian/bookmarks.json`, também aparecem na aba, em **Favoritos do Obsidian**, com os grupos do Obsidian. Entram os de notas, títulos e blocos; pesquisas, pastas e afins ficam de fora.

## Permissões

- Ler o documento: para ler a seleção.
- Ler arquivos: para o `bookmarks.json` do Obsidian.
- Ferramentas para o Textus AI: para o Textus AI poder listar seus favoritos.

## Alterações

- **0.4.6** - Its page shows its list of changes in English in every language.
- **0.4.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.4.4** - Obsidian's bookmarks are listed as before but no longer written: Textus 1.4 keeps plugins out of `.obsidian`. Needs Textus 1.4.0.
- **0.4.3** - Rows are grouped by the document's path in the folder, one group per document; long passages end at a word with "…"; a failed block-id edit in a vault keeps the bookmark.
- **0.4.2** - Shorter help and empty-state text.
- **0.4.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.0** - In an Obsidian vault, new bookmarks are written to Obsidian's `bookmarks.json` too, and removed and renamed there.
- **0.3.0** - Lists the vault's own Obsidian bookmarks of notes, headings and blocks.
- **0.2.1** - Paths handled by code shared with other plugins; nothing changes in use.
- **0.2.0** - Textus AI can list your bookmarks (`list_bookmarks`).
- **0.1.0-0.1.2** - First versions: bookmark a selection, the sidebar list by document, bookmarks that follow renames; store page and icon; runs on desktop and iOS.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `list_bookmarks`: Lista os favoritos do usuário: as palavras marcadas em cada documento, com o caminho do documento na pasta aberta.
<!-- /ai-tools -->

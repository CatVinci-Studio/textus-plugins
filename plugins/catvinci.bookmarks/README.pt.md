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

- **0.4.4** - Os favoritos do Obsidian continuam listados, mas não são mais gravados: desde o Textus 1.4 os plugins não alteram `.obsidian`. Precisa do Textus 1.4.0.
- **0.4.3** - A lista é agrupada pelo caminho do documento na pasta, um grupo por documento; trechos longos terminam em uma palavra com "…"; se o id de bloco falhar em um cofre, o favorito é salvo mesmo assim.
- **0.4.2** - Textos de ajuda e de estado vazio mais curtos.
- **0.4.1** - Sua página agora diz numa frase o que ele faz, o que pode fazer e o que mudou em cada versão.
- **0.4.0** - Num cofre do Obsidian, os favoritos novos também são gravados no `bookmarks.json` dele, e removidos e renomeados lá.
- **0.3.0** - Lista os favoritos do próprio Obsidian no cofre: notas, títulos e blocos.
- **0.2.1** - Caminhos tratados por código compartilhado com outros plugins; nada muda no uso.
- **0.2.0** - O Textus AI pode listar seus favoritos (`list_bookmarks`).
- **0.1.0-0.1.2** - Primeiras versões: marcar a seleção, lista por documento na barra lateral, favoritos que acompanham renomeações; página na loja e ícone; funciona no desktop e no iOS.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `list_bookmarks`: Lista os favoritos do usuário: as palavras marcadas em cada documento, com o caminho do documento na pasta aberta.
<!-- /ai-tools -->

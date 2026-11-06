# Links bidirecionais

> Links como `[[Nota]]` vêm com o Textus: você os escreve e segue sem nenhum plugin. Este plugin ajuda a escrevê-los, mostra no lugar o que eles apontam e lista quem aponta para o documento aberto.

## Criar links enquanto escreve

- Digite `[[` e escolha uma nota no painel que abre – pelo nome, pelo primeiro título ou por um `aliases` do front matter. Um alias é escrito como `[[Nota|alias]]`.
- Depois de `#`, os títulos da nota: `[[Nota#Título]]`. `[[#` lista os do próprio documento.
- Depois de `#^`, os blocos: parágrafos, itens de lista, tabelas, citações. Um bloco sem id ganha um no fim, naquela nota (`^1a2b3c`), como o Obsidian escreve.
- Selecione algumas palavras e digite `[[` para transformá-las em link.
- Os links são escritos como a pasta os escreve: num cofre do Obsidian, no formato de link do cofre.

## Incorporações

- `![[Nota]]` mostra a nota no lugar, `![[Nota#Título]]` essa seção e `![[Nota#^id]]` esse bloco – só leitura, e atualizado quando a nota muda.
- Ponha o cursor na linha para editar o próprio link.

## Backlinks na barra lateral

O que aponta para o documento aberto e para onde ele aponta, na aba **Links bidirecionais** da barra lateral.

- **Menções com link**: as linhas de outras notas que apontam para cá, com [[links wiki]] ou links para este arquivo. Clique em uma para ir até lá.
- **Menções sem link**: linhas que citam esta nota – pelo nome do arquivo, pelo primeiro título ou pelos `aliases` do front matter – sem link. Clique com o botão direito e escolha **Criar link** para virar um [[link]].
- **Links de saída**: as notas para as quais esta aponta, incluindo as que ainda não existem.
- O campo no topo filtra a lista.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `list_backlinks`: Para um documento - o que está em primeiro plano se não for dado caminho - lista as notas que apontam para ele (caminho, linha, texto da linha), as linhas que o nomeiam sem link e as notas para onde ele aponta.
<!-- /ai-tools -->

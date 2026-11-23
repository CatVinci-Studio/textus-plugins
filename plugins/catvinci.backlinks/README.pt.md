# Links bidirecionais

Crie links para notas, títulos e blocos ao digitar `[[`, incorpore-os com `![[` e veja na barra lateral o que aponta para o documento aberto.

Links como `[[Nota]]` já vêm no Textus: você pode escrevê-los e segui-los sem nenhum plugin. Este plugin ajuda a escrevê-los, mostra no lugar o que eles apontam e reúne os links em volta do documento que você está lendo. Funciona no computador e no iOS.

## Links enquanto você digita

- Digite `[[` e escolha uma nota no painel que se abre: pelo nome do arquivo, pelo primeiro título ou por uma entrada `aliases` do front matter. Um alias é escrito como `[[Nota|alias]]`.
- Depois de `#`, os títulos da nota: `[[Nota#Título]]`. `[[#` lista os do próprio documento.
- Depois de `#^`, os blocos: parágrafos, itens de lista, tabelas, citações. Um bloco sem id ganha um no fim, nessa nota (`^1a2b3c`), do jeito que o Obsidian escreve.
- Selecione algumas palavras e digite `[[` para transformá-las em link.
- Os links são escritos do jeito da pasta: a escolha dela, ou o formato de links de um cofre do Obsidian; senão, como a nota já liga; senão, um link padrão, `[Nov 8](Week45/Nov%208.md)`, que abre em qualquer app. Um [[link]] que precisa de um caminho mostra o nome da nota.

## Incorporações

- `![[Nota]]` mostra a nota no lugar, `![[Nota#Título]]` essa seção e `![[Nota#^id]]` esse bloco. São somente leitura e se atualizam quando a nota muda.
- Coloque o cursor na linha para editar o próprio link.

## Links na barra lateral

A aba **Links bidirecionais** da barra lateral mostra o que aponta para o documento aberto e para onde ele aponta.

- **Menções com link**: as linhas de outras notas que apontam para cá, com [[links wiki]] ou links para este arquivo. Clique numa para ir até lá.
- **Menções sem link**: linhas que citam esta nota (pelo nome do arquivo, pelo primeiro título ou pelos `aliases`) sem link. Clique com o botão direito e escolha **Criar link**. Se a linha usa um alias, ele fica como texto do link.
- **Links de saída**: as notas para as quais esta aponta, inclusive as que ainda não existem.
- O campo no topo filtra a lista.

## Links padrão ou [[links wiki]]

- **Plugins › Links novos: padrão ou [[wiki]]…** escolhe como os links novos da pasta aberta são escritos. A escolha fica no `.textus/settings.json` da pasta, e o Textus e os outros plugins a seguem.
- **Plugins › Converter links em links padrão…** e **Converter links em [[links wiki]]…** reescrevem os links do documento em primeiro plano ou de todas as notas da pasta. Primeiro dizem quantos vão mudar; cada um continua levando ao mesmo lugar. O código, o front matter e um link cuja nota não é encontrada ficam como estão; imagens e outros arquivos continuam como links padrão.

## Permissões

- **Ler e editar o documento**: para completar links enquanto você digita e transformar uma seleção em link.
- **Ler e gravar arquivos na pasta aberta**: para encontrar links e menções, criar o link de uma menção e dar a um bloco seu `^id`.
- **Ferramentas para o Textus AI**: para que o Textus AI possa listar os links de um documento.

## Alterações

- **0.4.7** - Code kept for Textus versions it no longer runs on is gone.
- **0.4.6** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.4.5** - Unlinked mentions open on the right line, and Link Style is set by Textus itself (Textus 1.4.3).
- **0.4.4** - The Convert Links commands leave links inside a code block alone and convert the ones after it, and Unlinked mentions no longer lists or links names in front matter or code.
- **0.4.3** - Standard links to notes that don't exist yet now show under Outgoing links, a note's links to its own headings no longer list the note itself, and dragging a divider no longer redraws the panel.
- **0.4.2** - Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.4.1** - In a note with no links yet, [[ writes a standard link: the [[ being typed was taken for a wiki link the note already had.
- **0.4.0** - New Links: Standard or [[Wiki]]… chooses how the folder writes new links, and Convert Links turns a note's or the whole folder's links from one way into the other; [[ writes the folder's way, a standard link where nothing says otherwise.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - `[[` completion for notes, headings and blocks; `![[` embeds; renamed from Backlinks to Two-way Links
- **0.2.1** - the description says "two-way links", so a store search finds it
- **0.2.0** - a tool for Textus AI, `list_backlinks`
- **0.1.0-0.1.1** - first versions: linked and unlinked mentions with **Link**, outgoing links and a filter; suggested for documents with wiki links

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `list_backlinks`: Para um documento - o que está em primeiro plano se não for dado caminho - lista as notas que apontam para ele (caminho, linha, texto da linha), as linhas que o nomeiam sem link e as notas para onde ele aponta.
<!-- /ai-tools -->

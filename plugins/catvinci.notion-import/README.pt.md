# Importar do Notion

Transforma uma exportação do Notion em arquivos Markdown simples na pasta aberta, que o Obsidian também lê.

Páginas e subpáginas, imagens e anexos, os links entre eles e os bancos de dados no formato Bases do Obsidian, tudo vem junto.

1. No Notion, escolha **Configurações › Exportar todo o conteúdo do espaço de trabalho**, com **Markdown e CSV** e as subpáginas incluídas. Coloque o .zip que ele gera (ou a pasta em que ele se descompacta) na pasta aberta no Textus.
2. Escolha **Plugins › Importar do Notion…** (ou clique com o botão direito no .zip na barra lateral) e escolha a exportação. Uma exportação grande dividida em Part-1.zip, Part-2.zip… dentro de um zip é aberta como uma só. Um .zip com mais de 256 MB é grande demais para ler de uma vez: descompacte-o na pasta aberta e escolha essa pasta.
3. Dê um nome à pasta para onde vai a importação (**Notion**, se você não digitar outro); nada do que já está lá é alterado. Uma barra de progresso permite cancelar; o que já foi escrito fica. Uma página de relatório se abre no fim e, com o **Wiki** instalado, a barra lateral mostra a importação como uma árvore de páginas.

## No que ela se transforma

- **Páginas**: uma página com subpáginas - uma linha de banco de dados com subpáginas também - vira uma pasta com a página dentro, `Plans/Plans.md`, e as subpáginas ao lado; uma página sem subpáginas é um arquivo, `Plans.md`. Os ids do Notion saem dos nomes; a página de uma linha de banco de dados recebe o título inteiro, que o Notion corta nos nomes de arquivo.
- **Bancos de dados**: cada banco de dados vira uma pasta com uma página que contém um bloco `base`, com as visualizações a um clique de distância - o quadro quando ele tem um status, a tabela, e o calendário quando ele tem datas. Cada linha é uma nota nessa pasta, com as propriedades no front matter: datas como 2026-01-04, caixas de seleção, números, listas, relações como links. Onde outra página mostra um banco de dados, ela o mostra ali também, ordenado como diz a exportação. As linhas e páginas vazias "Untitled" do Notion ficam de fora.
- **Imagens e anexos** vão para uma pasta `assets` ao lado da página que os mostra; imagens coladas recebem o nome da página.
- **Os links** entre páginas, para imagens e para anexos acompanham os nomes novos. Os links para páginas que não foram exportadas são listados no relatório.
- **Links entre páginas**: perguntado no início: links padrão (recomendado), `[Page](Page.md)`, como o Notion os exporta e qualquer app abre, ou `[[links wiki]]`, como o Obsidian os escreve. A pasta importada guarda a escolha, então uma página criada nela depois faz links do mesmo jeito.
- **Os destaques** viram notas (`> [!NOTE]`), mantendo o emoji. Os blocos recolhíveis ficam como `<details>`.

**Ícones de página**: a exportação em Markdown do Notion os deixa de fora. Exporte as mesmas páginas também em HTML e escolha essa exportação quando a importação perguntar: os ícones de emoji das páginas vêm junto.

**O que fica para trás**: a exportação do Notion não tem capas, comentários nem os filtros das visualizações salvas, então eles não vêm; a ordenação de uma visualização vem. As propriedades de fórmula e de rollup mantêm o valor que tinham, e as menções a pessoas e datas viram texto comum.

## O relatório

O relatório conta o que entrou, lista os links que não encontrou, os arquivos que não conseguiu ler ou gravar e os blocos que alterou, e sugere os plugins que ajudam com o resto - primeiro o Wiki, para a árvore de páginas e os bancos de dados; depois Links bidirecionais, Prévia rápida, Tarefas, Cartões de link, Visualizador de PDF e Modelos, cada um só quando a importação tem aquilo em que ele ajuda. **Plugins › Plugins que ajudam após importar do Notion…** oferece a instalação de um deles; o Textus pergunta antes, e nada é instalado sozinho.

## Permissões

Tudo acontece no seu aparelho: o plugin só lê e grava arquivos na pasta aberta e nunca usa a rede. Precisa do Textus 1.3.10 ou mais recente.

## Alterações

- **0.7.13** - A simpler icon, drawn in the text colour.
- **0.7.12** - Its page is in every language Textus speaks. In Chinese, a database is 数据库, and 知识库 is only the Wiki plugin's name. Every language calls the Wiki plugin by its current name.
- **0.7.11** - Its package lists the libraries it carries, with their licenses.
- **0.7.10** - The database code it shares with Database brought up to date (its file columns filled).
- **0.7.9** - Databases it makes keep a view another plugin draws (Textus 1.4.6).
- **0.7.8** - The import report gets a free name as it is written (Textus 1.4.3).
- **0.7.7** - Bundles the Wiki plugin's newer base code; importing works as before.
- **0.7.6** - Importing a database with many rows is quicker.
- **0.7.5** - Page icons now come through from an unzipped HTML export too, and such an export shows up when you pick where the icons come from.
- **0.7.4** - Shares the database's updated filter code: a filter ticking several values reads the same in both. Shorter help and empty-state text.
- **0.7.3** - Once imported, the sidebar goes into the new folder (Textus 1.3.12) and shows its pages tree. Notion's blank rows and pages - no title, nothing written, only the "Not started" status Notion fills in - are left out.
- **0.7.2** - A database that sits under a page (as in Notion) stays a link on that page, no longer also shown there as a table; its own page shows it. Its code is split into smaller files by what each part does.
- **0.7.1** - Shares Two-way Links' fix for working out how a note links.
- **0.7.0** - asks how the pages link: standard links (recommended), as Notion exports them, or [[wiki links]] - a path shown by the page's name; the imported folder keeps the choice for pages made in it later
- **0.6.1** - Calls Workspace by its name in the import report and in the suggested plugins.
- **0.6.0** - Dates written by Textus itself; needs Textus 1.3.10.
- **0.5.0** - Page emoji icons, from Notion's HTML export of the same pages.
- **0.4.0** - Its own plugin again: pages with sub-pages as folders, databases as Obsidian bases, empty "Untitled" pages left out, and the import opened in Workspace's pages tree.
- **0.3.0** - Merged into Workspace for a while; this version only pointed there.
- **0.2.2** - One database block per database, opening on the board when there is a status.
- **0.2.1** - Asks what to name the import's folder; pasted pictures are named after their page.
- **0.2.0** - Reads Notion's newer exports: no doubled pages or rows, rows keep their whole titles, attachments go beside the page that uses them, databases shown on other pages keep their sort.
- **0.1.1** - The report suggests Two-way Links by its new name.
- **0.1.0** - First version: a Notion export (.zip or folder) into a folder of Markdown, ids out of names, links rewritten, databases as notes with front matter, callouts as notes, a report with plugins that help.

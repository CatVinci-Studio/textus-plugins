# Wiki

Páginas dentro de páginas, e bancos de dados das suas notas como tabelas, quadros, calendários, galerias e listas, tudo em arquivos Markdown simples.

Os bancos de dados são escritos no **formato Bases do Obsidian** (blocos ` ```base ` e arquivos `.base`), então o Obsidian abre os mesmos bancos.

## Páginas

- **Uma página com subpáginas é uma pasta**: `Plans/Plans.md` é a página, e as subpáginas dela ficam ao lado, em `Plans/` - igual às notas de pasta do Obsidian. Digite `/` e escolha **Nova subpágina…**, ou use **Plugins › Nova subpágina…**. A primeira subpágina move `Plans.md` para a pasta dela por você, e os links para ela acompanham.
- **A aba Páginas** da barra lateral mostra a pasta como uma árvore de páginas. Clique com o botão direito numa página para criar uma subpágina, renomeá-la, dar a ela um ícone ou movê-la para a lixeira (com as páginas abaixo dela, depois de perguntar). Arraste uma página sobre outra para torná-la subpágina dessa. Os links acompanham cada movimento.
- **Ícones de página**: **Definir ícone da página…** (no menu Plugins, ou com o botão direito num documento da aba Arquivos) escolhe um emoji, guardado como `icon` no front matter da página.
- **Páginas ou Arquivos?** A aba Páginas mostra as páginas e o que está abaixo delas, como faz o Notion; a aba Arquivos mostra cada arquivo e pasta como estão no disco. Use qualquer uma: são os mesmos arquivos.
- **Onde você está**: numa subpágina, a barra de status mostra as páginas acima dela - `Vida › Calendário 2026 › Semana 1`.
- **Renomear a pasta de uma página** na aba Arquivos renomeia a página junto, para que ela continue sendo uma página com subpáginas.
- **Organização antiga**: `Plans.md` com as subpáginas numa pasta `Plans/` ao lado funciona do mesmo jeito. **Plugins › Organizar páginas em pastas…** move de uma vez cada página assim para a pasta dela, depois de mostrar a lista.

## Bancos de dados

Um banco de dados é um bloco `base` numa página, ou um arquivo `.base` aberto numa aba. Os filtros dele escolhem notas: cada nota é uma linha, e as propriedades do front matter dela são as colunas. Digite `/` e escolha **Novo banco de dados…** (ou **Plugins › Novo banco de dados…**): ele cria uma pasta para o banco com uma página que contém o bloco.

````markdown
```base
filters:
  and:
    - file.inFolder(this.file.folder)
    - file.path != this.file.path
views:
  - type: kanban
    name: Board
    groupBy:
      property: status
    groupOrder: [To read, Reading, Read]
  - type: table
    name: Table
    limit: 25
```
````

- **As visualizações** são abas no topo do bloco: Tabela, Quadro, Calendário, Galeria (os `cards` do Bases) e Lista. Clique com o botão direito numa visualização para abrir o menu dela: layout, renomear, excluir. **+** adiciona uma visualização. O Calendário é do próprio Textus; o Obsidian o mostra como uma visualização que não conhece.
- **Cada linha é uma nota.** Clique numa célula para alterá-la; a propriedade é escrita no front matter dessa nota. **Nova** cria uma nota na pasta do banco. Uma linha abre numa aba, como um arquivo.
- **Colunas**: clique no cabeçalho de uma coluna para ordenar por ela, filtrá-la, mudar o tipo, renomeá-la, ocultá-la ou excluir a propriedade de todas as linhas; **+** adiciona uma propriedade. Arraste um cabeçalho para mover a coluna, e arraste a borda direita dele para definir a largura (clique duas vezes na borda para voltar à largura inicial). Uma coluna mantém a largura, seja qual for a largura do banco. A ordem e as larguras ficam guardadas no banco, as larguras como o `columnSize` do Obsidian.
- **Quadro**: arraste um cartão para outra lista para mudar o valor dele. Arraste uma lista pelo cabeçalho para pôr as listas na ordem que quiser (`groupOrder`).
- **Calendário**: as linhas são colocadas por uma propriedade de data; clique num dia para criar uma linha nessa data.
- **Filtrar**, **Ordenar** e os menus das colunas ficam guardados na visualização como o Bases os escreve: `status == "Read"`, `tags.contains("ml")`, `due.isEmpty()`. Os filtros que o Textus ainda não consegue ler ficam como estão, com um aviso embaixo da barra.
- **Tamanho num documento**: um banco é tão largo quanto o texto (ou o painel, com **Exibição larga**) e rola para o lado quando as colunas são mais largas; é tão alto quanto as linhas, até o limite do Textus para um bloco (70% da janela, no máximo 1200 px), e depois rola por dentro. Aí uma tabela ou lista termina entre duas linhas, nunca no meio de uma; as outras visualizações esmaecem embaixo enquanto houver mais.
- **Bancos longos** mostram as primeiras 25 linhas (ou o `limit` da visualização); rolar para baixo carrega o resto, com o cabeçalho da tabela sempre à vista. A setinha à esquerda de um bloco, ao passar o ponteiro, recolhe-o numa linha; o recolhimento e a visualização em que você o deixa ficam guardados só neste aparelho.
- **Fórmulas** (`formulas:` no banco) são calculadas para cada linha e podem ser colunas, filtros e ordenações: `(price / pages).toFixed(2)`. Os resumos ainda não são desenhados.
- **Os tipos de propriedade** são os do Obsidian, de `.obsidian/types.json`, quando a pasta é um cofre.
- **Numa nota incorporada** (`![[página]]`), um banco é uma linha; clique nela para desenhá-lo.
- **Do Dataview**: coloque o cursor num bloco ` ```dataview ` e execute **Plugins › Converter consulta do Dataview em base**. `TABLE` e `LIST` com `FROM`, `WHERE`, `SORT` e `LIMIT` viram o mesmo banco no lugar do bloco; `TASK`, `GROUP BY`, `FLATTEN` e `dataviewjs` são recusados com o motivo, e nada muda.

As exportações do Notion entram pelo plugin **Importar do Notion**, que escreve páginas e bancos de dados que este plugin mostra.

## Permissões

- **Ler e gravar arquivos na pasta aberta**: para ler as notas e as propriedades delas, criar páginas e bancos de dados, gravar as edições das células no front matter e mover ou renomear páginas com os seus links.
- **Ler e editar o documento**: para inserir um banco de dados ou uma subpágina novos e o link deles, e para transformar um bloco do Dataview num banco.
- **Ferramentas para o Textus AI**: para que o Textus AI possa criar bancos de dados e páginas, ler linhas e adicioná-las.

## Alterações

- **0.8.3** - The bar stays on one line when there is room: in a zoomed block on a Mac it folded the view tabs into one button and put the sorts on a line of their own, and measured itself many times on every click. A table or list taller than Textus lets a block be ends between two rows instead of through one; other views fade at the foot while more is below. A column keeps its width however wide the block is, instead of stretching to fill it. By touch, a board card or lane lifts after a short hold, so a swipe scrolls instead of dragging. Its page is in every language Textus speaks. Its tools for Textus AI are described in every language, and in Chinese a database is 数据库 while 知识库 is the plugin's name.
- **0.8.2** - The `file.folder`, `file.path` and `file.mtime` columns show each page's folder, path and when it was last changed (they were empty).
- **0.8.1** - Rows and cards make way at the pace of the rest of Textus.
- **0.8.0** - Other plugins can add views beside the table, board, calendar, gallery and list - the Timeline plugin's timeline, for one - in the view menus. Needs Textus 1.4.6 for those.
- **0.7.16** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller. A board's lists move as Textus's own tabs do, and a column's width can also be set with the arrow keys.
- **0.7.15** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.7.14** - A column's grip is placed by Textus's shared rule, the same one as the document's tables. The calendar view and cell editing use Textus's shared page tools. Needs Textus 1.4.3.
- **0.7.13** - A column is pulled by the same grip as the document's tables, and lifts and slides the same way. Needs Textus 1.4.3.
- **0.7.12** - A view tab whose name would be cut short ("Calenda") makes the bar give way a step instead. Menu words match the app's table menu (Title Case; German, Spanish and Portuguese row words).
- **0.7.11** - A filter's verb (is, is not, is empty) is picked from Textus's own menu instead of the system's dropdown, and its option boxes are Textus's own checkboxes.
- **0.7.10** - Renaming a row in a table renames it as the Pages tree does: a page with sub-pages keeps them and stays in its database, and only the page's own title heading changes. An open `.base` file shows changes saved in Textus or written by a plugin, and never writes an older copy over a newer file: a change made meanwhile is refused with a note to make it again. Renaming a property to a name some notes already have asks first and keeps their value.
- **0.7.9** - Tables are denser: every column has one width (the title's wider) and the table scrolls sideways when they don't fit, each row is one line with longer values cut short and shown whole on hover, and rows sit closer. Tags and links no longer run over the next column. A base on screen draws again only when its rows change, not at every save in the folder. A base's bar no longer jumps back and forth between one line and two.
- **0.7.8** - Setting a column's type (number, date, checkbox, list) works again in every folder: the type is kept in the base, and Obsidian's own types are still read. A base in a document draws at the interface's text size, so a wider column shows more of it rather than larger text; Cut, Copy and Paste in a cell's right-click menu work with Textus 1.4.1.
- **0.7.7** - Every button and menu now shows its words in your language, including Japanese, Korean, German, Spanish, French, Portuguese and Russian; a board lane's tooltip no longer shows a raw name. A table now fits its page and wraps long names before it scrolls sideways; a page's icon shows in place of the file icon in the Pages tree. Needs Textus 1.4.0.
- **0.7.6** - In a narrow block the bar keeps to one line: the count goes first, then New's word, then the view tabs fold into a menu; sorts and filters ride in the bar while there's room. A filter on a select, tags or a checkbox is ticked in a list, as in Notion, with Clear selection. A dragged view tab stays where it's let go, and a view wider than the block fades at its edges. With Textus 1.3.13 the block can be shown wide, across the pane, and drawn smaller, from its right-click menu. Shorter help and empty-state text.
- **0.7.5** - A long title or text wraps within a column of a set width instead of stretching the table; a row's right-click menu is laid out as a Markdown table's (insert a row below or a column to the right, then Row and Column); the date month opens and sits under its field in every window, zoomed too; a new row is drafted in the table's own cells; a field's right-click menu is Textus's own; a view's tab can be dragged on a Mac too; needs Textus 1.3.12. Its name is Notion's word for a wiki in each language (Wiki in English); a database is a base, as Obsidian calls it (New Base…).
- **0.7.4** - a table's head stays in view while its rows scroll; more rows load as you scroll down, no Show more; a view's menu is on right-click only; columns start at widths in proportion to the block; the view you leave a block in is kept on this device, not in the note; a block folds with Textus's own caret on its left, no fold arrow of its own; a column is dragged by its head as the sidebar's tabs are, the others sliding aside; a rating column shows the same way all down; a filter added twice is kept once, and one that contradicts another (status is Done, then status is Doing) takes its place; its board, fields and stars are Textus's own controls; a row's right-click menu opens it or moves it to the Trash; view tabs are dragged into a new order; a date is typed or picked from a small month under its field; a new sub-page's link in a page just moved into its folder points from where the page is now; needs Textus 1.3.12
- **0.7.3** - Shares Two-way Links' fix for working out how a note links.
- **0.7.2** - a dragged column stays under the pointer in a zoomed document, and dragging selects no text; a date is edited as it is shown, 2026-11-08, not in the system's order; new pages and databases are linked with standard links, [Week 1](Week%201.md), unless the folder or the page already uses [[wiki links]]
- **0.7.1** - new databases and sub-pages are linked the way the folder writes links; needs Textus 1.3.10
- **0.7.0** - drag column heads to reorder and their edges to resize (`columnSize`); a view's menu on right-click; rows open in a tab; option colors from their words; **Convert Dataview query to base**
- **0.6.0** - databases are Obsidian bases (` ```base ` blocks and `.base` files) with views, filters, sorts, `groupOrder`, `limit`, formulas, folding and **Show more**; the Pages tab can rename, delete to the Trash and drag; page folders follow renames
- **0.5.0** - renamed Workspace: Pages and Notion Import merged in; a page with sub-pages becomes a folder, and **Organize Pages into Folders…** moves older pages
- **0.4.3** - card tags and long values wrap on boards and galleries
- **0.4.1-0.4.2** - Notion dates and relations read better; then the Notion import moves to the Notion Import plugin
- **0.4.0** - tools for Textus AI to read a database's rows and add rows
- **0.3.0** - Textus's own menus for properties, filters and options, and no frame around the block
- **0.2.0** - Notion-style filters and sorts, select options, property types, and columns and pages made in the table
- **0.1.0-0.1.1** - first versions: a folder's documents as a table, board, calendar or gallery, edited in place; a Notion CSV import; a tool for Textus AI to make a database

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `create_database`: Cria um banco de dados no formato Bases do Obsidian: uma pasta de notas cujo front matter guarda as propriedades de cada uma, e nela uma página com um bloco ```base que as mostra como tabela, quadro, calendário, galeria ou lista. Devolve um link para essa página, para pôr onde o usuário quiser.
- `query_rows`: Lê as linhas de um banco de dados - as notas que a sua base escolhe, por padrão as da sua pasta -, cada uma com nome, caminho e propriedades, filtradas e ordenadas.
- `add_row`: Adiciona uma linha a uma base de dados: um documento na sua pasta, com o nome da linha e as propriedades no front matter. Todos os blocos que mostram essa pasta passam a mostrá-la. Só para a pasta de um banco de dados (create_database, query_rows); uma tarefa simples é add_task.
- `create_page`: Cria uma página: um documento com esse título na raiz da pasta aberta, ou uma subpágina na pasta ao lado da página-mãe, com ícone se for dado. Devolve o caminho e o [[link]] a pôr na página-mãe.
<!-- /ai-tools -->

# Notas rápidas

Anote algo sem sair do documento; a nota vai para o arquivo de caixa de entrada da sua pasta ou para a nota diária de hoje.

- **Ctrl+Alt+N** (**⌘⌥N** no Mac), ou **Plugins › Nova nota rápida…**, pede uma nota e a salva.
- No desktop, **Nova nota rápida…** também fica no ícone da bandeja ou da barra de menus. O plugin pede ao Textus para continuar rodando em segundo plano, então ela está lá mesmo com todas as janelas fechadas.
- A aba **Notas rápidas** da barra lateral lista as notas, a mais recente no topo. Clique em **Nova** para escrever uma ali, ou edite uma nota direto na lista.
- O menu de ações de cada nota (o botão de mais opções, ou clique direito) tem **Inserir** (no cursor do documento), **Abrir** e **Excluir**. Uma nota guardada num documento abre lá, na linha dela.
- Excluiu sem querer? **Desfazer**, embaixo, traz a nota de volta por alguns segundos. Uma nota nova deixada vazia some sozinha.
- Com seis notas ou mais, aparece um campo de busca no topo.

## Onde as notas ficam

As notas ficam num documento da pasta aberta, então o Obsidian e o Cloud Sync as veem. Escolha onde em **Guardar notas em**, nos ajustes do plugin:

- **Arquivo de caixa de entrada** (padrão): `Inbox.md` na raiz da pasta, ou outro documento definido em **Arquivo de caixa de entrada**. Cada nota é adicionada ao fim como item de lista com data e hora, por exemplo `- 2026-11-08 14:05 Ligar para a Ana`.
- **Nota diária de hoje**: sob um título `## Notas rápidas` (no idioma da interface), criado se faltar. Cada nota tem a hora, por exemplo `- 14:05 Ligar para a Ana`. A pasta, o nome e o modelo da nota diária seguem os ajustes de notas diárias da pasta, como os do Obsidian; sem eles, é `Daily/YYYY-MM-DD.md`.

Edite o arquivo e a barra lateral acompanha. As notas de versões antigas vão para ele uma vez, da mais antiga à mais nova. Sem pasta aberta, as notas ficam dentro do Textus.

No celular, **Nova nota rápida…** fica em **Plugins**, no menu da linha do título, e as ações de cada nota ficam no botão de mais opções dela. Lá não há bandeja, então ele não pede para o Textus continuar rodando em segundo plano.

## Permissões

- Ler e gravar arquivos: para o arquivo de caixa de entrada ou a nota diária.
- Editar o documento: para inserir uma nota no cursor.
- Ferramentas para o Textus AI: para o Textus AI poder adicionar uma nota rápida.

## Alterações

- **0.6.0** - On iPhone, iPad and Android too: **New Quick Note…** under Plugins and the sidebar tab, with New and each note's more button easy to tap. Only the desktop asks to keep Textus running in the background. Needs Textus 1.4.7. Its page no longer says which devices it runs on: the store shows that.
- **0.5.5** - Its buttons' names and tooltips come from Textus, as on its other pages.
- **0.5.4** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.5.3** - New while searching clears the search, so the new note shows; right-clicking a note's text also offers undo, cut, copy and paste; a search with no match says so.
- **0.5.2** - In the sidebar the panel draws no title of its own, as the sidebar's other tabs. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout. An empty list says what Quick Notes is for and offers New; a note's box grows with its text.
- **0.5.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.5.0** - Dates and the daily note's template are filled by Textus itself, the same way as in Calendar & Daily Notes and Templates. Needs Textus 1.3.10.
- **0.4.0** - Notes are kept in a document of the folder: `Inbox.md` or today's daily note. Notes from older versions move in once.
- **0.3.1** - Textus AI tells quick notes apart from the daily journal and to-dos.
- **0.3.0** - Textus AI can add a quick note (`add_note`).
- **0.2.0** - Textus's own controls, and an actions menu for each note.
- **0.1.0-0.1.4** - First versions: the shortcut and the tray, the sidebar list, insert, open, delete with Undo, search once there are many, dates on a line of their own; desktop only.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `add_note`: Adiciona uma nota rápida no topo da lista de Notas rápidas da barra lateral, para inserir depois num documento ou abrir como um. O diário de hoje é append_to_daily_note; uma tarefa, add_task.
<!-- /ai-tools -->

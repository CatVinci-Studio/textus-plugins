# Quadro de tarefas

Organize o trabalho em cartões e listas num quadro guardado como um arquivo Markdown comum.

- **Plugins › Novo quadro de tarefas…** pede um nome e cria _nome_.md na pasta aberta, com `kanban-plugin: board` no front matter e três listas: A fazer, Fazendo e Feito. Se já existir um quadro com esse nome, ele é que abre.
- Qualquer arquivo .md com `kanban-plugin` no front matter abre como quadro. É assim que o plugin Kanban do Obsidian guarda os quadros dele, então cada app abre os quadros do outro. Quadros antigos chamados _nome_.kanban.md continuam abrindo como quadros.
- Cada lista é um título no arquivo e cada cartão uma tarefa embaixo dele, então o quadro fica legível em qualquer lugar.

## No quadro

- **Adicionar um cartão** no fim de uma lista. Clique no texto de um cartão para editá-lo e marque a caixa quando estiver feito. O botão ⋯ (ou um clique direito) move-o para outra lista ou exclui-o; Desfazer no aviso que se segue traz ele de volta.
- **Adicionar lista** cria uma lista nova, pronta para receber um nome. Clique no título de uma lista para renomeá-la; uma lista vazia pode ser excluída pelo menu ⋯.
- No telefone, cada lista ocupa a tela: deslize para ir à próxima.
- Arraste cartões dentro de uma lista ou para outra, e arraste uma lista pelo topo para mudar a ordem. Os outros abrem espaço enquanto você arrasta. Numa tela sensível ao toque, segure um cartão por um instante e depois arraste; na borda da tela de um celular, o quadro passa para a lista seguinte. Segurado e solto sem mover, o cartão abre o seu menu.
- Escreva um [[link]] num cartão e clique nele para abrir essa nota.
- **Editar como Markdown** abre o arquivo como texto. O quadro acompanha as mudanças feitas lá ou em qualquer outro lugar.
- O que o Kanban do Obsidian guarda no arquivo além das listas, como os ajustes dele e a marca da lista de concluídos, fica como estava.

```markdown
---
kanban-plugin: board
---

## A fazer

- [ ] Escrever o roteiro

## Feito

- [x] Escolher um título
```

## Permissões

- Ler e gravar arquivos: para abrir e salvar quadros.
- Ferramentas para o Textus AI: para o Textus AI encontrar e ler quadros, adicionar cartões e movê-los.

## Alterações

- **0.4.14** - On a phone or tablet, hold a card a moment to drag it within a list or to another; at the screen's edge on a phone the board turns to the next list, and the page no longer scrolls under the card. Held and let go without moving, a card opens its menu. Dragged near the board's edge, the board scrolls, and a card let go below a short list goes into that list.
- **0.4.13** - A card's ⋯ menu (or a right-click) moves it to another list or deletes it, with Undo, instead of an × that deleted at once - always showing on a touch screen. A new list starts with its name being written. On a phone a list fills the screen and a swipe settles on the next; in a narrow tab, Edit as Markdown goes into the ⋯ menu.
- **0.4.12** - Cards and lists make way at the pace of the rest of Textus.
- **0.4.11** - A list dragged by its head lifts and slides along the board as Textus's own tabs do; Esc puts it back.
- **0.4.10** - A card's checkbox sits on the middle of its first line at any text size.
- **0.4.9** - Right-clicking a card or list name while you edit it (to paste) no longer ends the edit, and an input method's Enter on iPhone and iPad picks its words instead of saving. The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.4.8** - A board with Windows (CRLF) line endings keeps them, and a board changed while you edit (saved as Markdown in Textus, or by a plugin) shows that change instead of writing over it, and says so. The store description now opens with what the plugin does.
- **0.4.7** - A blank line inside a card no longer splits it, and Escape no longer leaves an empty card. The AI leaves ordinary notes alone, and the board fits narrow panels.
- **0.4.6** - The board fades at its edges where lists run past the window.
- **0.4.5** - A dragged card or list stays right under the pointer and lifts like everything dragged in Textus. Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.4** - Dragging a card or a list no longer selects text on the way.
- **0.4.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.2** - Cards and lists follow the pointer as you drag, the others making way. Needs Textus 1.3.10.
- **0.4.1** - Keeps the mark Obsidian's Kanban puts on a done list.
- **0.4.0** - Renamed Task Board (was Kanban). New boards are plain .md files with `kanban-plugin` in their front matter, as Obsidian writes them; .kanban.md boards still open.
- **0.3.1** - Textus AI tells boards apart from tasks written in documents.
- **0.3.0** - Textus AI can list and read boards, add cards and move them.
- **0.2.0** - Textus's own controls and menus.
- **0.1.0-0.1.3** - First versions: boards as Markdown, cards dragged between lists, lists moved by their head, [[links]] that open notes, Edit as Markdown, changes made elsewhere shown at once, Obsidian's settings kept.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `list_boards`: Lista os quadros Kanban (arquivos kanban-plugin .md) da pasta aberta, cada um com as suas listas e quantos cartões cada uma tem.
- `read_board`: Lê um quadro Kanban: as listas por ordem, cada uma com o texto dos cartões e se estão feitos. Tarefas escritas em documentos comuns são list_tasks.
- `add_card`: Adiciona um cartão ao fim de uma lista de um quadro Kanban. Só para um quadro (kanban-plugin .md); uma tarefa num documento é add_task.
- `move_card`: Move um cartão de um quadro Kanban para outra lista, ou para outro lugar na sua.
<!-- /ai-tools -->

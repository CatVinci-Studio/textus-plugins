# Quadro de tarefas

Organize o trabalho em cartões e listas num quadro guardado como um arquivo Markdown comum.

- **Plugins › Novo quadro de tarefas…** pede um nome e cria _nome_.md na pasta aberta, com `kanban-plugin: board` no front matter e três listas: A fazer, Fazendo e Feito. Se já existir um quadro com esse nome, ele é que abre.
- Qualquer arquivo .md com `kanban-plugin` no front matter abre como quadro. É assim que o plugin Kanban do Obsidian guarda os quadros dele, então cada app abre os quadros do outro. Quadros antigos chamados _nome_.kanban.md continuam abrindo como quadros.
- Cada lista é um título no arquivo e cada cartão uma tarefa embaixo dele, então o quadro fica legível em qualquer lugar.

## No quadro

- **Adicionar um cartão** no fim de uma lista. Clique no texto de um cartão para editá-lo, marque a caixa quando estiver feito e use o botão × para removê-lo.
- **Adicionar lista** cria uma lista nova. Clique no título de uma lista para renomeá-la; uma lista vazia pode ser removida.
- Arraste cartões dentro de uma lista ou para outra, e arraste uma lista pelo topo para mudar a ordem. Os outros abrem espaço enquanto você arrasta.
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

- **0.4.3** - Sua página agora diz numa frase o que ele faz, o que pode fazer e o que mudou em cada versão.
- **0.4.2** - Cartões e listas seguem o ponteiro ao serem arrastados, e os outros abrem espaço. Requer Textus 1.3.10.
- **0.4.1** - Mantém a marca que o Kanban do Obsidian põe numa lista de concluídos.
- **0.4.0** - Agora se chama Quadro de tarefas (antes Kanban). Os quadros novos são arquivos .md comuns com `kanban-plugin` no front matter, como o Obsidian escreve; quadros .kanban.md continuam abrindo.
- **0.3.1** - O Textus AI distingue quadros de tarefas escritas em documentos.
- **0.3.0** - O Textus AI pode listar e ler quadros, adicionar cartões e movê-los.
- **0.2.0** - Controles e menus do próprio Textus.
- **0.1.0-0.1.3** - Primeiras versões: quadros em Markdown, cartões arrastados entre listas, listas movidas pelo topo, [[links]] que abrem notas, Editar como Markdown, mudanças feitas em outro lugar mostradas na hora, ajustes do Obsidian mantidos.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `list_boards`: Lista os quadros Kanban (arquivos kanban-plugin .md) da pasta aberta, cada um com as suas listas e quantos cartões cada uma tem.
- `read_board`: Lê um quadro Kanban: as listas por ordem, cada uma com o texto dos cartões e se estão feitos. Tarefas escritas em documentos comuns são list_tasks.
- `add_card`: Adiciona um cartão ao fim de uma lista de um quadro Kanban. Só para um quadro (kanban-plugin .md); uma tarefa num documento é add_task.
- `move_card`: Move um cartão de um quadro Kanban para outra lista, ou para outro lugar na sua.
<!-- /ai-tools -->

# Kanban

Quadros de cartões em listas, guardados como um arquivo Markdown simples.

- **Plugins › Novo quadro kanban…** cria um, com o nome _nome_.kanban.md.
- Cada lista é um título no arquivo e cada cartão uma tarefa embaixo dele, então o quadro continua legível em qualquer lugar.
- Adicione um cartão no fim de uma lista; arraste os cartões entre listas e as listas para reordená-las. Um cartão marcado está concluído.
- Escreva um [[link]] num cartão e clique nele para abrir essa nota.
- **Editar como Markdown** abre o arquivo como texto; o quadro acompanha as alterações.

```markdown
## A fazer

- [ ] Escrever o roteiro

## Feito

- [x] Escolher um título
```

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `list_boards`: Lista os quadros Kanban (arquivos name.kanban.md) da pasta aberta, cada um com as suas listas e quantos cartões cada uma tem.
- `read_board`: Lê um quadro Kanban: as listas por ordem, cada uma com o texto dos cartões e se estão feitos. Tarefas escritas em documentos comuns são list_tasks.
- `add_card`: Adiciona um cartão ao fim de uma lista de um quadro Kanban. Só para um quadro (name.kanban.md); uma tarefa num documento é add_task.
- `move_card`: Move um cartão de um quadro Kanban para outra lista, ou para outro lugar na sua.
<!-- /ai-tools -->

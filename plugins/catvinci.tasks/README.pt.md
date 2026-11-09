# Tarefas

Reúne todas as tarefas da sua pasta numa lista, para marcá-las ali mesmo e consultá-las como no Obsidian Tasks.

- Escreva uma tarefa em qualquer lugar como `- [ ] algo a fazer`.
- A aba **Tarefas** da barra lateral lista as tarefas de todos os documentos da pasta aberta, por documento e sob o título em que cada uma está.
- Marque uma ali como feita, ou clique nela para ir até ela no documento.
- Dê uma data a uma tarefa (`📅 2026-11-01`, `due:2026-11-01` ou `[due:: 2026-11-01]`) e ela aparece como etiqueta. Tarefas vencidas ou que vencem em uma semana vêm primeiro, em **Vencem em breve**.
- O campo no topo filtra a lista por palavras, pelo nome do documento ou pelo título.
- As tarefas concluídas ficam ocultas, a menos que você ligue **Mostrar tarefas concluídas** em **Ajustes › Extensões › Plugins › Tarefas**.
- Os cartões de um quadro Kanban (um documento com `kanban-plugin` nas propriedades, ou `nome.kanban.md`) pertencem ao quadro e não entram na lista lateral.

## Tarefas escritas no Obsidian

As tarefas escritas com o plugin Tasks do Obsidian funcionam do mesmo jeito aqui:

- `[/]` está em andamento, e ainda aberta; `[-]` está cancelada, e concluída.
- Os campos no fim de uma tarefa (📅 vencimento, ⏳ agendada, 🛫 início, ➕ criação, ✅ feita, ❌ cancelada, uma prioridade 🔺 ⏫ 🔼 🔽 ⏬ e 🔁 uma repetição) ficam no arquivo e não aparecem na lista.
- Marcar uma tarefa escreve ✅ e o dia; desmarcar tira a data de conclusão ou de cancelamento.
- Marcar uma tarefa que se repete põe a próxima na linha de cima, com as datas avançadas. Entende repetições como `🔁 every day`, `every 2 weeks`, `every weekday`, `every weekend`, `every Monday`, `every month on the 15th`, `every month on the last`, `every year` e `… when done`.

## Consultas de tarefas

Um bloco de código `tasks` lista as tarefas que pede, uma regra por linha, como no Obsidian:

````markdown
```tasks
not done
due before next week
path includes Projects
sort by due
```
````

- **Status**: `done`, `not done` e `status.type is` (`todo`, `in_progress`, `done` ou `cancelled`).
- **Datas**: `due`, `scheduled`, `starts`, `done`, `created`, `cancelled` ou `happens` com `before`, `after`, `on`, `in`, `on or before` ou `on or after` e uma data: 2026-11-01, today, tomorrow, yesterday, ou this, next ou last com week, month ou year. Também `no due date` e `has due date` (e o mesmo para as outras datas).
- **Texto**: `path`, `folder`, `filename`, `description` ou `heading` com `includes` ou `does not include`; `tag includes`, `tag does not include`, `has tags` e `no tags`.
- **Outros**: `priority is` (também `above`, `below`, `not`), `is recurring` e `is not recurring`.
- **Ordem**: `sort by` e `group by` (status, due, scheduled, start, done, created, priority, path, folder, filename, heading ou description, com `reverse` se quiser) e `limit`. Sem `sort by`, as tarefas seguem a ordem do Obsidian Tasks: status, vencimento, prioridade, caminho.

Linhas sobre a aparência (`hide …`, `show …`) são ignoradas; qualquer outra linha que ele não entenda é citada abaixo da contagem. O bloco também lista os cartões dos quadros. Marque uma tarefa ali para marcá-la no arquivo; clique nela para ir até ela.

## Permissões

O plugin lê os documentos da pasta para achar as tarefas, e só escreve num documento para marcar ou adicionar uma tarefa. Também dá ao Textus AI as ferramentas abaixo. Funciona no computador, no iPhone e no iPad.

## Alterações

- **0.4.1** - Suas barras, listas e controles agora são os do Textus, crescem com a interface e seguem cada tema; requer Textus 1.3.12. Nova opção **Mover tarefas concluídas para o fim da lista**: uma tarefa marcada vai para depois das abertas (pede uma vez para ler e editar o documento).
- **0.4.0** - Usa as datas embutidas no Textus 1.3.10, que agora é necessário.
- **0.3.1** - Traz o código de datas compartilhado atualizado; nada mais mudou.
- **0.3.0** - Obsidian Tasks: `[/]` e `[-]`, os campos de tarefa, datas de conclusão, tarefas que se repetem e blocos de consulta `tasks`; quadros marcados com `kanban-plugin` ficam fora da lista.
- **0.2.1** - Os cartões de um quadro Kanban (`nome.kanban.md`) não são mais listados.
- **0.2.0** - O Textus AI pode listar, adicionar e marcar tarefas.
- **0.1.3** - A lista acompanha o idioma da interface quando ele muda.
- **0.1.2** - Vencimentos no horário local; contagens nas formas de plural de cada idioma.
- **0.1.0-0.1.1** - Primeiras versões: todas as tarefas da pasta numa lista lateral, para marcar ou abrir dali, com filtro, vencimentos e Vencem em breve.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `list_tasks`: Lista as tarefas Markdown (- [ ] ...) dos documentos da pasta aberta - só as pendentes, a menos que se peça outra coisa -, cada uma com o texto, o prazo, o caminho do documento e a linha. Filtra por estado, documento, tag, prazo e palavras. Sem cartões de Kanban (read_board) nem lembretes com hora (list_reminders).
- `add_task`: Adiciona uma tarefa (- [ ] ...) a um documento da pasta aberta: no fim, ou no fim da seção sob um título, com prazo se for dado. Cria o documento se ele não existir. Devolve onde ela ficou. Para algo que deve avisar num horário, use add_reminder; um cartão de quadro é add_card, uma linha de banco de dados add_row e uma linha no diário de hoje append_to_daily_note.
- `complete_task`: Marca uma tarefa como feita (- [x]) - ou, com done false, reabre-a - pelo caminho do documento e pela linha, como list_tasks os dá. Escreve a data de conclusão (✅ AAAA-MM-DD) como o Obsidian Tasks e, numa tarefa recorrente (🔁 every …), acrescenta a próxima na linha acima.
<!-- /ai-tools -->

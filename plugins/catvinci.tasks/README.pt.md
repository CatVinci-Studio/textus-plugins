# Tarefas

Todas as tarefas da sua pasta, numa só lista.

- Escreva uma tarefa em qualquer lugar como `- [ ] algo para fazer`.
- A aba **Tarefas** da barra lateral lista as tarefas de todos os documentos da pasta aberta.
- Marque uma como concluída ali, ou clique nela para ir até ela no documento.
- Mostrar ou não as tarefas concluídas está nos ajustes do plugin.
- Dê uma data a uma tarefa (`📅 2026-11-01` ou `due:2026-11-01`) e ela aparece como uma etiqueta; as tarefas vencidas ou que vencem em até uma semana ficam primeiro, em **Vencem em breve**.
- O campo no topo filtra a lista por palavras, pelo nome do documento ou pelo título dele.
- Os cartões de um quadro Kanban (um documento com `kanban-plugin` no front matter, ou `nome.kanban.md`) ficam no quadro e não são listados.

## Tarefas escritas no Obsidian

As tarefas que o plugin Tasks do Obsidian escreve funcionam do mesmo jeito aqui:

- `[/]` está em andamento e continua pendente; `[-]` foi cancelada e conta como encerrada.
- Os campos no fim de uma tarefa (📅 prazo, ⏳ agendada, 🛫 início, ➕ criada, ✅ feita, ❌ cancelada, uma prioridade 🔺 ⏫ 🔼 🔽 ⏬ e 🔁 uma repetição) ficam no arquivo e não aparecem na lista.
- Marcar uma tarefa escreve ✅ e a data do dia; desmarcá-la os tira.
- Marcar uma tarefa que se repete (`🔁 every day`, `every 2 weeks`, `every weekday`, `every Monday`, `every month on the 15th`, `every year`, `… when done`) acrescenta a próxima na linha acima, com as datas adiantadas.

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

Ele entende `not done` e `done`; `due`, `scheduled`, `starts`, `done` ou `created` com `before`, `after`, `on`, `on or before` ou `on or after` e uma data (2026-11-01, today, tomorrow, yesterday, this, next ou last week, month ou year); `no due date` e `has due date`; `path`, `filename`, `description` ou `heading` com `includes` ou `does not include`; `tag includes`; `priority is`; `is recurring`; `sort by`, `group by` (path, folder, filename, heading, due, priority, status) e `limit`. Linhas sobre a aparência (`hide …`, `show …`) são ignoradas; qualquer outra que ele não entenda é citada sob a contagem. Marque uma tarefa ali para marcá-la no arquivo; clique nela para ir até ela.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `list_tasks`: Lista as tarefas Markdown (- [ ] ...) dos documentos da pasta aberta - só as pendentes, a menos que se peça outra coisa -, cada uma com o texto, o prazo, o caminho do documento e a linha. Filtra por estado, documento, tag, prazo e palavras. Sem cartões de Kanban (read_board) nem lembretes com hora (list_reminders).
- `add_task`: Adiciona uma tarefa (- [ ] ...) a um documento da pasta aberta: no fim, ou no fim da seção sob um título, com prazo se for dado. Cria o documento se ele não existir. Devolve onde ela ficou. Para algo que deve avisar num horário, use add_reminder; um cartão de quadro é add_card, uma linha de banco de dados add_row e uma linha no diário de hoje append_to_daily_note.
- `complete_task`: Marca uma tarefa como feita (- [x]) - ou, com done false, reabre-a - pelo caminho do documento e pela linha, como list_tasks os dá. Escreve a data de conclusão (✅ AAAA-MM-DD) como o Obsidian Tasks e, numa tarefa recorrente (🔁 every …), acrescenta a próxima na linha acima.
<!-- /ai-tools -->

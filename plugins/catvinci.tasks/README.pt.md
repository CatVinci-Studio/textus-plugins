# Tarefas

Reúne todas as tarefas da sua pasta numa lista, para marcá-las ali mesmo e consultá-las como no Obsidian Tasks.

- Escreva uma tarefa em qualquer lugar como `- [ ] algo a fazer`.
- A aba **Tarefas** da barra lateral lista as tarefas de todos os documentos da pasta aberta, por documento e sob o título em que cada uma está.
- Marque uma ali como feita, ou clique nela para ir até ela no documento.
- Dê uma data a uma tarefa (`📅 2026-11-01`, `due:2026-11-01` ou `[due:: 2026-11-01]`) e ela aparece como etiqueta. Tarefas vencidas ou que vencem em uma semana vêm primeiro, em **Vencem em breve**.
- O campo no topo filtra a lista por palavras, pelo nome do documento ou pelo título.
- As tarefas concluídas ficam ocultas, a menos que você ligue **Mostrar tarefas concluídas** em **Ajustes › Extensões › Plugins › Tarefas**.
- Os cartões de um quadro Kanban (um documento com `kanban-plugin` nas propriedades, ou `nome.kanban.md`) pertencem ao quadro e não entram na lista lateral nem nas consultas de tarefas.

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

Linhas sobre a aparência (`hide …`, `show …`) são ignoradas; qualquer outra linha que ele não entenda é citada abaixo da contagem. Um [[link]] numa tarefa abre a nota dele. Marque uma tarefa ali para marcá-la no arquivo; clique nela para ir até ela.

## Permissões

O plugin lê os documentos da pasta para achar as tarefas, e só escreve num documento para marcar ou adicionar uma tarefa. Também dá ao Textus AI as ferramentas abaixo. Funciona no computador, no iPhone e no iPad.

## Alterações

- **0.5.0** - A task query no longer lists a Kanban board's cards, as the sidebar and Textus AI already didn't. Grouped by document, its rows don't repeat the document's name, and a [[link]] in a task opens its note.
- **0.4.7** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.4.6** - The tasks block keeps a gap inside its frame, as other blocks do.
- **0.4.5** - The AI's new task under a heading never lands inside a code block, and **Move finished tasks to the end of their list** works in Windows (CRLF) notes.
- **0.4.4** - A task query in a document draws at the interface's text size, so a wider column shows more of it rather than larger text (Textus 1.4.1).
- **0.4.3** - Ticking a task with an HTML comment in it now works, and a refused tick tells you why. `group by status` sorts in the right order, task blocks fit narrow panes, due dates look like the sidebar's, and typing stays lighter.
- **0.4.2** - Shorter help and empty-state text.
- **0.4.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12. A new setting, **Move finished tasks to the end of their list**: a task ticked in a document or in the list goes after the open ones (it asks once to read and edit the document in front).
- **0.4.0** - Uses the dates built into Textus 1.3.10, which it now needs.
- **0.3.1** - Ships the updated shared date code; nothing else changed.
- **0.3.0** - Obsidian Tasks: `[/]` and `[-]`, the task fields, done dates, repeating tasks and `tasks` query blocks; boards marked with `kanban-plugin` are left out of the list.
- **0.2.1** - Cards on a Kanban board (`name.kanban.md`) are no longer listed.
- **0.2.0** - Textus AI can list, add and tick off tasks.
- **0.1.3** - The list follows the interface language when it changes.
- **0.1.2** - Due dates in local time; counts in each language's plural forms.
- **0.1.0-0.1.1** - First versions: every task in the folder in a sidebar list, ticked off or opened from there, with a filter, due dates and Due soon.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `list_tasks`: Lista as tarefas Markdown (- [ ] ...) dos documentos da pasta aberta - só as pendentes, a menos que se peça outra coisa -, cada uma com o texto, o prazo, o caminho do documento e a linha. Filtra por estado, documento, tag, prazo e palavras. Sem cartões de Kanban (read_board) nem lembretes com hora (list_reminders).
- `add_task`: Adiciona uma tarefa (- [ ] ...) a um documento da pasta aberta: no fim, ou no fim da seção sob um título, com prazo se for dado. Cria o documento se ele não existir. Devolve onde ela ficou. Para algo que deve avisar num horário, use add_reminder; um cartão de quadro é add_card, uma linha de banco de dados add_row e uma linha no diário de hoje append_to_daily_note.
- `complete_task`: Marca uma tarefa como feita (- [x]) - ou, com done false, reabre-a - pelo caminho do documento e pela linha, como list_tasks os dá. Escreve a data de conclusão (✅ AAAA-MM-DD) como o Obsidian Tasks e, numa tarefa recorrente (🔁 every …), acrescenta a próxima na linha acima.
<!-- /ai-tools -->

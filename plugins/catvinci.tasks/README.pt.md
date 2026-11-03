# Tarefas

Todas as tarefas da sua pasta, numa só lista.

- Escreva uma tarefa em qualquer lugar como `- [ ] algo para fazer`.
- A aba **Tarefas** da barra lateral lista as tarefas de todos os documentos da pasta aberta.
- Marque uma como concluída ali, ou clique nela para ir até ela no documento.
- Mostrar ou não as tarefas concluídas está nos ajustes do plugin.
- Dê uma data a uma tarefa (`📅 2026-11-01` ou `due:2026-11-01`) e ela aparece como uma etiqueta; as tarefas vencidas ou que vencem em até uma semana ficam primeiro, em **Vencem em breve**.
- O campo no topo filtra a lista por palavras, pelo nome do documento ou pelo título dele.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `list_tasks`: Lista as tarefas Markdown (- [ ] ...) dos documentos da pasta aberta - só as pendentes, a menos que se peça outra coisa -, cada uma com o texto, o prazo, o caminho do documento e a linha. Filtra por estado, documento, tag, prazo e palavras.
- `add_task`: Adiciona uma tarefa (- [ ] ...) a um documento da pasta aberta: no fim, ou no fim da seção sob um título, com prazo se for dado. Cria o documento se ele não existir. Devolve onde ela ficou.
- `complete_task`: Marca uma tarefa como feita (- [x]) - ou, com done false, reabre-a - pelo caminho do documento e pela linha, como list_tasks os dá.
<!-- /ai-tools -->

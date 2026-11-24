# Lembretes

Lembra você de uma linha na hora que você escreve nela, como `(@2026-11-02 09:00)`, com uma notificação do sistema.

Escreva a marca em qualquer linha - uma tarefa, um título, qualquer linha. Nessa hora, uma notificação mostra o texto da linha e o documento dela; clique nela e a linha se abre.

- `(@2026-11-02)` sozinho lembra você às nove da manhã desse dia.
- **Plugins › Lembrar-me…**, ou **Lembrar-me…** no menu de barra, coloca a marca no cursor para você: daqui a uma hora, hoje às 20h, amanhã às 9h, segunda que vem às 9h, ou uma data e hora que você digitar.
- Uma tarefa marcada (`- [x] …`) está feita: sem lembrete.
- A aba **Lembretes** da barra lateral lista os próximos, o mais próximo primeiro; clique num para abrir a linha dele.
- O próprio Textus guarda os lembretes: eles chegam enquanto houver uma janela aberta, e com todas as janelas fechadas quando **Continuar em segundo plano** está ligado (**Ajustes › Geral**). Um lembrete perdido enquanto o Textus estava fechado chega quando ele abrir de novo.

As marcas são escritas como o plugin Reminder do Obsidian as escreve, então as mesmas notas lembram você lá também.

Precisa do Textus 1.4.3 ou mais recente. Pede para ler os arquivos da pasta aberta, para encontrar as marcas; para escrever no editor, para colocar uma marca; para mostrar notificações; e para dar ao Textus AI as duas ferramentas abaixo.

## Alterações

- **0.3.6** - Its page is in every language Textus speaks. It names the Textus it needs, 1.4.3.
- **0.3.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.3.4** - Opening a folder reads only the documents Textus finds a reminder mark in, not every document.
- **0.3.3** - The store description now opens with what the plugin does.
- **0.3.2** - Two open windows no longer clear each other's reminders, and the list empties when you close the folder. A mistyped time is refused instead of inserting a broken mark.
- **0.3.1** - Shorter help and empty-state text.
- **0.3.0** - Marks written with Textus's own dates; needs Textus 1.3.10.
- **0.2.2-0.2.3** - Updated shared date code.
- **0.2.1** - Textus AI is told when a due date belongs in Tasks instead.
- **0.2.0** - Textus AI can list the coming reminders and add one.
- **0.1.1** - Desktop only, since it runs in the background.
- **0.1.0** - First version: `(@date time)` marks as notifications Textus keeps, even in the background; Remind Me… and the sidebar list.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `list_reminders`: Lista os próximos lembretes - marcas (@2026-11-02 09:00) nos documentos da pasta aberta -, o mais próximo primeiro, cada um com a hora, o texto, o caminho do documento e a linha. Tarefas por prazo são list_tasks.
- `add_reminder`: Adiciona um lembrete como linha de tarefa com a hora, - [ ] texto (@2026-11-02 09:00), no fim do documento em primeiro plano; nessa hora chega uma notificação. Use quando o usuário quiser ser avisado num horário; uma tarefa só com prazo é add_task.
<!-- /ai-tools -->

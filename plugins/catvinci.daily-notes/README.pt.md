# Calendário e notas diárias

Guarda uma nota para cada dia numa pasta da pasta aberta, com um calendário na barra lateral para chegar a qualquer uma delas.

- Prima **Ctrl+Alt+J** (**⌘⌥J** no Mac) ou escolha **Plugins › Abrir a nota de hoje**. A nota de hoje abre-se; da primeira vez, é criada.
- **Plugins › Abrir o dia anterior** e **Plugins › Abrir o dia seguinte** passam da nota do dia aberta para a vizinha.
- A aba **Calendário** da barra lateral mostra um mês e marca os dias com nota. Clique num dia para abrir a nota dele, ou em **Hoje** para abrir a de hoje. A semana começa como na sua região.
- Uma nota que já existe nunca é substituída.

## Ajustes

- **Pasta das notas diárias**: uma pasta dentro da pasta aberta, `Daily` por omissão.
- **A nota de um novo dia**: o texto com que começa uma nota nova, `# {{date}}` por omissão. Aceita `{{date}}`, `{{weekday}}`, `{{yesterday}}` e `{{tomorrow}}` (para ligações como `[[{{yesterday}}]]`), `{{time}}`, `{{title}}`, `{{date:FORMATO}}` e `{{date+1d}}`; `\n` começa uma linha nova. Também pode ser o nome de um modelo da pasta Templates, como `Daily`.
- **Notas semanais** e **Notas mensais**: desligadas por omissão. Depois de ligadas, **Plugins › Abrir a nota desta semana** e **Abrir a nota deste mês** abrem-nas, tal como os números das semanas e o nome do mês no calendário. Cada uma tem a sua pasta (`Weekly`, `Monthly`), o seu formato de nome (`gggg-[W]ww` dá `2026-W45`, `YYYY-MM` dá `2026-11`) e o seu modelo. Um modelo semanal aceita `{{monday:YYYY-MM-DD}}` … `{{sunday}}` para os dias da semana.

## Cofres do Obsidian

Num cofre do Obsidian valem os ajustes de notas diárias do próprio cofre: pasta, formato do nome (como `YYYY/MM/YYYY-MM-DD` ou `MMMM Do, YYYY`) e modelo. O Textus nunca os altera. Um cofre sem esses ajustes guarda as notas na raiz, como o Obsidian. `{{date}}`, `{{yesterday}}` e `{{tomorrow}}` são escritos no formato de nome das notas. Num cofre com o plugin Periodic Notes, valem os ajustes semanais e mensais dele.

## Permissões

O plugin lê e escreve ficheiros na pasta aberta para encontrar e criar as notas, e lê qual documento está aberto para saber o dia anterior e o seguinte. Também dá ao Textus AI as duas ferramentas abaixo. Funciona no computador e no iPhone e precisa do Textus 1.3.10 ou mais recente.

## Alterações

- **0.7.4** - Num painel estreito, como no celular, o calendário mostra o nome curto do mês em vez de cortar o longo.
- **0.7.3** - Datas impossíveis como 30 de fevereiro são recusadas, o calendário mantém uma largura confortável em painéis largos e é redesenhado quando as configurações de pastas mudam, e as configurações semanais e mensais só aparecem quando essas notas estão ativadas.
- **0.7.2** - Textos de ajuda e de estado vazio mais curtos.
- **0.7.1** - Suas barras, listas e controles agora são os do Textus, crescem com a interface e seguem cada tema; requer Textus 1.3.12.
- **0.7.0** - As datas e os modelos são preenchidos pelo próprio Textus, tal como no plugin Modelos; precisa do Textus 1.3.10.
- **0.6.0** - Notas semanais e mensais, com ajustes próprios, os números das semanas e o nome do mês no calendário, e os ajustes do Periodic Notes de um cofre.
- **0.5.0** - Um cofre sem ajustes de notas diárias guarda-as na raiz; `{{date}}`, `{{yesterday}}` e `{{tomorrow}}` seguem o formato de nome, incluindo `MMMM Do, YYYY`.
- **0.4.0** - Segue os ajustes de notas diárias de um cofre do Obsidian; o texto inicial pode nomear um modelo da pasta Templates; `{{date:FORMATO}}` e `{{title}}`.
- **0.3.0** - O Textus AI pode ler a nota de um dia e acrescentar-lhe texto.
- **0.2.0** - O calendário usa os controlos do Textus e segue a língua da interface quando ela muda; precisa do Textus 1.3.2.
- **0.1.3** - Cores e tipografia do Textus 1.3.
- **0.1.2** - A semana começa como na sua região; a nota de um dia nunca é substituída.
- **0.1.0-0.1.1** - Primeiras versões: a nota de hoje por atalho, o calendário, o dia anterior e o seguinte, `{{weekday}}`, `{{yesterday}}`, `{{tomorrow}}` e `{{time}}` no modelo.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `read_daily_note`: Lê a nota diária de um dia - a de hoje se não houver data - da pasta de notas diárias: o caminho, se existe e o texto.
- `append_to_daily_note`: Acrescenta Markdown ao fim da nota diária de um dia - a de hoje se não houver data -, criando-a antes a partir do modelo se não existir. Uma nota para guardar na barra lateral é add_note; uma tarefa com data, add_task.
<!-- /ai-tools -->

# Calendário e notas diárias

Guarda uma nota para cada dia numa pasta da pasta aberta, com um calendário na barra lateral para chegar a qualquer uma delas.

- Prima **Ctrl+Alt+J** (**⌘⌥J** no Mac) ou escolha **Plugins › Abrir a nota de hoje**. A nota de hoje abre-se; da primeira vez, é criada.
- **Plugins › Abrir o dia anterior** e **Plugins › Abrir o dia seguinte** passam da nota do dia aberta para a vizinha.
- A aba **Calendário** da barra lateral mostra um mês e marca os dias com nota. Clique num dia para abrir a nota dele, ou em **Hoje** para abrir a de hoje. A semana começa como no idioma do Textus, como contam os números da semana.
- Uma nota que já existe nunca é substituída.

## Ajustes

- **Pasta das notas diárias**: uma pasta dentro da pasta aberta, `Daily` por omissão.
- **A nota de um novo dia**: o texto com que começa uma nota nova, `# {{date}}` por omissão. Aceita `{{date}}`, `{{weekday}}`, `{{yesterday}}` e `{{tomorrow}}` (para ligações como `[[{{yesterday}}]]`), `{{time}}`, `{{title}}`, `{{date:FORMATO}}` e `{{date+1d}}`; `\n` começa uma linha nova. Também pode ser o nome de um modelo da pasta Templates, como `Daily`.
- **Notas semanais** e **Notas mensais**: desligadas por omissão. Depois de ligadas, **Plugins › Abrir a nota desta semana** e **Abrir a nota deste mês** abrem-nas, tal como os números das semanas e o nome do mês no calendário. Cada uma tem a sua pasta (`Weekly`, `Monthly`), o seu formato de nome (`gggg-[W]ww` dá `2026-W45`, `YYYY-MM` dá `2026-11`) e o seu modelo. Um modelo semanal aceita `{{monday:YYYY-MM-DD}}` … `{{sunday}}` para os dias da semana.

## Cofres do Obsidian

Num cofre do Obsidian valem os ajustes de notas diárias do próprio cofre: pasta, formato do nome (como `YYYY/MM/YYYY-MM-DD` ou `MMMM Do, YYYY`) e modelo. O Textus nunca os altera. Um cofre sem esses ajustes guarda as notas na raiz, como o Obsidian. `{{date}}`, `{{yesterday}}` e `{{tomorrow}}` são escritos no formato de nome das notas. Num cofre com o plugin Periodic Notes, valem os ajustes semanais e mensais dele.

## Permissões

O plugin lê e escreve ficheiros na pasta aberta para encontrar e criar as notas, e lê qual documento está aberto para saber o dia anterior e o seguinte. Também dá ao Textus AI as duas ferramentas abaixo. Precisa do Textus 1.4.3 ou mais recente.

## Alterações

- **0.7.9** - Its page no longer says which devices it runs on: the store shows that. It names the Textus it needs, 1.4.3. Its page receives Textus's messages by the API's current name.
- **0.7.8** - Where the bar is too narrow for even the short month name (a phone's sidebar), the month goes on a row of its own above the buttons instead of losing its year. The calendar writes dates with Textus's own, so the package is smaller.
- **0.7.7** - Weeks start as Textus's language has them, not the device's region, so they agree with the week numbers.
- **0.7.6** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.7.5** - The Calendar's month title starts at the left and ends in an ellipsis in a narrow sidebar, instead of being cut at both ends.
- **0.7.4** - In a narrow panel, such as on a phone, the calendar shows the month's short name instead of cutting the long one off.
- **0.7.3** - Impossible dates such as February 30 are refused, the calendar stays a comfortable width in wide panels and redraws when folder settings change, and weekly and monthly settings show only when those notes are on.
- **0.7.2** - Shorter help and empty-state text.
- **0.7.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.7.0** - Dates and templates are filled in by Textus itself, the same way as in the Templates plugin; needs Textus 1.3.10.
- **0.6.0** - Weekly and monthly notes, with their own settings, the calendar's week numbers and month name, and a vault's Periodic Notes settings.
- **0.5.0** - A vault without daily notes settings keeps its notes at its top; `{{date}}`, `{{yesterday}}` and `{{tomorrow}}` follow the notes' name format, `MMMM Do, YYYY` included.
- **0.4.0** - Follows an Obsidian vault's daily notes settings; the starting text can name a template in the Templates folder; `{{date:FORMAT}}` and `{{title}}`.
- **0.3.0** - Textus AI can read a day's note and add to it.
- **0.2.0** - The calendar uses Textus's own controls and follows the interface language when it changes; needs Textus 1.3.2.
- **0.1.3** - Textus 1.3's colors and type.
- **0.1.2** - Weeks start as your region has them; a day's note is never written over.
- **0.1.0-0.1.1** - First versions: today's note with a shortcut, the calendar, the day before and after, `{{weekday}}`, `{{yesterday}}`, `{{tomorrow}}` and `{{time}}` in the template.

<!-- ai-tools -->
## Ferramentas para o Textus AI

Com o plugin instalado, o Textus AI pode usá-las numa conversa:

- `read_daily_note`: Lê a nota diária de um dia - a de hoje se não houver data - da pasta de notas diárias: o caminho, se existe e o texto.
- `append_to_daily_note`: Acrescenta Markdown ao fim da nota diária de um dia - a de hoje se não houver data -, criando-a antes a partir do modelo se não existir. Uma nota para guardar na barra lateral é add_note; uma tarefa com data, add_task.
<!-- /ai-tools -->

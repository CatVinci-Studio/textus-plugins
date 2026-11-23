# Календарь и ежедневные заметки

Хранит заметку на каждый день в папке внутри открытой папки, а календарь на боковой панели ведёт к любой из них.

- Нажмите **Ctrl+Alt+J** (**⌘⌥J** на Mac) или выберите **Плагины › Открыть заметку на сегодня**. Откроется сегодняшняя заметка; в первый раз она создаётся.
- **Плагины › Открыть предыдущий день** и **Плагины › Открыть следующий день** переходят от открытой заметки дня к соседней.
- Вкладка **Календарь** на боковой панели показывает месяц и отмечает дни с заметкой. Нажмите на день, чтобы открыть его заметку, или на **Сегодня**, чтобы открыть сегодняшнюю. Неделя начинается так, как принято в языке Textus, как и считаются номера недель.
- Уже существующая заметка никогда не перезаписывается.

## Настройки

- **Папка ежедневных заметок**: папка внутри открытой папки, по умолчанию `Daily`.
- **Заметка нового дня**: текст, с которого начинается новая заметка, по умолчанию `# {{date}}`. В нём можно писать `{{date}}`, `{{weekday}}`, `{{yesterday}}` и `{{tomorrow}}` (для ссылок вроде `[[{{yesterday}}]]`), `{{time}}`, `{{title}}`, `{{date:ФОРМАТ}}` и `{{date+1d}}`; `\n` начинает новую строку. Можно указать и имя шаблона из папки Templates, например `Daily`.
- **Еженедельные заметки** и **Ежемесячные заметки**: по умолчанию выключены. Когда они включены, их открывают **Плагины › Открыть заметку этой недели** и **Открыть заметку этого месяца**, а также номера недель и название месяца в календаре. У каждой своя папка (`Weekly`, `Monthly`), формат имени (`gggg-[W]ww` даёт `2026-W45`, `YYYY-MM` даёт `2026-11`) и шаблон. В шаблоне недели можно писать `{{monday:YYYY-MM-DD}}` … `{{sunday}}` для дней недели.

## Хранилища Obsidian

В хранилище Obsidian действуют его собственные настройки ежедневных заметок: папка, формат имени (например, `YYYY/MM/YYYY-MM-DD` или `MMMM Do, YYYY`) и шаблон. Textus их не меняет. Хранилище без таких настроек держит заметки в корне, как Obsidian. `{{date}}`, `{{yesterday}}` и `{{tomorrow}}` пишутся в формате имени заметок. В хранилище с плагином Periodic Notes недельные и месячные заметки следуют его настройкам.

## Разрешения

Плагин читает и записывает файлы в открытой папке, чтобы находить и создавать заметки, и читает, какой документ сейчас открыт, чтобы знать предыдущий и следующий день. Ещё он даёт Textus AI два инструмента, перечисленные ниже. Нужен Textus 1.4.3 или новее.

## Изменения

- **0.7.9** - Its page no longer says which devices it runs on: the store shows that. It names the Textus it needs, 1.4.3.
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
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `read_daily_note`: Читает ежедневную заметку за день - сегодняшнюю, если дата не указана - из папки ежедневных заметок: её путь, существует ли она и её текст.
- `append_to_daily_note`: Дописывает Markdown в конец ежедневной заметки за день - сегодняшней, если дата не указана, - сначала создавая её по шаблону, если её нет. Заметка на потом в боковой панели — add_note; задача с датой — add_task.
<!-- /ai-tools -->

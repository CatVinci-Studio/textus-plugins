# Zotero

Цитируйте из библиотеки Zotero прямо во время письма.

## Перед началом

На том же компьютере должен быть запущен Zotero 7 или новее (подходит и Zotero 10), а в нём включено «**Настройки › Дополнительно › Разрешить другим приложениям на этом компьютере обмениваться данными с Zotero**». Плагин общается только с Zotero на вашем компьютере; ничего не уходит наружу.

## Цитирование

- Нажмите **Ctrl+Alt+R** (**⌘⌥R** на Mac), выберите **Вставить цитату из Zotero…** в контекстном меню или **Плагины › Вставить цитату из Zotero…**. Сначала идут недавно процитированные работы, затем поиск по библиотеке.
- Если выделены слова, ищутся они.
- Выберите запись — цитата встанет на место курсора.
- Задержите указатель на цитате или на ссылке на запись Zotero, чтобы увидеть авторов, год, где вышла работа, и начало аннотации.
- **Плагины › Вставить список литературы** добавляет в конец раздел **Литература** со всеми работами, которые цитирует документ, по первому автору и году. При повторном запуске список заменяется, а не добавляется второй раз.

## Как записывается цитата

Выберите в настройках плагина, в пункте **Цитата записывается как**:

- **Ключ Pandoc: [@key]** (по умолчанию). При экспорте через Pandoc такие ключи превращаются в оформленные ссылки, если в **Настройки › Редактор и оформление › Экспорт** выбран файл библиографии (.bib).
- **Автор и год: (Автор, 2024)**.
- **Ссылка на заметку Obsidian: [[@key]]** — на заметку о литературе для этой записи. Если заметки ещё нет, плагин предложит её создать.
- **Ссылка, открывающая Zotero**.

Ключ цитаты берётся из поля Citation Key записи (или из строки `Citation Key:` в Extra, как её пишет Better BibTeX).

## Заметки о литературе

- **Плагины › Новая заметка о литературе из Zotero…** создаёт `@citekey.md` (или открывает, если она есть) с названием, авторами, годом, аннотацией, DOI или URL записи, а также её выделениями и заметками из Zotero.
- Заметки создаются в папке **References** внутри открытой папки; изменить это можно в **Папка заметок о литературе**.
- **Шаблон заметки о литературе** может указывать на файл Markdown в папке, например `Templates/Literature.md`, с `{{title}}`, `{{authors}}`, `{{year}}`, `{{abstract}}`, `{{citekey}}`, `{{DOI}}`, `{{URL}}`, `{{highlights}}`, `{{notes}}` и `{{date:YYYY-MM-DD}}`. Если поле пустое, создаётся простая заметка с front matter.
- В хранилище Obsidian используются папка и шаблон из плагинов Zotero Integration или Citations. Шаблон для другого языка шаблонов заменяется простой заметкой.

## Разрешения

- **Сеть, только localhost:23119**: чтобы обращаться к локальному API Zotero на этом компьютере.
- **Чтение и правка документа**: чтобы вставлять цитаты и список литературы и искать по выделенным словам.
- **Чтение и запись файлов в открытой папке**: чтобы читать шаблоны и настройки Zotero в хранилище и создавать заметки о литературе.
- **Инструменты для Textus AI**: чтобы Textus AI мог искать в вашей библиотеке.

## Изменения

- **0.4.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.4.4** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller. Needs Textus 1.4.3.
- **0.4.3** - A citation now replaces the selected words; the References list no longer says Zotero is unreachable when it answers, and hover previews show up more reliably.
- **0.4.2** - Shorter help and empty-state text.
- **0.4.1** - Its code is split into smaller files by what each part does; nothing changes in use.
- **0.4.0** - literature note templates are filled by Textus's own template engine; needs Textus 1.3.10
- **0.3.0** - literature notes from Zotero, with a template and an Obsidian vault's settings; citations as `[[@citekey]]`
- **0.2.1** - the shortcut moves from Ctrl+Alt+C to Ctrl+Alt+R
- **0.2.0** - a tool for Textus AI, `search_library`
- **0.1.3** - listed for the desktop only
- **0.1.2** - works with Zotero 10's local API; the references list is replaced when made again, and code is never read for citations
- **0.1.0-0.1.1** - first versions: citing with recent works first, hover cards for citations, the references list, four citation styles

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `search_library`: Ищет в библиотеке Zotero пользователя на этом компьютере (должен быть запущен Zotero 7 или новее): ключ, название, авторов, год, тип, источник и ключ цитирования каждой записи, а также ссылку для вставки в выбранном стиле. Если до Zotero не достучаться, сообщает, что сделать.
<!-- /ai-tools -->

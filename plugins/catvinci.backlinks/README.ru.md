# Двусторонние ссылки

Ссылайтесь на заметки, заголовки и блоки, набирая `[[`, встраивайте их через `![[` и смотрите на боковой панели, что ссылается на открытый документ.

Ссылки вида `[[Заметка]]` встроены в Textus: их можно писать и открывать без плагина. Этот плагин помогает их писать, показывает на месте то, на что они указывают, и собирает ссылки вокруг документа, который вы читаете. Работает на компьютере и в iOS.

## Ссылки по ходу набора

- Наберите `[[` и выберите заметку в открывшейся панели — по имени файла, первому заголовку или записи `aliases` во front matter. Псевдоним пишется как `[[Заметка|псевдоним]]`.
- После `#` — заголовки заметки: `[[Заметка#Заголовок]]`. `[[#` показывает заголовки самого документа.
- После `#^` — её блоки: абзацы, пункты списков, таблицы, цитаты. Блок без id получает его в конце, в той заметке (`^1a2b3c`), как это делает Obsidian.
- Выделите несколько слов и наберите `[[`, чтобы сделать из них ссылку.
- Ссылки пишутся так, как принято в папке: по её собственному выбору или по формату ссылок хранилища Obsidian; иначе так, как заметка уже ссылается; иначе обычной ссылкой `[Nov 8](Week45/Nov%208.md)`, которая открывается в любом приложении. [[Ссылка]], которой нужен путь, показывает имя заметки.

## Встраивание

- `![[Заметка]]` показывает заметку на месте, `![[Заметка#Заголовок]]` — этот раздел, `![[Заметка#^id]]` — этот блок. Встроенное доступно только для чтения и обновляется, когда меняется заметка.
- Поставьте курсор на строку, чтобы править саму ссылку.

## Ссылки на боковой панели

Вкладка **Двусторонние ссылки** на боковой панели показывает, что ссылается на открытый документ и куда ссылается он сам.

- **Упоминания со ссылкой**: строки других заметок, которые ссылаются сюда через [[вики-ссылки]] или ссылки на этот файл. Щелчок переносит туда.
- **Упоминания без ссылки**: строки, где эта заметка названа (по имени файла, первому заголовку или `aliases`), но без ссылки. Щёлкните правой кнопкой и выберите **Сделать ссылкой**. Если в строке псевдоним, он останется текстом ссылки.
- **Исходящие ссылки**: заметки, на которые ссылается эта, включая ещё не созданные.
- Поле сверху фильтрует список.

## Обычные ссылки или [[вики-ссылки]]

- **Плагины › Новые ссылки: обычные или [[вики]]…** выбирает, как писать новые ссылки в открытой папке. Выбор хранится в `.textus/settings.json` папки, и Textus и другие плагины следуют ему.
- **Плагины › Превратить ссылки в обычные…** и **Превратить ссылки в [[вики-ссылки]]…** переписывают ссылки документа на переднем плане или всех заметок папки. Сначала они говорят, сколько ссылок изменится; каждая ведёт туда же, куда и раньше. Код, front matter и ссылка, чья заметка не найдена, остаются как есть; картинки и другие файлы остаются обычными ссылками.

## Разрешения

- **Чтение и правка документа**: чтобы дополнять ссылки при наборе и превращать выделение в ссылку.
- **Чтение и запись файлов в открытой папке**: чтобы находить ссылки и упоминания, добавлять ссылку к упоминанию и давать блоку его `^id`.
- **Инструменты для Textus AI**: чтобы Textus AI мог перечислить ссылки документа.

## Изменения

- **0.4.8** - Its page no longer says which devices it runs on: the store shows that.
- **0.4.7** - Code kept for Textus versions it no longer runs on is gone.
- **0.4.6** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.4.5** - Unlinked mentions open on the right line, and Link Style is set by Textus itself (Textus 1.4.3).
- **0.4.4** - The Convert Links commands leave links inside a code block alone and convert the ones after it, and Unlinked mentions no longer lists or links names in front matter or code.
- **0.4.3** - Standard links to notes that don't exist yet now show under Outgoing links, a note's links to its own headings no longer list the note itself, and dragging a divider no longer redraws the panel.
- **0.4.2** - Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.4.1** - In a note with no links yet, [[ writes a standard link: the [[ being typed was taken for a wiki link the note already had.
- **0.4.0** - New Links: Standard or [[Wiki]]… chooses how the folder writes new links, and Convert Links turns a note's or the whole folder's links from one way into the other; [[ writes the folder's way, a standard link where nothing says otherwise.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - `[[` completion for notes, headings and blocks; `![[` embeds; renamed from Backlinks to Two-way Links
- **0.2.1** - the description says "two-way links", so a store search finds it
- **0.2.0** - a tool for Textus AI, `list_backlinks`
- **0.1.0-0.1.1** - first versions: linked and unlinked mentions with **Link**, outgoing links and a filter; suggested for documents with wiki links

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `list_backlinks`: Для документа - переднего, если путь не указан, - перечисляет заметки со ссылками на него (путь, строка, текст строки), строки, где он назван без ссылки, и заметки, на которые он ссылается.
<!-- /ai-tools -->

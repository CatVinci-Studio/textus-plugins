# Закладки

Отметьте фрагмент закладкой и возвращайтесь к нему из боковой панели, в любом документе.

Выделите слова и выберите **Добавить выделение в закладки**: правым щелчком по выделению или через **Плагины › Добавить выделение в закладки**. Сначала сохраните документ: закладка указывает на его файл.

Вкладка **Закладки** в боковой панели показывает их по документам. Щелчок открывает документ на этих словах. Чтобы удалить закладку, щёлкните по ней правой кнопкой и выберите **Удалить закладку**. Если документ переименовать или переместить, закладки последуют за ним.

## Хранилища Obsidian

Когда открытая папка — хранилище Obsidian (в ней есть папка `.obsidian`):

- Собственные закладки Obsidian из `.obsidian/bookmarks.json` тоже видны во вкладке, в разделе **Закладки Obsidian**, с группами Obsidian. Показываются закладки на заметки, заголовки и блоки; поиски, папки и прочее — нет.

## Разрешения

- Чтение документа: чтобы прочитать выделение.
- Чтение файлов: для `bookmarks.json` Obsidian.
- Инструменты для Textus AI: чтобы Textus AI мог показать ваши закладки.

## Изменения

- **0.4.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.4.4** - Obsidian's bookmarks are listed as before but no longer written: Textus 1.4 keeps plugins out of `.obsidian`. Needs Textus 1.4.0.
- **0.4.3** - Rows are grouped by the document's path in the folder, one group per document; long passages end at a word with "…"; a failed block-id edit in a vault keeps the bookmark.
- **0.4.2** - Shorter help and empty-state text.
- **0.4.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.0** - In an Obsidian vault, new bookmarks are written to Obsidian's `bookmarks.json` too, and removed and renamed there.
- **0.3.0** - Lists the vault's own Obsidian bookmarks of notes, headings and blocks.
- **0.2.1** - Paths handled by code shared with other plugins; nothing changes in use.
- **0.2.0** - Textus AI can list your bookmarks (`list_bookmarks`).
- **0.1.0-0.1.2** - First versions: bookmark a selection, the sidebar list by document, bookmarks that follow renames; store page and icon; runs on desktop and iOS.

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `list_bookmarks`: Перечисляет закладки пользователя: отмеченные слова в каждом документе с путём документа в открытой папке.
<!-- /ai-tools -->

# Теги

Показывает на боковой панели все `#tag` открытой папки и сколько заметок использует каждый.

- Вкладка **Теги** показывает теги, самые частые первыми. Вложенные теги (`#project/alpha`) образуют дерево, как в Obsidian, а число у тега включает заметки вложенных в него тегов. Введите текст в поле фильтра, чтобы сузить список.
- Откройте тег, чтобы увидеть его заметки, и щёлкните по заметке, чтобы её открыть.
- Щёлкните по тегу правой кнопкой и выберите **Переименовать…**, чтобы переименовать его во всех заметках вместе с вложенными тегами (`#project/alpha` становится `#new/alpha`). Регистр букв в тегах не важен. Если дать тегу имя уже существующего, два тега станут одним. Тег состоит из букв, цифр, `_`, `-` и `/`, и не только из цифр.
- Теги во front matter (`tags: [a, b]` или список под `tags:`) тоже переименовываются. Код, встроенный код, адреса ссылок и более длинные теги с тем же началом (`#drafts`, когда вы переименовываете `#draft`) не трогаются.

## Разрешения

- Чтение файлов: чтобы находить теги в папке.
- Запись файлов: чтобы переименовывать тег в заметках, где он есть.
- Инструменты для Textus AI: чтобы Textus AI мог перечислить ваши теги и заметки с нужным тегом.

## Изменения

- **0.3.7** - Its page is in every language Textus speaks.
- **0.3.6** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller.
- **0.3.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.3.4** - Renaming leaves `[[#Heading]]` links alone, and a ``` line inside a `~~~` block no longer ends the code.
- **0.3.3** - Tags match in any letter case, as their counts do; renaming a tag moves its nested tags too and no longer touches link addresses or front-matter tags like `project-x`; tags like `a/` or `a//b` are refused.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - Tags used equally often are listed in natural name order ("Week2" before "Week10").
- **0.3.0** - Nested tags form a tree, each counting the notes of the tags under it; Textus AI finds a tag's nested tags too.
- **0.2.0** - Textus AI can list your tags and the notes with a tag (`list_tags`, `notes_with_tag`).
- **0.1.0-0.1.1** - First versions: tags with their counts, a tag's notes, renaming and merging in every note; runs on desktop and iOS.

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `list_tags`: Перечисляет все #теги в документах открытой папки с числом документов, где каждый встречается, начиная с самых частых.
- `notes_with_tag`: Перечисляет документы открытой папки с #тегом, каждый с заголовком, путём и тегами.
<!-- /ai-tools -->

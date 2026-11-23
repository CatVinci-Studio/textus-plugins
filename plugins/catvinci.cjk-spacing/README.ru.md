# Пробелы CJK

Ставит пробел между китайским или японским текстом и латиницей или цифрами.

## Расставить пробелы в документе

- Выберите **Плагины › Добавить пробелы между CJK и латиницей** или тот же пункт в контекстном меню. 用Textus写作 становится 用 Textus 写作. Весь документ меняется одним шагом отмены, а уведомление говорит, сколько блоков изменилось.
- Включите **Также при сохранении** в настройках плагина, чтобы пробелы расставлялись при каждом сохранении. Меняются только абзацы, заголовки, списки и прочий текст.
- Корейский не трогается: в нём слова и так разделяются пробелами.

## Что остаётся как есть

- Код, формулы, ссылки и вики-ссылки, сноски, #теги, напоминания (@…), комментарии %%, HTML и front matter — и при сохранении тоже.
- То, что пишет Obsidian: идентификаторы блоков (^1a2b3c), поля Dataview (key:: value), ==выделения== и поля Obsidian Tasks (📅 2026-11-07).

## Разрешения

- **Чтение и правка документа**: чтобы расставить пробелы в открытом документе.
- **Запись файлов**: чтобы расставлять пробелы при сохранении, когда включено **Также при сохранении**.
- **Инструменты для Textus AI**: чтобы Textus AI мог расставить пробелы в тексте за вас.

## Изменения

- **0.3.0** - From Textus 1.4.4, a paragraph missing a space between CJK and Latin text is underlined; its card adds the spaces. Turn it off in the plugin's settings.
- **0.2.4** - A code block inside a longer fence (```` holding ```) is left alone.
- **0.2.3** - Its Textus AI tool says what it does: Chinese and Japanese, not Korean.
- **0.2.2** - leaves Obsidian's block ids, Dataview fields, highlights and Tasks fields as written
- **0.2.1** - leaves #tags, reminders and %% comments alone; on save only prose blocks change
- **0.2.0** - a tool for Textus AI, `fix_cjk_spacing`
- **0.1.3** - runs on the desktop and on iOS
- **0.1.2** - leaves links, wiki links, footnotes, tags and front matter alone
- **0.1.0-0.1.1** - first versions: the command in the right-click and Plugins menus, and spacing on save

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `fix_cjk_spacing`: Ставит пробел между китайскими или японскими знаками и латинскими буквами или цифрами в Markdown, не трогая код и ссылки, как команда плагина. Возвращает текст с пробелами; ничего не записывает.
<!-- /ai-tools -->

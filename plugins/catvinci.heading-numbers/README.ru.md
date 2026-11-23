# Нумерация заголовков

Показывает номера перед заголовками по ходу письма (1, 1.1, 1.2), не меняя текст.

- Пока вы пишете, перед каждым заголовком виден его номер: 1, 1.1, 1.2, 2… Номера только рисуются, а текст документа остаётся прежним.
- Нумерация начинается с самого высокого уровня заголовков в документе или с уровня ниже, если на этом уровне только название.
- Документ, где заголовки уже пронумерованы вручную, лишних номеров не получает. Так бывает, когда большинство заголовков верхнего уровня начинаются с номера вроде `1.`, `1.2`, `一、`, `第一章` или `(一)`.
- Obsidian: `number headings: off` в свойствах документа (настройка плагина Number Headings для Obsidian) отключает номера в этом документе.
- **Номера при экспорте** (**Настройки › Расширения › Плагины › Нумерация заголовков**, по умолчанию включено): при экспорте в HTML и PDF видны те же номера.

Плагин читает заголовки открытого документа (разрешение на чтение редактора) и даёт Textus AI инструмент `number_headings` (см. ниже; разрешение на инструменты ИИ). Инструмент возвращает текст с вписанными или убранными номерами и не меняет файлы.

## Изменения

- **0.2.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.2.4** - With two documents open side by side, both show their heading numbers, not only the one you are typing in.
- **0.2.3** - Front matter and code blocks no longer get numbers by mistake, and exports number only top-level headings, like the editor.
- **0.2.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.1** - No numbers on a document numbered by hand, or one whose front matter says `number headings: off`.
- **0.2.0** - Textus AI can write heading numbers into Markdown, or take them out.
- **0.1.3** - Says where it runs: the desktop, iPhone and iPad.
- **0.1.2** - Numbering starts at the document's own top heading level instead of a setting.
- **0.1.0-0.1.1** - First versions: numbers before headings while writing, and in HTML and PDF exports.

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `number_headings`: Вписывает номера в заголовки Markdown - 1, 1.1, 1.2 - так же, как их показывает редактор (единственный заглавный заголовок не нумеруется), заменяя имеющиеся; с remove убирает их. Возвращает текст; ничего не записывает.
<!-- /ai-tools -->

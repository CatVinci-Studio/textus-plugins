# Статистика письма

Показывает на боковой панели число слов, время чтения и дневную цель.

Откройте вкладку **Статистика письма** на боковой панели:

- **Этот документ**: слова, символы и время чтения.
- **Выделение**: слова и символы выделенного текста.
- **Сегодня**: слова, которые вы добавили сегодня во всех документах, в сравнении с дневной целью, и сколько дней подряд вы её достигали. Цель задаётся в настройках плагина, в поле **Дневная цель**: 500, если вы её не меняли, 0 — без цели.
- **Вся папка**: разверните, чтобы посчитать слова, символы и документы во всей открытой папке.

Китайский, японский и корейский текст считается по иероглифам, остальные письменности — по словам. Собственные знаки Markdown — `#`, `*`, адреса ссылок, front matter — не считаются. Время чтения рассчитано на 230 слов или 400 иероглифов в минуту.

Нужен Textus 1.4.3 или новее. Плагин просит чтение редактора и файлов открытой папки, чтобы их считать, и даёт Textus AI инструмент, описанный ниже.

## Изменения

- **0.2.8** - Its page is in every language Textus speaks. It names the Textus it needs, 1.4.3.
- **0.2.7** - Code kept for Textus versions it no longer runs on is gone.
- **0.2.6** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.2.5** - Words and characters are counted as the status bar counts them (from Textus 1.4.3), and a Windows file's front matter is left out of the count.
- **0.2.4** - The store description now opens with what the plugin does.
- **0.2.3** - Today now counts only the words you type yourself, not changes from sync or AI, and stays quick in large folders. A negative daily goal is no longer shown as met.
- **0.2.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.1** - Updated shared path code.
- **0.2.0** - Textus AI can count the words of a document or a folder.
- **0.1.1** - Says where it runs: desktop and iPhone.
- **0.1.0** - First version: the document, the selection, today against a goal, the streak and the whole folder.

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `count_words`: Считает слова, символы и минуты чтения для документа, всех документов папки или документа на переднем плане; китайский, японский или корейский иероглиф считается словом, разметка Markdown не считается.
<!-- /ai-tools -->

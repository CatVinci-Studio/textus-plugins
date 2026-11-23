# Уборка

Подчёркивает Markdown, нарушающий общепринятые правила, исправляет его и наводит порядок в пустых строках, пробелах, пунктуации и переносах.

Работает как Linter в Obsidian, и каждое изменение отменяется одним шагом.

## Markdown

- Нарушения общих правил Markdown подчёркнуты; задержите указатель, чтобы увидеть правило и причину.
- **Исправить Markdown** (правый щелчок или меню «Плагины») исправляет всё, что можно.
- Каждый блок проверяется отдельно, поэтому правила о документе целиком (уровни заголовков, первая строка, пустые строки между блоками) не применяются.

## Текст

Каждая команда работает с выделением, а если ничего не выделено — после вопроса со всем документом. Команды есть в меню «Плагины» и в палитре команд.

- **Убрать пустые строки**: пустые абзацы удаляются; в выделении — все пустые строки.
- **Убрать пробелы в конце строк**: пробелы и табуляции в конце строк; два пробела перевода строки остаются.
- **Китайская пунктуация в китайском тексте**: 你好,世界? становится 你好，世界？. Числа вроде 1.3.8 и английские фразы не меняются.
- **Английская пунктуация в английском тексте**: Hello，world！ становится Hello, world!; знаки рядом с китайским текстом не меняются.
- **Полноширинные буквы и цифры в ASCII**: ＡＢＣ１２３ становится ABC123.
- **Объединить выделенные строки** (также по правому щелчку): выделенные строки становятся одной, без пробела между китайскими иероглифами и с пробелом между словами.

## Настройки

- **Подчёркивать Markdown, нарушающий правило**: если выключить, подчёркиваний не будет; «Исправить Markdown» по-прежнему работает.
- **Отключённые правила**: правила markdownlint, по одному в строке (MD009 или no-trailing-spaces); они не подчёркиваются и не исправляются.

## Что не меняется

Код, формулы, front matter, ссылки, #теги, напоминания (@…), комментарии %%, HTML и определения ссылок ([d]: url) никогда не отмечаются и не меняются, как и то, что пишет Obsidian: идентификаторы блоков (^1a2b3c), поля Dataview (key:: value, [key:: value]), ==выделения== и поля Obsidian Tasks (📅 2026-11-07, 🔁 every week, 🆔 abc123). При объединении строк поле остаётся на своей строке. Скобки меняются парами: 价格(USD) становится 价格（USD）.

«Пробелы CJK» — плагин, который ставит пробелы между китайским и латинским текстом, — тоже ничего из этого не трогает.

## Разрешения

- Чтение и правка документа: чтобы проверять его и вносить исправления.
- Инструменты для Textus AI: чтобы Textus AI проверял Markdown по тем же правилам.

## Изменения

- **0.5.2** - Its page shows its list of changes in English in every language.
- **0.5.1** - Its package lists the libraries it carries, with their licenses.
- **0.5.0** - Each finding opens a card that names the rule and fixes that block (Alt+Enter), or sets it aside with Ignore (Textus 1.4.4).
- **0.4.1** - Remove Blank Lines and list switching leave a code block inside a longer fence (```` holding ```) alone.
- **0.4.0** - Switch selected lines to a bullet, numbered or task list (numbered counts from 1 at each level; a task keeps its tick).
- **0.3.2** - Shorter help and empty-state text.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - Renamed Tidy (was Markdown Lint): Text Tidy's six text commands moved in; settings to turn off underlines or single rules; Obsidian's own syntax left as written.
- **0.2.1** - Tags, links, reminders and reference definitions are never flagged: the same list CJK Spacing leaves alone.
- **0.2.0** - Textus AI can check Markdown (`lint_markdown`).
- **0.1.0-0.1.2** - First versions: underlines that explain the rule, and Fix Markdown; store page and icon; runs on desktop and iOS.

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `lint_markdown`: Проверяет Markdown - переданный или документ на переднем плане - по правилам markdownlint, как их подчёркивает редактор: строка, правило, описание каждой проблемы и можно ли её исправить; с fix - ещё и исправленный текст. Сам ничего не меняет.
<!-- /ai-tools -->

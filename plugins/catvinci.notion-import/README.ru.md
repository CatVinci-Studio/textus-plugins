# Импорт из Notion

Превращает экспорт Notion в обычные файлы Markdown в открытой папке, которые читает и Obsidian.

Переносится всё: страницы и подстраницы, картинки и вложения, ссылки между ними и базы данных в формате Bases из Obsidian.

1. В Notion выберите **Settings › Export all workspace content**, с форматом **Markdown & CSV** и подстраницами. Положите полученный .zip (или папку, в которую он распаковывается) в папку, открытую в Textus.
2. Выберите **Плагины › Импорт из Notion…** (или щёлкните правой кнопкой по .zip на боковой панели) и укажите экспорт. Большой экспорт, разбитый на Part-1.zip, Part-2.zip… внутри одного zip, открывается как один. Файл .zip больше 256 МБ слишком велик, чтобы прочитать его целиком: распакуйте его в открытую папку и выберите эту папку.
3. Назовите папку, в которую попадёт импорт (**Notion**, если не ввести другое имя); то, что там уже есть, не меняется. Полоса прогресса позволяет отменить импорт; уже записанное остаётся. В конце открывается страница отчёта, а если установлен плагин **Вики**, боковая панель показывает импорт деревом страниц.

## Во что всё превращается

- **Страницы**: страница с подстраницами — и строка базы данных с подстраницами тоже — становится папкой со страницей внутри, `Plans/Plans.md`, а подстраницы лежат рядом; страница без подстраниц — это файл, `Plans.md`. Идентификаторы Notion из имён убираются; страница строки базы данных получает полный заголовок, который Notion обрезает в именах файлов.
- **Базы данных**: каждая база данных становится папкой со страницей, где лежит блок `base`, а её виды переключаются одним щелчком — доска, если есть статус, таблица и календарь, если есть даты. Каждая строка — заметка в этой папке со свойствами во front matter: даты вида 2026-01-04, флажки, числа, списки, связи в виде ссылок. Где другая страница показывает базу данных, она показывает её и здесь, отсортированной так, как указано в экспорте. Пустые строки и страницы Notion «Untitled» пропускаются.
- **Картинки и вложения** попадают в папку `assets` рядом со страницей, которая их показывает; вставленные картинки получают имя своей страницы.
- **Ссылки** между страницами, на картинки и на вложения следуют новым именам. Ссылки на страницы, которых не было в экспорте, перечислены в отчёте.
- **Ссылки между страницами**: выбираются в начале — обычные ссылки (рекомендуется), `[Page](Page.md)`, как их экспортирует Notion и открывает любое приложение, или `[[wiki links]]`, как их пишет Obsidian. Импортированная папка запоминает выбор, поэтому страница, созданная в ней позже, ссылается так же.
- **Выноски** становятся примечаниями (`> [!NOTE]`) со своими эмодзи. Раскрывающиеся блоки остаются как `<details>`.

**Значки страниц**: экспорт Notion в Markdown их не сохраняет. Экспортируйте те же страницы ещё и в HTML и укажите этот экспорт, когда импорт спросит: эмодзи-значки страниц перенесутся.

**Что не переносится**: в экспорте Notion нет обложек, комментариев и фильтров сохранённых видов, поэтому они не переносятся; сортировка вида переносится. Свойства-формулы и свойства-сводки сохраняют то значение, которое у них было, а упоминания людей и дат становятся обычным текстом.

## Отчёт

Отчёт считает, что было импортировано, перечисляет ссылки, которые не удалось найти, файлы, которые не удалось прочитать или записать, и изменённые блоки, а также предлагает плагины, которые помогут с остальным: сначала Вики — для дерева страниц и баз данных, затем Двусторонние ссылки, Быстрый просмотр, Задачи, Карточки ссылок, Просмотр PDF и Шаблоны, каждый только если в импорте есть то, с чем он помогает. **Плагины › Полезные плагины после импорта из Notion…** предлагает установить один из них; Textus сначала спрашивает, и ничего не устанавливается само.

## Разрешения

Всё происходит на вашем устройстве: плагин читает и записывает файлы только в открытой папке и никогда не выходит в сеть. Нужен Textus 1.3.10 или новее.

## Изменения

- **0.7.12** - Its page is in every language Textus speaks. In Chinese, a database is 数据库, and 知识库 is only the Wiki plugin's name. Every language calls the Wiki plugin by its current name.
- **0.7.11** - Its package lists the libraries it carries, with their licenses.
- **0.7.10** - The database code it shares with Database brought up to date (its file columns filled).
- **0.7.9** - Databases it makes keep a view another plugin draws (Textus 1.4.6).
- **0.7.8** - The import report gets a free name as it is written (Textus 1.4.3).
- **0.7.7** - Bundles the Wiki plugin's newer base code; importing works as before.
- **0.7.6** - Importing a database with many rows is quicker.
- **0.7.5** - Page icons now come through from an unzipped HTML export too, and such an export shows up when you pick where the icons come from.
- **0.7.4** - Shares the database's updated filter code: a filter ticking several values reads the same in both. Shorter help and empty-state text.
- **0.7.3** - Once imported, the sidebar goes into the new folder (Textus 1.3.12) and shows its pages tree. Notion's blank rows and pages - no title, nothing written, only the "Not started" status Notion fills in - are left out.
- **0.7.2** - A database that sits under a page (as in Notion) stays a link on that page, no longer also shown there as a table; its own page shows it. Its code is split into smaller files by what each part does.
- **0.7.1** - Shares Two-way Links' fix for working out how a note links.
- **0.7.0** - asks how the pages link: standard links (recommended), as Notion exports them, or [[wiki links]] - a path shown by the page's name; the imported folder keeps the choice for pages made in it later
- **0.6.1** - Calls Workspace by its name in the import report and in the suggested plugins.
- **0.6.0** - Dates written by Textus itself; needs Textus 1.3.10.
- **0.5.0** - Page emoji icons, from Notion's HTML export of the same pages.
- **0.4.0** - Its own plugin again: pages with sub-pages as folders, databases as Obsidian bases, empty "Untitled" pages left out, and the import opened in Workspace's pages tree.
- **0.3.0** - Merged into Workspace for a while; this version only pointed there.
- **0.2.2** - One database block per database, opening on the board when there is a status.
- **0.2.1** - Asks what to name the import's folder; pasted pictures are named after their page.
- **0.2.0** - Reads Notion's newer exports: no doubled pages or rows, rows keep their whole titles, attachments go beside the page that uses them, databases shown on other pages keep their sort.
- **0.1.1** - The report suggests Two-way Links by its new name.
- **0.1.0** - First version: a Notion export (.zip or folder) into a folder of Markdown, ids out of names, links rewritten, databases as notes with front matter, callouts as notes, a report with plugins that help.

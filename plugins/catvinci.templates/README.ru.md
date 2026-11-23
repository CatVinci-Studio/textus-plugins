# Шаблоны

Создаёт новые документы и вставляет фрагменты из ваших собственных шаблонов, сразу подставляя дату, время и заголовок.

Шаблоны — это файлы Markdown в папке **Templates** открытой папки (в хранилище Obsidian — в папке, которую называют его настройки шаблонов), поэтому они путешествуют вместе с заметками. Если шаблонов ещё нет, для начала создаётся шаблон **Заметки встречи**.

- **Плагины › Создать из шаблона…** создаёт документ из одного из ваших шаблонов в корне открытой папки. Он спрашивает имя и не принимает уже занятое.
- **Плагины › Вставить шаблон…** или **Вставить шаблон…** в меню косой черты вставляет шаблон в позицию курсора.
- **Плагины › Сохранить как шаблон…** сохраняет открытый документ как шаблон. К занятому имени добавляется номер; ничего не перезаписывается.

## Что подставляется

- `{{date}}`, `{{time}}` и `{{title}}` подставляются при использовании шаблона; `{{date:YYYY-MM-DD}}` и `{{time:HH:mm}}` принимают формат, как в Obsidian.
- В хранилище Obsidian `{{date}}` и `{{time}}` берут форматы даты и времени из его настроек шаблонов.
- Подставляются и частые теги Templater: `<% tp.date.now("YYYY-MM-DD") %>` (со сдвигом в днях, например `-1`, или `"P1W"`), `tp.date.today`, `tomorrow` и `yesterday`, `<% tp.file.title %>`, `tp.file.creation_date()` и `tp.file.folder()`; `<% tp.file.cursor() %>` ставит туда курсор.
- Скрипты и прочие теги никогда не выполняются: они остаются как написаны, а уведомление их перечисляет.

Работает на компьютере и на iPhone, нужен Textus 1.3.10 или новее. Плагин просит доступ на чтение и запись файлов открытой папки — для шаблонов и новых документов; на чтение и правку открытого документа — чтобы вставить шаблон или сохранить его как шаблон; и даёт Textus AI два инструмента ниже.

## Изменения

- **0.5.6** - Its page no longer says which devices it runs on: the store shows that. It names the Textus it needs, 1.4.3.
- **0.5.5** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller. Needs Textus 1.4.3.
- **0.5.4** - A taken name gets the next free one as the file is written, never a clash (Textus 1.4.3).
- **0.5.3** - The store description now opens with what the plugin does.
- **0.5.2** - Templates in a hidden or lowercase templates folder, and in its subfolders, now show up. After Insert, the caret lands right after the template.
- **0.5.1** - **New from Template…** from a file's or folder's right-click menu makes the document in that folder.
- **0.5.0** - Templates are filled in by Textus itself, the same way as daily notes; needs Textus 1.3.10.
- **0.4.1** - Templates are listed in natural order: 2 before 10.
- **0.4.0** - Templater's common `tp.date` and `tp.file` tags, and an Obsidian vault's Templates date and time formats; tags that aren't run are named in a notice.
- **0.3.0** - Templates are Markdown files in the Templates folder (a vault's own templates folder in Obsidian), moved there once from where older versions kept them; `{{date:FORMAT}}` and `{{time:FORMAT}}`.
- **0.2.0** - Textus AI can list your templates and make a document from one.
- **0.1.3** - Says where it runs: desktop and iPhone.
- **0.1.2** - New from Template refuses a name that is already taken.
- **0.1.0-0.1.1** - First versions: new documents, inserted snippets and saved templates, with `{{date}}`, `{{time}}` and `{{title}}`; store page and icon.

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `list_templates`: Перечисляет шаблоны документов пользователя, каждый с именем и Markdown, где {{date}}, {{time}}, {{title}} и теги tp.date и tp.file из Templater заполняются при использовании.
- `create_from_template`: Создаёт новый документ в открытой папке по шаблону пользователя, заполняя {{date}}, {{time}}, {{title}} и теги tp.date и tp.file из Templater. Возвращает его путь, а в notRun — теги, оставленные как есть.
<!-- /ai-tools -->

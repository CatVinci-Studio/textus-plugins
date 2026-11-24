# Напоминания

Напоминает о строке в то время, которое вы в ней написали, например `(@2026-11-02 09:00)`, системным уведомлением.

Напишите метку в любой строке — в задаче, заголовке, где угодно. В это время уведомление покажет текст строки и её документ; щёлкните по нему, и строка откроется.

- `(@2026-11-02)` без времени напоминает в девять утра этого дня.
- **Плагины › Напомнить…** или **Напомнить…** в меню косой черты сами ставят метку в позицию курсора: через час, сегодня в 20:00, завтра в 9:00, в следующий понедельник в 9:00 или в дату и время, которые вы введёте.
- Отмеченная задача (`- [x] …`) выполнена: напоминания не будет.
- Вкладка **Напоминания** на боковой панели показывает предстоящие напоминания, ближайшие первыми; щёлкните по одному, чтобы открыть его строку.
- Напоминания хранит сам Textus: они приходят, пока открыто окно, а при всех закрытых окнах — если включено **Продолжать работать в фоне** (**Настройки › Основные**). Напоминание, пропущенное, пока Textus не работал, придёт при следующем запуске.

Метки записываются так же, как их пишет плагин Reminder для Obsidian, поэтому те же заметки напоминают и там.

Нужен Textus 1.4.3 или новее. Плагин просит чтение файлов открытой папки — чтобы находить метки; запись в редакторе — чтобы ставить метку; показ уведомлений; и право дать Textus AI два инструмента, описанные ниже.

## Изменения

- **0.3.6** - Its page is in every language Textus speaks. It names the Textus it needs, 1.4.3.
- **0.3.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.3.4** - Opening a folder reads only the documents Textus finds a reminder mark in, not every document.
- **0.3.3** - The store description now opens with what the plugin does.
- **0.3.2** - Two open windows no longer clear each other's reminders, and the list empties when you close the folder. A mistyped time is refused instead of inserting a broken mark.
- **0.3.1** - Shorter help and empty-state text.
- **0.3.0** - Marks written with Textus's own dates; needs Textus 1.3.10.
- **0.2.2-0.2.3** - Updated shared date code.
- **0.2.1** - Textus AI is told when a due date belongs in Tasks instead.
- **0.2.0** - Textus AI can list the coming reminders and add one.
- **0.1.1** - Desktop only, since it runs in the background.
- **0.1.0** - First version: `(@date time)` marks as notifications Textus keeps, even in the background; Remind Me… and the sidebar list.

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `list_reminders`: Перечисляет предстоящие напоминания - метки (@2026-11-02 09:00) в документах открытой папки - начиная с ближайшего, с временем, текстом, путём к документу и строкой. Задачи по сроку — list_tasks.
- `add_reminder`: Добавляет напоминание строкой задачи со временем, - [ ] текст (@2026-11-02 09:00), в конец документа на переднем плане; в это время придёт уведомление. Когда пользователь хочет напоминание в определённое время; задача только со сроком — add_task.
<!-- /ai-tools -->

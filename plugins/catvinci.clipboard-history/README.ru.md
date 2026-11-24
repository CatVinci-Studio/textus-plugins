# История буфера обмена

Хранит в боковой панели то, что вы копируете или вырезаете в документах, чтобы вставить это снова.

Скопируйте или вырежьте текст в документе, и он появится во вкладке **История буфера обмена** в боковой панели, новое сверху. Хранятся последние 30 записей, и после перезапуска Textus тоже. Если скопировать тот же текст ещё раз, он снова окажется сверху; очень длинные фрагменты (больше 50 000 символов) не сохраняются.

- Щелчок по записи вставляет её в место курсора.
- Правый щелчок по записи позволяет **Копировать** её снова или **Убрать**.
- **Очистить историю буфера обмена** (правый щелчок по записи или **Плагины › Очистить историю буфера обмена**) очищает список.

Сохраняется только то, что вы копируете в документах, а не в настройках или других приложениях. Список хранится только в Textus.

## Разрешения

- Буфер обмена: чтобы видеть, что вы копируете в документе, и снова копировать запись.
- Правка документа: чтобы вставить запись в место курсора.

## Изменения

- **0.1.5** - Its page shows its list of changes in English in every language.
- **0.1.4** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.1.3** - Each clip shows when it was copied, with a line between clips.
- **0.1.2** - The panel's Clear button is back: one click empties the history. Shorter help and empty-state text.
- **0.1.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.0** - First version: the last 30 copies in the sidebar, put in with a click, copied again or removed with a right-click. Needs Textus 1.3.10.

# История версий

Сохраняет каждое сохранение документа как версию, чтобы видеть, что изменилось, и возвращать старую.

- При каждом сохранении текст документа остаётся как версия. Сохранения подряд (автосохранение каждые несколько секунд) считаются одной версией, а новая появляется не чаще раза в 15 минут. Всё за последний день сохраняется, затем по одной в час на неделю, по одной в день на три месяца и по одной в неделю раньше.
- Вкладка **История** в боковой панели показывает версии открытого документа, новые сверху, по дням: «Сегодня», «Вчера», затем дата.
- Выберите версию, чтобы построчно увидеть, что изменилось с тех пор.
- Сравнивайте её с документом сейчас или с любой другой версией — изменённые слова отмечены. **Вернуть** рядом с изменением возвращает только его; **Ещё** даёт версии название или закрепляет её (тогда она сохраняется навсегда) или открывает её как новый документ. Изменения вне Textus (другое приложение, синхронизация, git) тоже сохраняются: текст до и после.
- **Вернуть** предлагает старый текст как правку документа, которую вы принимаете или отклоняете, как любую другую. **Открыть как новый документ** открывает её рядом.
- Версии хранятся в Textus, а не в вашей папке. Документы больше 2 МБ не сохраняются, а когда хранилище заполнено, первыми уходят самые старые версии.

## Разрешения

- Чтение файлов и документа: чтобы сохранять каждую версию и сравнивать её с текущим текстом.
- Предложение правок: чтобы вернуть старую версию как правку, которую вы принимаете или отклоняете.
- Инструменты для Textus AI: чтобы Textus AI мог показывать версии документа и сравнивать их.

## Изменения

- **0.5.0** - From Textus 1.4.4 the versions other plugins keep of a document - Cloud Sync's - are listed too, each under its source's name, to compare and restore like the rest.
- **0.4.1** - Restore is one word, so its button fits a narrow sidebar in every language.
- **0.4.0** - Versions thin out with age instead of the last 50 going; each text is stored once; a deleted document's versions go a month later. Compare any two versions, word by word; take back one change; name and pin versions; changes made outside Textus are kept. Versions from 0.3 move over by themselves. Needs Textus 1.4.3. In a Git folder on the desktop, the document's commits show under its versions.
- **0.3.8** - The text from before the first save is no longer lost when that save comes right as the document opens.
- **0.3.7** - The text a document had before its first save is kept as a version too, and a document's versions follow it when it is renamed or moved.
- **0.3.6** - Autosave while you type writes only the newest version, not every version of the document, so long documents save with much less work.
- **0.3.5** - An open version stays open while autosave updates it, and Restore always finds it. When storage is full, older versions of other documents make room, and the panel says when a save couldn't be kept. Rows work from the keyboard; buttons wrap in a narrow sidebar.
- **0.3.4** - In the sidebar the panel draws no title of its own, as the sidebar's other tabs. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.3.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - Only the path code shared with other plugins changed; nothing changes in use.
- **0.3.0** - Textus AI can list a document's versions and compare them (`list_versions`, `diff_versions`).
- **0.2.0** - Textus's own controls. Needs Textus 1.3.2.
- **0.1.0-0.1.3** - First versions: a version on each save, what changed since, restore as an edit to accept or reject, open as a new document, saves close together kept as one, versions grouped by day, the oldest dropped when storage is full.

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `list_versions`: Перечисляет сохранённые версии документа - переднего, если путь не указан, - от новой к старой, с номерами от 1, временем сохранения и размером.
- `diff_versions`: Построчно показывает, что изменилось между двумя версиями документа или между версией и документом сейчас: + добавлено, - удалено, с небольшим контекстом.
<!-- /ai-tools -->

# WakaTime

Отправляет время, которое вы пишете в Textus, в ваш аккаунт [WakaTime](https://wakatime.com), чтобы оно было видно на панели рядом с временем программирования.

1. Скопируйте ключ API на [wakatime.com/settings/api-key](https://wakatime.com/settings/api-key).
2. Нажмите **Задать ключ API…** на странице WakaTime в настройках Textus и вставьте его. Ключ хранится в защищённом хранилище Textus.

В меню «Плагины» и в палитре команд есть **WakaTime: задать ключ API…**, **WakaTime: время письма сегодня**, которая показывает сегодняшний итог так, как его считает WakaTime, и **WakaTime: открыть панель**.

## Что считается и что отправляется

- Считается только ваша собственная работа в окне Textus на переднем плане: набор текста, перемещение курсора, переключение документов и сохранение. Время, когда Textus в фоне, и изменения, сделанные на диске или плагином, не считаются. Текст, написанный с Textus AI, считается как программирование с ИИ.
- За каждый момент работы плагин сообщает WakaTime путь документа, язык (Markdown), число строк, проект и ветку Git. Проект — это первая строка файла `.wakatime-project` в открытой папке, а если его нет, имя открытой папки.
- Для одного документа он отправляет данные не чаще раза в две минуты и всегда при сохранении — как собственные плагины WakaTime.
- Без сети время ждёт в очереди и уходит позже, пакетами.
- Пока ключ не задан, ничего не отправляется, а несохранённый документ не отправляется никогда. Чтобы остановить отправку, задайте пустой ключ.

Нужен Textus 1.3.0 или новее. Плагин просит чтение редактора и файлов открытой папки (документа, его строк, `.wakatime-project` и `.git/HEAD`) и доступ к `api.wakatime.com` — больше ничего в сети.

## Изменения

- **0.2.6** - Its icon is WakaTime's own logo.
- **0.2.5** - Set the API key with a button on its page in Settings, and find its commands in the Plugins menu: on a phone, with no command palette, too. Its page is in every language Textus speaks.
- **0.2.4** - Leaving the key empty now really turns it off; a garbled reply to Today's Writing Time shows the usual message.
- **0.2.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.2** - Finds `.wakatime-project` and the Git branch the same way on every system.
- **0.2.1** - Says where it runs: desktop and iPhone.
- **0.2.0** - Only your own work in a window in front counts; an offline queue sent in batches; project, branch and lines; Today's Writing Time.
- **0.1.0** - First version: writing time in Textus on your WakaTime dashboard.

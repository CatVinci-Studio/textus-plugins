# Поиск Keenable

Позвольте Textus AI искать в интернете через [Keenable](https://keenable.ai).

- Textus AI пользуется им в разговоре, когда вы просите Keenable или когда его собственный веб-поиск не настроен. По умолчанию он получает 5 результатов (до 10), у каждого есть заголовок, адрес, короткий текст и дата.
- Без ключа он работает через открытый поиск Keenable. Для полного поиска Keenable нажмите **Задать API-ключ…** на странице плагина в настройках Textus (или выполните **Keenable: задать API-ключ…** из палитры команд) и вставьте ключ. Сделайте это ещё раз и оставьте поле пустым, чтобы удалить ключ и вернуться к открытому поиску. Ключ хранится в защищённом хранилище Textus на этом устройстве.
- Ваш запрос уходит в Keenable только тогда, когда Textus AI пользуется этим инструментом в разговоре.

Плагин просит два разрешения: инструменты ИИ — чтобы дать Textus AI инструмент поиска, описанный ниже, и доступ к сети только к `api.keenable.ai` — чтобы выполнять поиск.

## Изменения

- **0.1.3** - Set the API key with a button on its page in Settings: on a phone, with no command palette, too. Its page is in every language Textus speaks.
- **0.1.2** - Removing the API key really removes it, so search goes back to the public search; an unreadable answer gets a plain message.
- **0.1.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.0** - First version: web search for Textus AI through Keenable, with or without an API key.

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `keenable_search`: Ищет в интернете через Keenable и возвращает для каждого результата заголовок, адрес, короткий текст и дату. Используй, когда пользователь просит Keenable или когда собственный веб-поиск Textus AI не настроен.
<!-- /ai-tools -->

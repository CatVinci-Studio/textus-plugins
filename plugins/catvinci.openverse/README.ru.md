# Картинки Openverse

Позволяет Textus AI находить для ваших документов картинки под открытыми лицензиями в [Openverse](https://openverse.org).

## Как пользоваться

- Попросите Textus AI найти настоящую фотографию или рисунок чего-либо, например «картинку маяка в сумерках». Он ищет в Openverse (Flickr, музеи и не только) и вставляет картинку с подписью об авторстве под ней.
- В каждой подписи указаны автор, лицензия и источник со ссылкой на страницу, откуда взята картинка.
- Используются только картинки под CC BY, CC BY-SA, CC0 и в общественном достоянии. Openverse передаёт то, что заявляет каждый источник, поэтому лицензия проверяется ещё раз, прежде чем картинка будет предложена.
- Больше всего находят запросы на английском.
- У плагина нет своего меню и настроек: он добавляет Textus AI один инструмент.

## Разрешения

- **Сеть, только api.openverse.org**: чтобы искать в Openverse. Аккаунт и ключ не нужны; Openverse ограничивает, сколько поисков в день можно сделать с одного адреса.
- **Инструменты для Textus AI**: чтобы Textus AI мог искать картинки.

## Изменения

- **0.1.4** - Its icon is Openverse's own logo.
- **0.1.3** - Its page is in every language Textus speaks. It no longer gives a number for Openverse's daily limit, which can change.
- **0.1.2** - The store description now opens with what the plugin does.
- **0.1.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.0** - first version: openly licensed pictures from Openverse for Textus AI, each with its credit line

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `find_open_pictures`: Находит в Openverse картинки под открытыми лицензиями (CC BY, CC BY-SA, CC0, общественное достояние) по описанию, каждую с её адресом и строкой авторства, которую требует лицензия и которая ставится под картинкой. Используй, когда пользователю нужна настоящая фотография или рисунок, а не сгенерированная картинка.
<!-- /ai-tools -->

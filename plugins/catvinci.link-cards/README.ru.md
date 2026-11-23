# Карточки ссылок

Показывает ссылку карточкой с заголовком, описанием и картинкой страницы или проигрывает видео Bilibili прямо на месте.

## Как сделать карточку

- Наберите `/`, выберите **Вставить карточку ссылки…** и вставьте ссылку. Или выделите ссылку в тексте, щёлкните по ней правой кнопкой и выберите **Вставить карточку ссылки…**, чтобы превратить её в карточку.
- Карточка показывает заголовок, описание, картинку и название сайта. Щёлкните по ней, чтобы открыть страницу в браузере.
- Ссылка на Bilibili вместо этого проигрывает видео в карточке. Ссылка на YouTube показывается карточкой с кадром из видео и открывается в браузере.
- Если страницу не удаётся прочитать (нет сети или это не веб-страница), в карточке остаётся только адрес.

## Что сохраняется

Карточка — это блок `card` с тем, что сообщила страница, поэтому она показывается без сети и читается как текст в любом приложении для Markdown:

````markdown
```card
url: https://textus.md
title: Textus
description: A Markdown editor with AI that writes with you.
image: https://textus.md/og.png
```
````

- **Загрузить снова** в меню карточки по правому щелчку подтягивает свежие заголовок и картинку страницы.
- Карточки из Obsidian тоже показываются: блоки `cardlink` плагина Auto Card Link и блоки `embed` плагина Link Embed рисуются карточками и остаются в том виде, в каком написаны.

## Разрешения

- **Сеть, любой адрес**: чтобы читать страницы, из которых вы делаете карточки. Плагин загружает только эти ссылки.
- **Чтение и правка документа**: чтобы прочитать выделенную ссылку и вставить карточку.
- **Инструменты для Textus AI**: чтобы Textus AI мог сделать карточку для ссылки.

## Изменения

- **0.5.1** - Its page is in every language Textus speaks. Needs Textus 1.4.4 itself, not a test version of it.
- **0.5.0** - Right-click a selected web address for Turn into a Link Card; the item no longer shows for other selections. Needs Textus 1.4.4.
- **0.4.3** - Pictures and site icons show again; titles with an apostrophe are kept whole; **Fetch again** moved into the card's right-click menu; YouTube links show as cards with the video's still.
- **0.4.2** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.0** - Obsidian's `cardlink` (Auto Card Link) and `embed` (Link Embed) blocks are drawn as cards
- **0.3.1** - the README's example links to textus.md
- **0.3.0** - a tool for Textus AI, `fetch_link_card`
- **0.2.0** - Textus's own buttons and colors (Textus 1.3.2)
- **0.1.0-0.1.1** - first versions: link cards kept in a `card` block, video players, **Fetch again**

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `fetch_link_card`: Получает заголовок, описание, картинку и название сайта веб-страницы и возвращает их с блоком ```card, показывающим ссылку карточкой, - чтобы вставить, куда хочет пользователь.
<!-- /ai-tools -->

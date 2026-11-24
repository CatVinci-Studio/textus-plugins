# Marp

Показывает документ как слайды, написанные по правилам [Marp](https://marp.app).

## Как сделать слайды

- Новый слайд начинается с каждой строки `---`.
- **Плагины › Показать как слайды** открывает презентацию во вкладке рядом с документом, и она следует за тем, что вы пишете. ← → (или ↑ ↓, Page Up и Page Down) и пробел переключают слайды; **Во весь экран** (или F) начинает показ. Во время показа касание или щелчок по левой трети слайда возвращает назад, а в любом другом месте — вперёд, как и смахивание; коснитесь слайда или двиньте указатель, чтобы появилась кнопка **Выйти**, или нажмите Esc.
- Директивы Marp выбирают тему и вёрстку, например в начале документа:

```markdown
---
theme: gaia
paginate: true
---
```

- Картинки показываются в презентации, включая `![[photo.png]]` из Obsidian; `![[photo.png|300]]` задаёт ширину (`300x200` — оба размера).

## Как сохранить презентацию

**Плагины › Экспортировать слайды в HTML** (или **Сохранить HTML** в презентации) сохраняет `name.slides.html` рядом с документом: один файл, который сам показывает слайды в любом браузере, с теми же клавишами. Картинки подключаются ссылками из папки документа, поэтому держите файл рядом с ними. Документ нужно сначала сохранить.

Основан на [Marp Core](https://github.com/marp-team/marp-core) (MIT), который приносит свои темы (default, gaia, uncover), формулы и подсветку кода — и из-за которого плагин весит около 4 МБ.

## Разрешения

- **Чтение документа**: чтобы рисовать слайды, пока вы пишете.
- **Чтение и запись файлов**: чтобы находить показываемые картинки и сохранять HTML-презентацию рядом с документом.
- **Инструменты для Textus AI**: чтобы Textus AI мог сохранить презентацию за вас.

## Изменения

- **0.3.14** - Its icon is Marp's own logo.
- **0.3.13** - The deck no longer stays blank when no document is in front - in Source Mode or Source and Preview, or presented from the plugin's page: it shows the document open in another tab, as last saved, or says to click one. Slides scale to their frame on a Mac, iPhone and iPad, in the tab and in a saved deck opened in Safari.
- **0.3.12** - Presenting on a phone or tablet: tap or swipe to move between slides, and Exit to stop - no keyboard needed. A click moves on in full screen too, as in a saved deck. In a narrow tab, Save HTML goes into the ⋯ menu instead of pushing Full Screen onto a second row. Its page is in every language Textus speaks.
- **0.3.11** - Its package lists the libraries it carries, with their licenses.
- **0.3.10** - Code kept for Textus versions it no longer runs on is gone. From Textus 1.4.4 the deck is also in File › Export, as Slides (HTML).
- **0.3.9** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.3.8** - Present as Slides draws the deck on a phone, where its tab comes to the front alone.
- **0.3.7** - Formulas use KaTeX's own fonts from Textus 1.4.2 on, in the tab and in a saved HTML file; earlier versions keep the system's fonts.
- **0.3.6** - A deck needs nothing from the web: emoji show as text instead of pictures from a CDN, formulas use the system's fonts, and the Gaia theme no longer loads a web font, in the tab and in a saved HTML file.
- **0.3.5** - Writing a deck with many pictures is lighter: the slides are made again only when the text changed, and pictures it no longer shows are let go.
- **0.3.4** - Full Screen works in the tab (presenting in place where the window can't go full screen); the deck renders only while its tab is open; shortcuts leave Cmd/Ctrl/Alt keys alone.
- **0.3.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - pictures in the deck, including Obsidian's `![[picture]]` embeds with a width
- **0.3.0** - a tool for Textus AI, `export_slides`
- **0.2.0** - named Marp in every language; Textus's own buttons and colors; labels follow the interface language
- **0.1.0-0.1.1** - first versions: a live deck beside the document, full screen, and a self-presenting HTML file

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `export_slides`: Сохраняет документ на переднем плане как слайды Marp - слайд на каждую строку --- - в один HTML-файл рядом (name.slides.html), который показывается в любом браузере. Возвращает путь и число слайдов.
<!-- /ai-tools -->

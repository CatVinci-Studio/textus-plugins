# Интеллект-карта

Рисует план на Markdown из заголовков и списков в виде интеллект-карты прямо в блоке кода.

Создайте блок кода с языком `markmap` и напишите в нём план: заголовки (`#`, `##`) и пункты списков становятся ветвями карты. Карта появится под блоком; щёлкните по блоку, чтобы снова увидеть и изменить исходный текст.

- Карту можно перетаскивать и масштабировать. Щелчок по точке на ветви сворачивает или разворачивает её.
- Напишите `height=400` после названия языка, чтобы задать высоту карты в пикселях (по умолчанию 360).
- Ветви окрашиваются в цвета темы, а при смене темы карта перерисовывается.
- При экспорте в HTML, PDF или Word карта попадает туда картинкой, даже если она прокручена за пределы экрана.

Плагин рисует с помощью [markmap](https://markmap.js.org). Он просит одно разрешение — чтобы дать Textus AI инструмент `check_markmap` (см. ниже): он проверяет блок, прежде чем Textus AI запишет его в документ. Работает на компьютере, iPhone и iPad.

## Пример

```markmap
# Project
## Goals
- Ship 1.3
- Write the guide
## People
- Writers
- Reviewers
```

## Изменения

- **0.3.8** - The mind map fills its block: a small one grows (up to twice its size) to the block's width and the height you give it, and it follows the note's zoom instead of being cut off on the right.
- **0.3.7** - Its package lists the libraries it carries, with their licenses.
- **0.3.6** - A mind map drawn before its note was laid out no longer shows an error.
- **0.3.5** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.4** - Editing a mind map for a long time no longer makes Textus use more and more memory.
- **0.3.3** - Scrolling over a mind map now scrolls the note; pinch or Ctrl-scroll to zoom. The map uses your theme's font and colors, in dark mode too, and opens fully fitted.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - A mind map scrolled out of sight exports as its picture instead of its source.
- **0.3.0** - Textus AI can check a `markmap` block before it writes one.
- **0.2.0** - Branch colors come from the theme's tones. Needs Textus 1.3.2.
- **0.1.3** - Uses the theme's document text color and footnote size under their Textus 1.3 names.
- **0.1.0-0.1.2** - First versions: `markmap` code blocks drawn in the document, `height=`, and exports as a picture in the export's colors.

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `check_markmap`: Проверяет исходный текст блока ```markmap - план на Markdown, заголовки и пункты списков которого - ветви ментальной карты - до того, как он попадёт в документ, не рисуя его. Возвращает ok или проблемы, которые нужно сначала исправить. Передавайте текст без ограждения.
<!-- /ai-tools -->

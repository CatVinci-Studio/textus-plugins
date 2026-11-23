# Ноты (ABC)

Рисует ноты по записи ABC в блоке кода.

Напишите блок кода с языком `abc`. Ноты появятся прямо под ним, а щелчок по блоку снова покажет исходный текст для правки.

- Такты переносятся на новые строки по ширине колонки, поэтому ноты читаются и в узкой панели.
- Ноты рисуются цветом текста темы и перерисовываются при переключении светлой и тёмной темы.
- При экспорте в HTML, PDF и Word ноты попадают туда картинкой.

Нужен Textus 1.3.2 или новее. Плагин просит одно разрешение — инструменты Textus AI, чтобы Textus AI мог проверить блок `abc` перед тем, как записать его в документ.

## Пример

```abc
X:1
T:Scale
M:4/4
L:1/4
K:C
C D E F | G A B c |
```

## Изменения

- **0.3.5** - Its page no longer says which devices it runs on: the store shows that. Its page receives Textus's messages by the API's current name.
- **0.3.4** - Its package lists the libraries it carries, with their licenses.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Bars wrap to the column instead of the whole score shrinking; clicking a note no longer turns it red; `check_abc` accepts full mode names, any note length, `+:` lines, `` ` `` and `$`; `height=` is gone.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - Textus AI can check an `abc` block before writing it (`check_abc`).
- **0.2.0** - The notes follow the theme's text color; needs Textus 1.3.2.
- **0.1.3** - Uses Textus's renamed document colors.
- **0.1.2** - Exported pictures keep the music's width and height.
- **0.1.0-0.1.1** - First versions: `abc` blocks drawn under their source, `height=`, pictures in exports; store page and icon.

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `check_abc`: Проверяет исходный текст блока ```abc - нотная запись ABC: заголовок из полей, оканчивающийся K:, затем ноты - до того, как он попадёт в документ, не рисуя его. Возвращает ok или проблемы, которые нужно сначала исправить. Передавайте текст без ограждения.
<!-- /ai-tools -->

# Хронология

Рисует события в виде хронологии, по одному в строке: когда | что | подробности.

## Как нарисовать хронологию

- Напишите блок кода на `timeline`, по одному событию в строке: когда, что произошло и, по желанию, пояснение, через `|`. Хронология появится под блоком, а исходник снова видно, если щёлкнуть в блок.
- События идут в том порядке, в каком вы их написали, вдоль линии, у каждого своя точка. «Когда» — любой текст: дата, год, «День 3».
- Пустые строки пропускаются. Текст после третьего `|` не показывается.
- `height=400` после имени языка задаёт высоту рисунка.
- Хронология берёт цвета темы и перерисовывается при её смене.
- При экспорте в HTML, PDF или Word хронология попадает картинкой.

## Пример

```timeline
2024-03 | Черновик | План и две главы
2024-09 | Вычитка | Замечания трёх читателей
2025-01 | Опубликовано
```

## Разрешения

Плагин просит только **Инструменты для Textus AI**, чтобы Textus AI мог проверить блок, прежде чем его написать. Он не читает файлы и рисует всё на вашем устройстве — на компьютере и в iOS.

## Изменения

- **0.4.1** - Its page no longer says which devices it runs on: the store shows that.
- **0.4.0** - A database can be shown as a timeline: pick Timeline among its views, and its dated rows line up in order; a click opens a row. Needs Textus 1.4.6.
- **0.3.3** - A date no longer breaks in the middle ("2024-0" over "3"); a chart drawn while its block was folded fits once it opens.
- **0.3.2** - long notes and dates wrap to fit a narrow island, the timeline uses the document's font, and an empty block says what to write
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - a tool for Textus AI, `check_timeline`
- **0.2.0** - the theme's colors, drawn again when the theme changes
- **0.1.3** - text in the theme's colors on Textus 1.3
- **0.1.2** - keeps up with quick edits: an older drawing never replaces a newer one
- **0.1.0-0.1.1** - first versions: events drawn as a timeline, a height setting, pictures in exports

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `check_timeline`: Проверяет исходный текст блока ```timeline - по событию в строке, записанному как когда | что | подробнее - до того, как он попадёт в документ, не рисуя его. Возвращает ok или проблемы, которые нужно сначала исправить. Передавайте текст без ограждения.
<!-- /ai-tools -->

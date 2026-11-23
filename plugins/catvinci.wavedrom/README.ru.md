# WaveDrom

Рисует цифровые временные диаграммы и поля регистров по WaveJSON.

## Как нарисовать диаграмму

- Напишите блок кода на `wavedrom` с WaveJSON внутри. Диаграмма появится под блоком, а исходник снова видно, если щёлкнуть в блок.
- В `signal` — сигналы: у каждого `name`, строка `wave` (`p n h l 0 1 x z . |` и `= 2-9` для значений) и `data` с подписями значений. Список, который начинается с подписи, объединяет сигналы в группу; `{}` оставляет промежуток.
- `reg` рисует вместо этого поля регистра: `{ reg: [{ bits: 8, name: "data" }] }`.
- JSON, написанный от руки, тоже подходит: ключи без кавычек, одинарные кавычки, лишние запятые в конце и комментарии `//`.
- Ошибка в исходнике показывается под блоком.
- `height=400` после имени языка задаёт высоту рисунка.
- В тёмной теме используется тёмное оформление WaveDrom. При экспорте в HTML, PDF или Word диаграмма попадает картинкой, нарисованной в цветах экспорта.

## Пример

```wavedrom
{ signal: [
  { name: "clk",  wave: "p....." },
  { name: "data", wave: "x.345x", data: ["a", "b", "c"] }
]}
```

## Разрешения

Плагин просит только **Инструменты для Textus AI**, чтобы Textus AI мог проверить блок, прежде чем его написать. WaveDrom входит в плагин: он не читает файлы и рисует всё на вашем устройстве — на компьютере и в iOS.

## Изменения

- **0.3.6** - Its page no longer says which devices it runs on: the store shows that.
- **0.3.5** - Its package lists the libraries it carries, with their licenses.
- **0.3.4** - A very long diagram shrinks only as far as its labels stay readable, then scrolls sideways (a phone).
- **0.3.3** - Readable in dark mode: the lines and text take the theme's colours on the page's own background; a diagram drawn while its block was folded fits once it opens. A long diagram shrinks to the column instead of being cut off.
- **0.3.2** - Diagrams take the theme's font and line colour, grow with the document's zoom, and `height=` now resizes the diagram itself.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - a tool for Textus AI, `check_wavedrom`
- **0.2.0** - drawn again when the theme changes, with the chart page of Textus 1.3.2
- **0.1.3** - text in the theme's colors on Textus 1.3
- **0.1.2** - exports carry the diagram in the export's colors
- **0.1.0-0.1.1** - first versions: WaveJSON drawn with WaveDrom, dark skin, a height setting, pictures in exports

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `check_wavedrom`: Проверяет исходный текст блока ```wavedrom - WaveJSON: дорожки сигналов со строками wave и data или поля регистра - до того, как он попадёт в документ, не рисуя его. Возвращает ok или проблемы, которые нужно сначала исправить. Передавайте текст без ограждения.
<!-- /ai-tools -->

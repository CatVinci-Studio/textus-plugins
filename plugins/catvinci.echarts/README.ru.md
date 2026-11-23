# ECharts

Рисует диаграмму в документе по настройкам ECharts, записанным в блоке кода.

Создайте блок кода с языком `echarts` и запишите в него настройки (option) ECharts. Диаграмма появится под блоком; щёлкните по блоку, чтобы снова увидеть и изменить исходный текст.

- Настройки пишутся в JSON, причём не строго: ключи без кавычек, одинарные кавычки, запятые в конце и комментарии допустимы. Функции (например, функция `formatter`) — нет: содержимое блока не выполняется.
- Рисуются столбцы, линии, круговые, точечные и лепестковые диаграммы, шкалы, воронки, деревья, treemap, sunburst, диаграммы Сэнки, тепловые карты, свечи и другие серии ECharts. Карты — нет: им нужны картографические данные, которые блок загрузить не может.
- Напишите `height=400` после названия языка, чтобы задать высоту диаграммы в пикселях (по умолчанию 320).
- Цвета диаграммы берутся из темы, а при смене темы она перерисовывается.
- Если настройки нарисовать нельзя, блок сообщает, в чём ошибка.
- При экспорте в HTML, PDF или Word диаграмма попадает туда картинкой.

Плагин просит одно разрешение — чтобы дать Textus AI инструмент `check_echarts` (см. ниже): он проверяет блок, прежде чем Textus AI запишет его в документ. Работает на компьютере, iPhone и iPad.

## Пример

```echarts
{
  xAxis: { type: "category", data: ["Mon", "Tue", "Wed"] },
  yAxis: { type: "value" },
  series: [{ type: "bar", data: [120, 200, 150] }]
}
```

## Изменения

- **0.3.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.3.4** - Its package lists the libraries it carries, with their licenses.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Charts redraw when the panel width changes, and their text and default height follow the app's zoom and font.
- **0.3.1** - Its description no longer lists maps, which a block can't load.
- **0.3.0** - Textus AI can check an `echarts` block before it writes one.
- **0.2.0** - Series colors come from the theme's tones. Needs Textus 1.3.2.
- **0.1.3** - Uses the theme's document text color and footnote size under their Textus 1.3 names.
- **0.1.0-0.1.2** - First versions: `echarts` code blocks drawn in the document, `height=`, and exports as a picture.

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `check_echarts`: Проверяет исходный текст блока ```echarts - опция ECharts в JSON: series с их типами и оси или компоненты, на которых они рисуются - до того, как он попадёт в документ, не рисуя его. Возвращает ok или проблемы, которые нужно сначала исправить. Передавайте текст без ограждения.
<!-- /ai-tools -->

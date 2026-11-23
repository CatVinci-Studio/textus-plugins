# Chart.js

Рисует простые диаграммы — линейные, столбчатые, круговые и другие — по конфигурации Chart.js в блоке кода.

Напишите блок кода с языком `chartjs` и одной конфигурацией Chart.js 4: `type`, `data` с `labels` и `datasets` и, если нужно, `options`. Диаграмма появится прямо под блоком, а щелчок по нему снова покажет исходный текст для правки.

- Типы диаграмм: `line`, `bar`, `pie`, `doughnut`, `polarArea`, `radar`, `scatter` и `bubble`.
- Конфигурация пишется в JSON, но понимаются и привычные вольности: ключи без кавычек, одинарные кавычки, запятые в конце и комментарии. Функции не выполняются.
- Ряды без собственных цветов по очереди получают цвета темы, а при переключении светлой и тёмной темы диаграмма перерисовывается.
- Допишите `height=400` после `chartjs` в первой строке, чтобы задать высоту в пикселях (по умолчанию 300).
- Если в конфигурации ошибка, строка под блоком скажет, что не так.
- При экспорте в HTML, PDF и Word диаграмма попадает туда картинкой.

Нужен Textus 1.3.2 или новее. Плагин просит одно разрешение — инструменты Textus AI, чтобы Textus AI мог проверить блок `chartjs` перед тем, как записать его в документ.

## Пример

```chartjs
{
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [{ label: "Words", data: [1200, 1900, 3000] }]
  }
}
```

## Изменения

- **0.3.5** - Its page no longer says which devices it runs on: the store shows that. Its page receives Textus's messages by the API's current name.
- **0.3.4** - Its package lists the libraries it carries, with their licenses.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Charts redraw to fit a narrower or wider panel, labels follow the theme's font and text size, and the error line is red again.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - Textus AI can check a `chartjs` block before writing it (`check_chartjs`).
- **0.2.0** - Series take the theme's colors; needs Textus 1.3.2.
- **0.1.3** - Uses Textus's renamed document colors.
- **0.1.2** - While you type, the chart always shows the latest text.
- **0.1.0-0.1.1** - First versions: `chartjs` blocks drawn under their source, `height=`, pictures in exports; store page and icon.

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `check_chartjs`: Проверяет исходный текст блока ```chartjs - конфигурация Chart.js 4 в JSON: type, data с labels и datasets, options - до того, как он попадёт в документ, не рисуя его. Возвращает ok или проблемы, которые нужно сначала исправить. Передавайте текст без ограждения.
<!-- /ai-tools -->

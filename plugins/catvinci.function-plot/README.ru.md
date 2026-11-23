# Графики функций

Рисует графики функций от x, по одной в строке, например sin(x) или x^2 - 1.

## Как нарисовать график

- Напишите блок кода на `function-plot`, по одной функции в строке. График появится под блоком, а исходник снова видно, если щёлкнуть в блок.
- Строка может начинаться с `y =`. `2x` и `3sin(x)` — это умножение.
- Понимает + - * / ^, скобки, x, pi (π), e и sin, cos, tan, asin, acos, atan, sinh, cosh, tanh, exp, ln, log (по основанию 10), sqrt, abs, floor и ceil.
- x идёт от -10 до 10. Чтобы изменить, напишите `xmin=-5 xmax=5` после имени языка; `ymin` и `ymax` задают диапазон y, иначе он подстраивается под кривые.
- `height=400` после имени языка задаёт высоту рисунка.
- Если строку не удаётся прочитать, под блоком написано, что не так.
- Каждая кривая берёт цвет из темы, и при смене темы график перерисовывается.
- При экспорте в HTML, PDF или Word график попадает картинкой.

## Пример

```function-plot xmin=-5 xmax=5
sin(x)
x^2 / 4 - 1
```

## Разрешения

Плагин просит только **Инструменты для Textus AI**, чтобы Textus AI мог проверить блок, прежде чем его написать. Он не читает файлы и рисует всё на вашем устройстве — на компьютере и в iOS.

## Изменения

- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Steep curves like tan(x) keep their shape and break at asymptotes; a function with nothing to draw says so; π and 2xsin(x) are read; Textus AI's check uses the fence's x range.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - a tool for Textus AI, `check_function_plot`
- **0.2.0** - curves and axes in the theme's colors, drawn again when the theme changes
- **0.1.3** - text in the theme's colors on Textus 1.3
- **0.1.2** - -x^2 reads as -(x^2), and a range that ends at 0 is kept
- **0.1.0-0.1.1** - first versions: functions of x drawn as a picture, height and range settings, pictures in exports

<!-- ai-tools -->
## Инструменты для Textus AI

Когда плагин установлен, Textus AI может пользоваться ими в разговоре:

- `check_function_plot`: Проверяет исходный текст блока ```function-plot - функции от x, по одной в строке, с + - * / ^, скобками, pi, e и обычными функциями - до того, как он попадёт в документ, не рисуя его. Возвращает ok или проблемы, которые нужно сначала исправить. Передавайте текст без ограждения, а параметры ограждения (xmin=0 xmax=100) — в meta.
<!-- /ai-tools -->

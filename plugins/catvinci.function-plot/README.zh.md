# 函数图像

画出关于 x 的函数图像，每行一个，例如 sin(x) 或 x^2 - 1。

## 画一张图

- 写一个 `function-plot` 代码块，每行一个函数。图会画在代码块下方；点进代码块可以再看到并修改源码。
- 每行可以用 `y =` 开头。`2x`、`3sin(x)` 表示相乘。
- 支持 + - * / ^、括号、x、pi（π）、e，以及 sin、cos、tan、asin、acos、atan、sinh、cosh、tanh、exp、ln、log（以 10 为底）、sqrt、abs、floor、ceil。
- x 默认从 -10 到 10。在语言后写 `xmin=-5 xmax=5` 可以修改；`ymin`、`ymax` 固定 y 的范围，不写时按曲线自动调整。
- 在语言后写 `height=400` 可以设置图的高度。
- 有一行读不懂时，代码块下方会说明哪里有问题。
- 每条曲线使用主题里的颜色，切换主题时图会重新绘制。
- 导出 HTML、PDF、Word 时，图会作为图片放进去。

## 示例

```function-plot xmin=-5 xmax=5
sin(x)
x^2 / 4 - 1
```

## 权限

只需要 **Textus AI 工具** 权限，让 Textus AI 在写入代码块前先检查一遍。它不读取任何文件，全部在本机绘制。

## 更新日志

- **0.3.4** - Its page no longer says which devices it runs on: the store shows that. Its page receives Textus's messages by the API's current name.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Steep curves like tan(x) keep their shape and break at asymptotes; a function with nothing to draw says so; π and 2xsin(x) are read; Textus AI's check uses the fence's x range.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - a tool for Textus AI, `check_function_plot`
- **0.2.0** - curves and axes in the theme's colors, drawn again when the theme changes
- **0.1.3** - text in the theme's colors on Textus 1.3
- **0.1.2** - -x^2 reads as -(x^2), and a range that ends at 0 is kept
- **0.1.0-0.1.1** - first versions: functions of x drawn as a picture, height and range settings, pictures in exports

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `check_function_plot`：在把 ```function-plot 块写进文档之前检查它的源码（关于 x 的函数，每行一个，可用 + - * / ^、括号、pi、e 和常用函数），不实际绘制。返回 ok，或需要先修正的问题。传入时不带代码围栏，围栏上的参数（xmin=0 xmax=100）放在 meta 里。
<!-- /ai-tools -->

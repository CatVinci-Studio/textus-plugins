# 时间轴图

把事件画成时间轴，每行一个：时间 | 事件 | 说明。

## 画一条时间轴

- 写一个 `timeline` 代码块，每行一个事件：发生时间、发生了什么，再加一句可选的说明，用 `|` 分开。时间轴画在代码块下方；点进代码块可以再看到并修改源码。
- 事件按你写的顺序排在一条竖线上，每个事件一个圆点。“时间”可以是任何文字：日期、年份、“第 3 天”都行。
- 空行会跳过。第三个 `|` 之后的内容不显示。
- 在语言后面写 `height=400` 可以设置图的高度。
- 时间轴使用主题颜色，切换主题时会重新绘制。
- 导出 HTML、PDF、Word 时，时间轴会作为图片放进去。

## 示例

```timeline
2024-03 | 初稿 | 大纲和前两章
2024-09 | 审读 | 三位读者的意见
2025-01 | 出版
```

## 权限

只需要 **Textus AI 工具** 权限，让 Textus AI 在写入代码块前先检查一遍。它不读取任何文件，全部在本机绘制。

## 更新日志

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
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `check_timeline`：在把 ```timeline 块写进文档之前检查它的源码（每行一个事件，写成 时间 | 事件 | 补充），不实际绘制。返回 ok，或需要先修正的问题。传入时不带代码围栏。
<!-- /ai-tools -->

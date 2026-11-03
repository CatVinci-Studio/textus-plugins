# 时间轴图

按顺序排列的事件，每行一个：时间 | 事件 | 说明。

- 写一个 `timeline` 代码块，下方就会画出来；点进代码块可以再看到并修改源码。
- 在语言后面写 `height=400` 可以设置图的高度。
- 导出 HTML、PDF、Word 时，图会作为图片放进去。

## 示例

```timeline
2024-03 | First draft | The outline and two chapters
2024-09 | Review | Notes from three readers
2025-01 | Published
```

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `check_timeline`：在把 ```timeline 块写进文档之前检查它的源码（每行一个事件，写成 时间 | 事件 | 补充），不实际绘制。返回 ok，或需要先修正的问题。传入时不带代码围栏。
<!-- /ai-tools -->

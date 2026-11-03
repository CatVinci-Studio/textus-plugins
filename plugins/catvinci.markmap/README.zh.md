# 思维导图（Markmap）

把 Markdown 大纲（标题和列表）画成思维导图。

- 写一个 `markmap` 代码块，下方就会画出来；点进代码块可以再看到并修改源码。
- 在语言后面写 `height=400` 可以设置图的高度。
- 导出 HTML、PDF、Word 时，图会作为图片放进去。

## 示例

```markmap
# Project
## Goals
- Ship 1.3
- Write the guide
## People
- Writers
- Reviewers
```

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `check_markmap`：在把 ```markmap 块写进文档之前检查它的源码（以标题和列表项作为思维导图分支的 Markdown 大纲），不实际绘制。返回 ok，或需要先修正的问题。传入时不带代码围栏。
<!-- /ai-tools -->

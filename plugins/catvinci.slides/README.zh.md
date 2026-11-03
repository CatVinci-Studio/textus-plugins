# Marp

用 [Marp](https://marp.app) 的写法把文档做成幻灯片。

- 每个 `---` 开始新的一页。
- **插件 › 以幻灯片放映**：在文档旁边的标签页里显示幻灯片，随写作实时更新。← → 和空格翻页，**全屏**（或按 F）放映。
- **插件 › 导出幻灯片为 HTML**（或幻灯片里的**保存 HTML**）：在文档旁边保存 `名称.slides.html`，一个文件，任何浏览器都能直接放映。
- 用 Marp 指令选主题和版式，例如在开头写：

```markdown
---
theme: gaia
paginate: true
---
```

基于 [Marp Core](https://github.com/marp-team/marp-core)（MIT），自带主题（default、gaia、uncover）、公式和代码高亮，所以这个插件约 4 MB。

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `export_slides`：把当前文档按 Marp 幻灯片导出（每条 --- 分隔一页），在它旁边保存为一个 HTML 文件（name.slides.html），可在任何浏览器中放映。返回文件路径和页数。
<!-- /ai-tools -->

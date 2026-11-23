# MDX

用来写 MDX 文档——Docusaurus、Nextra 等建站工具用的、带组件的 Markdown。Textus
本身就能打开 `.mdx`，并把其中的 import、`{表达式}` 和组件按原样保留；这个插件再加上：

- **标出问题**：边写边用 MDX 官方编译器检查，第一个问题在出错处划线，写明第几行、错在哪。
- **预览 MDX**：在旁边画出文档。选项卡、提示框（`<Callout>`、`<Admonition>`、`:::tip`）和
  `<details>` 用 Textus 的样式画，其他组件画成写着名字和参数的卡片。文档里的代码一行都不运行。
- **另存为 Markdown / 另存为 MDX**：在文档旁边存一份副本。提示框变成 GitHub 提示块，选项卡变成
  带小标题的几段，里面没有内容的组件留成注释；反过来，花括号和 `<` 会被转义，注释和 `<br>`
  改成 MDX 要求的写法。

在“插件”菜单里，或在 `.mdx` 文档里右键就能找到。

## 权限

- **读取文档**：边写边检查、边画预览。
- **读写文件**：检查 Textus AI 指定的 .mdx 文件，把转换后的副本存到文档旁边。
- **Textus AI 工具**：让 Textus AI 检查它写的 MDX。

## 更新日志

- **0.1.3** - Its page is in every language Textus speaks. Its page receives Textus's messages by the API's current name.
- **0.1.2** - Its package lists the libraries it carries, with their licenses.
- **0.1.1** - Preview MDX on a phone, where the preview shows alone, draws the document it was opened from instead of an empty page.
- **0.1.0** - First version: problems underlined by MDX's compiler, Preview MDX, Save as Markdown and Save as MDX, and check_mdx for Textus AI.

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `check_mdx`：用 MDX 官方编译器检查 MDX，给出第一个问题和它的行、列。写完或改完 .mdx 文档后、说它能用之前先查。
<!-- /ai-tools -->

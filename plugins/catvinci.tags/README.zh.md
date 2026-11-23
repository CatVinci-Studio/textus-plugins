# 标签

在侧栏列出打开的文件夹里的每个 `#标签`，以及有多少篇笔记用到它。

- 侧栏的 **标签** 标签页列出所有标签，用得最多的在前面。嵌套标签（`#project/alpha`）和 Obsidian 一样显示成树，每个标签的数量也算上它下面各个子标签的笔记。在筛选框里输入文字可以缩小范围。
- 展开一个标签查看它的笔记，点一篇就打开。
- 在标签上右键，选 **重命名…**，会在所有笔记里一起改，它下面的嵌套标签也跟着改（`#project/alpha` 变成 `#new/alpha`）。标签不分大小写。改成一个已有的标签名，两个标签就合并成一个。标签由字母、数字、`_`、`-` 和 `/` 组成，不能全是数字。
- front matter 里的标签（`tags: [a, b]`，或 `tags:` 下面的列表）也会一起改；代码块、行内代码、链接地址，以及以它开头的更长标签（改 `#draft` 时的 `#drafts`）都不会被改动。

## 权限

- 读取文件：找出文件夹里的标签。
- 写入文件：在用到这个标签的笔记里改名。
- Textus AI 工具：让 Textus AI 能列出你的标签和带某个标签的笔记。

## 更新日志

- **0.3.6** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller.
- **0.3.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.3.4** - Renaming leaves `[[#Heading]]` links alone, and a ``` line inside a `~~~` block no longer ends the code.
- **0.3.3** - Tags match in any letter case, as their counts do; renaming a tag moves its nested tags too and no longer touches link addresses or front-matter tags like `project-x`; tags like `a/` or `a//b` are refused.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - Tags used equally often are listed in natural name order ("Week2" before "Week10").
- **0.3.0** - Nested tags form a tree, each counting the notes of the tags under it; Textus AI finds a tag's nested tags too.
- **0.2.0** - Textus AI can list your tags and the notes with a tag (`list_tags`, `notes_with_tag`).
- **0.1.0-0.1.1** - First versions: tags with their counts, a tag's notes, renaming and merging in every note; runs on desktop and iOS.

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `list_tags`：列出打开的文件夹中所有文档用到的 #标签，以及每个标签被多少篇文档使用，用得最多的排在前面。
- `notes_with_tag`：列出打开的文件夹中带有某个 #标签的文档，每篇带标题、路径和它的全部标签。
<!-- /ai-tools -->

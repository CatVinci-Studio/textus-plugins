# 乐谱（ABC）

把代码块里的 ABC 记谱法画成乐谱。

写一个语言为 `abc` 的代码块，乐谱会直接画在它下方；点进代码块可以再看到源码并修改。

- 小节会按栏宽自动换行，窄面板里音符也看得清。
- 音符使用主题的文字颜色，切换浅色和深色时会重新绘制。
- 导出 HTML、PDF、Word 时，乐谱会作为图片放进去。

支持桌面版和 iPhone，需要 Textus 1.3.2 或更新版本。插件只申请一项权限：Textus AI 工具，让 Textus AI 在把 `abc` 代码块写进文档前先检查它。

## 示例

```abc
X:1
T:Scale
M:4/4
L:1/4
K:C
C D E F | G A B c |
```

## 更新日志

- **0.3.4** - Its package lists the libraries it carries, with their licenses.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Bars wrap to the column instead of the whole score shrinking; clicking a note no longer turns it red; `check_abc` accepts full mode names, any note length, `+:` lines, `` ` `` and `$`; `height=` is gone.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - Textus AI can check an `abc` block before writing it (`check_abc`).
- **0.2.0** - The notes follow the theme's text color; needs Textus 1.3.2.
- **0.1.3** - Uses Textus's renamed document colors.
- **0.1.2** - Exported pictures keep the music's width and height.
- **0.1.0-0.1.1** - First versions: `abc` blocks drawn under their source, `height=`, pictures in exports; store page and icon.

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `check_abc`：在把 ```abc 块写进文档之前检查它的源码（ABC 乐谱记法：以 K: 结尾的字段头部，然后是音符），不实际绘制。返回 ok，或需要先修正的问题。传入时不带代码围栏。
<!-- /ai-tools -->

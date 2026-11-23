# LaTeX 补全

写公式时提示 LaTeX 命令。

- 在公式里（`$ … $` 之间或数学块中）输入反斜杠和命令的开头，比如 `\fr`、`\alp`。只输入一个反斜杠时，列出常用的命令。
- 列表里是匹配的命令，每个都附上它画出来的样子，共 200 多个，从 `\frac` 到 `\begin{pmatrix}`。以你输入的内容开头的命令排在前面，其次是包含它的，不分大小写。
- 按顺序输入命令里的字母也能找到它：`\rarr` 就是 `\rightarrow`，`\lra` 就是 `\leftrightarrow`。
- 按 **Enter** 或 **Tab** 写入选中的命令，光标停在花括号里；**Esc** 关闭列表。`\left(`、`\left[` 和 `\left\{` 会连同对应的 `\right` 一起写入。

支持桌面版和 iPhone，需要 Textus 1.3.0 或更新版本。插件只申请一项权限：读取编辑器，用来看到你在公式里输入的内容。

## 更新日志

- **0.1.5** - The store description now opens with what the plugin does.
- **0.1.4** - A command typed out whole comes first, so Enter keeps it (\in stays \in); a command without braces is written with a space after it; with Textus 1.3.13 the list closes once a command is written.
- **0.1.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.2** - Says where it runs: desktop and iPhone.
- **0.1.0-0.1.1** - First versions: over 200 commands with what each draws, letters in order, braces and caret in place, growing bracket pairs; store page and icon.

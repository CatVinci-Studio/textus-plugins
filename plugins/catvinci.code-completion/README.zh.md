# 代码补全

在代码块里输入时提示关键字。

- 在写了语言的代码块里（比如 ` ```python `）输入一个词的开头：打两个字母，就会列出这门语言里以此开头的关键字和内置名称，以及光标附近已经写过的词。
- 开头完全一样的排在前面，其次是不分大小写也一样的，短的在前。在 SQL 里，`sel` 写入 `select`，`SEL` 写入 `SELECT`。
- 按 **Enter** 或 **Tab** 写入选中的词；**Esc** 关闭列表。
- 支持的语言：Python、JavaScript、TypeScript、Java、C 和 C++、C#、Go、Rust、Kotlin、Swift、Ruby、PHP、Lua、R、Dart、Scala、SQL、MySQL、Shell（sh、bash、zsh）和 PowerShell，代码块开头写常用的名字就行（`js`、`py`、`rs`、`sh` 等）。别的语言或没写语言的代码块，只提示块里已有的词。

关键字列表来自 Monaco Editor（MIT 许可）。支持桌面版和 iPhone，需要 Textus 1.4.8 或更新版本。插件只申请一项权限：读取编辑器，用来看到你在代码块里输入的内容。

## 更新日志

- **0.1.0** - First version: keywords of 20 languages and the words near the caret.

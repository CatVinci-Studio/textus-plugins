# Code Completion

Suggests keywords while you type in a code block.

- In a code block with a language, such as ` ```python `, type the start of a word: two letters bring up the language's keywords and built-in names that begin so, and the words already written near the caret.
- Words that begin exactly as typed come first, then those that do ignoring case, shortest first. In SQL, `sel` writes `select` and `SEL` writes `SELECT`.
- **Enter** or **Tab** writes the one picked; **Esc** closes the list.
- Languages: Python, JavaScript, TypeScript, Java, C and C++, C#, Go, Rust, Kotlin, Swift, Ruby, PHP, Lua, R, Dart, Scala, SQL, MySQL, Shell (sh, bash, zsh) and PowerShell, by their usual names after the fence (`js`, `py`, `rs`, `sh` …). In a block of another language, or none, only the words already in the block are offered.

The keyword lists come from the Monaco Editor (MIT). It works on desktop and iPhone and needs Textus 1.4.8 or later. It asks for one permission, to read the editor, so it can see what you type in the code block.

## Changes

- **0.1.0** - First version: keywords of 20 languages and the words near the caret.

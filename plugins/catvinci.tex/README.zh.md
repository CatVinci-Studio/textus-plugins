# TeX

把 LaTeX 和 BibTeX 文件（.tex、.bib、.sty、.cls）当纯文本打开来改，命令、注释和字段都上色，方便顺手改改论文。不负责编译。

## 能做什么

- `.tex`、`.ltx`、`.sty`、`.cls` 文件按原文打开，直接能改：命令、括号、`%` 注释和 `$…$` 公式按 LaTeX 上色。
- `.bib` 文件也一样：条目类型（`@article`）、引用键、字段名和字段值各有颜色。
- 不会被当成 Markdown 读，除了你打的字什么都不改：保存下来和你留下的一模一样。
- `bibtex 或 `bib 代码块也会上色。
- 颜色跟着主题走。查找（Cmd/Ctrl+F）、撤销、缩放和源码模式里一样。

不装插件时，这些文件也按纯文本显示，但只读。

## 权限

不需要。它只告诉 Textus 哪些文件按文本打开、怎么上色，不运行代码。

## 更新日志

- **0.1.0** - First version: LaTeX and BibTeX files edited as coloured plain text. Needs Textus 1.4.8-rc.3.

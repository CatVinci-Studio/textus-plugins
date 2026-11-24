# Logseq 文件夹

按 Logseq 的写法打开 Logseq 图谱：按页面名链接，图片放在 assets，日记用它的文件夹和日期格式。

## 它做什么

- 打开的文件夹（或它上面的文件夹）是以文件保存的 Logseq 图谱（有 `logseq/config.edn`）时，Textus 按页面名写链接（`[[页面]]`），从链接新建的页面放进 `pages/`（或你的 `:pages-directory`），每日笔记把日记放进 `journals/`，按你的 `:journal/file-name-format` 命名。
- Logseq 的图片文件夹 `assets/` 会在角落的卡片上提出一次。采用后写进这个文件夹的 `.textus/settings.json`；保留当前设置，Textus 就不再问。
- 没有这个插件，图谱里的双链也会从图谱的文件夹开始查找。

## 权限

只需要 **读取打开的文件夹里的文件**：Textus 把 `logseq/config.edn` 交给它，它说明这个文件的意思。它不改任何东西。

## 更新日志

- **0.1.2** - A simpler icon, drawn in the text colour.
- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it.
- **0.1.0** - First version: Logseq's settings offered when a Logseq graph is opened. Needs Textus 1.4.6.

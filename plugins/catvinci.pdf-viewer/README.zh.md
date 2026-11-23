# PDF 阅读器

在笔记旁边的标签页里打开 PDF，可以阅读、查找和复制文字。

- 从侧栏打开 PDF，或者把它拖进窗口。指向 PDF 某一页的链接，会直接打开到那一页。
- 滚动翻页，或者用箭头按钮到上一页、下一页。
- 用按钮、**Ctrl+滚轮**（Mac 上是 **⌘+滚轮**）或双指缩放。页面会围绕指针立刻放大缩小，停下后再变清晰。
- PDF 打开时适应窗口宽度，调整窗口大小时也跟着变。点百分比可以在适应宽度和原始大小之间切换。
- 选中文字可以复制到笔记里。
- 按 **Ctrl+F**（Mac 上是 **⌘F**）或点放大镜，在 PDF 里查找文字并高亮：**Enter** 跳到下一处所在的页面，**Shift+Enter** 往回，**Esc** 关闭。
- 再次打开 PDF 时，回到上次看到的页面和缩放比例。会记住最近 200 个 PDF。
- 没有嵌入字体的中文、日文、韩文 PDF 也能显示文字，扫描页会显示图片。打不开的文件会说明原因。

这个插件不需要任何权限：你打开的 PDF 由 Textus 交给它。

## 更新日志

- **0.2.8** - Its package lists the libraries it carries, with their licenses.
- **0.2.7** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.2.6** - Zoom buttons and keys step by 1.25×, as the other viewers do.
- **0.2.5** - A long PDF scrolled end to end holds far less memory: pages out of sight let go of their pictures too.
- **0.2.4** - Its bar wraps in a narrow panel, and find no longer mixes in results for an earlier word.
- **0.2.3** - Its bar keeps Textus's one order: what it shows, then find and zoom.
- **0.2.2** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.2.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.0** - Textus's own controls. Needs Textus 1.3.2.
- **0.1.3** - Textus 1.3's look; the buttons follow the interface language when it changes.
- **0.1.2** - Scanned pages show their images, links to a page work, pages out of sight free their memory, unreadable files say so; opens at the window's width; zoom stretches around the pointer and then turns sharp.
- **0.1.0-0.1.1** - First versions: pages, zoom, text to select and copy, find, reopening where you left off, Chinese, Japanese and Korean text without embedded fonts.

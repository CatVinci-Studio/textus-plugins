# Excalidraw

在 Textus 的标签页里用 [Excalidraw](https://excalidraw.com) 画手绘风格的图。

从侧边栏打开一个 `.excalidraw` 文件，或者在插件菜单里选**新建绘图**，绘图会占满一个标签页，用的就是 Excalidraw 自己的工具：形状、箭头、文字、图片和素材库。画的内容会随时保存到文件里。

- 用 Obsidian 的 Excalidraw 插件画的图（`.excalidraw.md`）也能打开和保存。笔记的 front matter 和其他部分保持原样，原来压缩的绘图数据仍然压缩，图里文字的列表会重新写好，搜索照样能找到。笔记链接的图片也会显示。
- 页面跟随 Textus 的语言和浅色、深色模式。
- 打开期间如果文件在别处被改了，标签页会显示新的绘图；保存时不会覆盖别处的修改。
- 插件自带 Excalidraw 的手写字体，但不含它的中文字体，所以中文和日文用系统字体显示。

插件需要读写文件：读取绘图和它链接的图片，只写入你正在编辑的绘图。桌面端和 iPhone、iPad 都能用。

## Changes

- **0.1.0** - 第一个版本：在标签页里用 Excalidraw 编辑 `.excalidraw` 文件和 Obsidian Excalidraw 的绘图。

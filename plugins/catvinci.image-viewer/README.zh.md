# 图片查看器

在标签页里打开图片和 SVG 文件，可以缩放、旋转，还能查看 SVG 源码。

## 查看图片

- 在侧边栏打开 PNG、JPEG、GIF、WebP、AVIF、BMP、ICO 或 SVG 文件，或者直接拖进窗口。图片在自己的标签页里打开，默认适应窗口。
- 顶栏显示图片的像素尺寸和文件大小。
- 用 **−**、**+** 按钮或 **Ctrl+滚轮**（Mac 上是 **⌘+滚轮**）缩放。点百分比可以在适应窗口和原始大小之间切换。
- 放大后可以拖动图片四处查看。双击在适应窗口和原始大小之间切换，原始大小会对准双击的位置。
- **旋转** 按钮每次转 90 度。只是显示转了，文件本身不变。
- 快捷键：**+** 和 **-** 缩放，**0** 原始大小，**F** 适应窗口，**R** 旋转。
- 打开 SVG 时，**源码** 显示它的代码，方便阅读或复制；**图片** 切换回来。SVG 按图片显示，里面的脚本不会运行。
- 文件不存在或不是图片时，会直接说明，不会显示空白标签页。

## 权限

不需要任何权限。它只读取你打开的那个文件。

## 更新日志

- **0.2.6** - Its page no longer says which devices it runs on: the store shows that.
- **0.2.5** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.2.4** - A turned and zoomed picture now scrolls to every edge, and a sideways picture fits the window. Zoom and turn are kept when the panel moves, a fourth turn no longer spins back, and the bar fits a narrow panel.
- **0.2.3** - A trackpad pinch zooms smoothly, in step with the gesture; with Textus 1.3.13 a pinch on a Mac zooms the picture, not the document behind it. Its bar keeps Textus's one order: what it shows, then find and zoom.
- **0.2.2** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.2.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.0** - Textus's own buttons and tab bar; labels follow the interface language when it changes
- **0.1.3** - colors from Textus 1.3's themes
- **0.1.2** - the percentage switches between fit and actual size
- **0.1.0-0.1.1** - first versions: zoom, fit, drag, rotate, keys, an SVG's source, and a message for a file that can't be opened

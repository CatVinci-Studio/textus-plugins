# 圖片檢視器

在分頁中開啟圖片和 SVG 檔案，可以縮放、旋轉，還能查看 SVG 原始碼。

## 檢視圖片

- 在側邊欄開啟 PNG、JPEG、GIF、WebP、AVIF、BMP、ICO 或 SVG 檔案，或直接拖進視窗。圖片會在自己的分頁中開啟，預設符合視窗。
- 上方列顯示圖片的像素尺寸和檔案大小。
- 用 **−**、**+** 按鈕或 **Ctrl+滾輪**（Mac 上是 **⌘+滾輪**）縮放。點百分比可以在符合視窗和原始大小之間切換。
- 放大後可以拖曳圖片四處查看。按兩下會在符合視窗和原始大小之間切換，原始大小會對準按兩下的位置。
- **旋轉** 按鈕每次轉 90 度。只有顯示會轉，檔案本身不變。
- 快速鍵：**+** 和 **-** 縮放，**0** 原始大小，**F** 符合視窗，**R** 旋轉。
- 開啟 SVG 時，**原始碼** 會顯示它的程式碼，方便閱讀或複製；**圖片** 切換回來。SVG 以圖片顯示，裡面的指令碼不會執行。
- 檔案不存在或不是圖片時，會直接說明，不會顯示空白分頁。

## 權限

不需要任何權限。它只讀取你開啟的那個檔案，桌面版和 iOS 都能使用。

## 更新紀錄

- **0.2.5** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.2.4** - A turned and zoomed picture now scrolls to every edge, and a sideways picture fits the window. Zoom and turn are kept when the panel moves, a fourth turn no longer spins back, and the bar fits a narrow panel.
- **0.2.3** - A trackpad pinch zooms smoothly, in step with the gesture; with Textus 1.3.13 a pinch on a Mac zooms the picture, not the document behind it. Its bar keeps Textus's one order: what it shows, then find and zoom.
- **0.2.2** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.2.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.0** - Textus's own buttons and tab bar; labels follow the interface language when it changes
- **0.1.3** - colors from Textus 1.3's themes
- **0.1.2** - the percentage switches between fit and actual size
- **0.1.0-0.1.1** - first versions: zoom, fit, drag, rotate, keys, an SVG's source, and a message for a file that can't be opened

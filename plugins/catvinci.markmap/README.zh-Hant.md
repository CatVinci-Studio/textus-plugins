# 心智圖（Markmap）

在程式碼區塊裡寫由標題和清單組成的 Markdown 大綱，畫成心智圖。

寫一個語言為 `markmap` 的程式碼區塊，在裡面寫大綱：標題（`#`、`##`）和清單項目就是心智圖的分支。區塊下方會畫出心智圖；點進區塊可以再次檢視和修改原始碼。

- 拖曳心智圖可以移動，也可以放大縮小。點分支上的圓點可以收合或展開它。
- 在語言後面寫 `height=400` 可以設定心智圖高度（單位為像素，預設 360）。
- 分支顏色跟著佈景主題，切換主題時會重新繪製。
- 匯出 HTML、PDF、Word 時，心智圖會以圖片放進去，捲到看不見的心智圖也一樣。

外掛以 [markmap](https://markmap.js.org) 繪製。它只要求一項權限：為 Textus AI 提供下方列出的 `check_markmap` 工具，讓它把區塊寫進文件前先檢查一遍。電腦、iPhone 和 iPad 上都能使用。

## 範例

```markmap
# Project
## Goals
- Ship 1.3
- Write the guide
## People
- Writers
- Reviewers
```

## 更新紀錄

- **0.3.8** - The mind map fills its block: a small one grows (up to twice its size) to the block's width and the height you give it, and it follows the note's zoom instead of being cut off on the right. Its page no longer says which devices it runs on: the store shows that.
- **0.3.7** - Its package lists the libraries it carries, with their licenses.
- **0.3.6** - A mind map drawn before its note was laid out no longer shows an error.
- **0.3.5** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.4** - Editing a mind map for a long time no longer makes Textus use more and more memory.
- **0.3.3** - Scrolling over a mind map now scrolls the note; pinch or Ctrl-scroll to zoom. The map uses your theme's font and colors, in dark mode too, and opens fully fitted.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - A mind map scrolled out of sight exports as its picture instead of its source.
- **0.3.0** - Textus AI can check a `markmap` block before it writes one.
- **0.2.0** - Branch colors come from the theme's tones. Needs Textus 1.3.2.
- **0.1.3** - Uses the theme's document text color and footnote size under their Textus 1.3 names.
- **0.1.0-0.1.2** - First versions: `markmap` code blocks drawn in the document, `height=`, and exports as a picture in the export's colors.

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `check_markmap`：在把 ```markmap 區塊寫進文件之前檢查它的原始碼（以標題和清單項目作為心智圖分支的 Markdown 大綱），不實際繪製。回傳 ok，或需要先修正的問題。傳入時不帶程式碼圍欄。
<!-- /ai-tools -->

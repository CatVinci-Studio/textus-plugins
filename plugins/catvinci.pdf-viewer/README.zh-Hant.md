# PDF 閱讀器

在筆記旁的分頁裡開啟 PDF，可以閱讀、搜尋和拷貝文字。

- 從側邊欄開啟 PDF，或把它拖進視窗。指向 PDF 某一頁的連結，會直接開到那一頁。
- 捲動翻頁，或用箭頭按鈕到上一頁、下一頁。
- 用按鈕、**Ctrl+滾輪**（Mac 上是 **⌘+滾輪**）或雙指縮放。頁面會以指標為中心立刻放大縮小，停下後再變清晰。
- PDF 開啟時符合視窗寬度，調整視窗大小時也會跟著變。點百分比可以在符合寬度和原始大小之間切換。
- 選取文字可以拷貝到筆記裡。
- 按 **Ctrl+F**（Mac 上是 **⌘F**）或點放大鏡，在 PDF 裡尋找文字並標亮：**Enter** 跳到下一個出現的頁面，**Shift+Enter** 往回，**Esc** 關閉。
- 再次開啟 PDF 時，會回到上次看到的頁面和縮放比例。會記住最近 200 個 PDF。
- 沒有內嵌字型的中文、日文、韓文 PDF 也能顯示文字，掃描頁會顯示圖片。開不了的檔案會說明原因。

這個外掛不需要任何權限：你開啟的 PDF 由 Textus 交給它。

## 更新紀錄

- **0.2.9** - Its page shows its list of changes in English in every language. Its page receives Textus's messages by the API's current name.
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

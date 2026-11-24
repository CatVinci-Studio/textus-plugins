# Marp

用 [Marp](https://marp.app) 的寫法，把文件當成投影片放映。

## 製作投影片

- 每個 `---` 開始一張新投影片。
- **外掛程式 › 以投影片播放** 會在文件旁邊的分頁裡顯示投影片，隨你的寫作即時更新。← →（或 ↑ ↓、Page Up 和 Page Down）和空白鍵可以切換投影片；**全螢幕**（或 F）開始放映。放映時，點一下投影片左邊三分之一處回到上一張，點其他地方則到下一張，左右滑動也一樣；碰一下投影片或移動指標會出現 **結束放映**，也可以按 Esc。
- Marp 的指令決定主題和版式，例如寫在最上方：

```markdown
---
theme: gaia
paginate: true
---
```

- 圖片會顯示在投影片裡，包括 Obsidian 的 `![[photo.png]]`；`![[photo.png|300]]` 設定寬度（`300x200` 同時設定寬和高）。

## 儲存投影片

**外掛程式 › 匯出投影片為 HTML**（或投影片裡的 **儲存 HTML**）會在文件旁邊存一個 `name.slides.html`：一個檔案，在任何瀏覽器裡都能自己放映，按鍵也一樣。圖片是從文件所在的資料夾連結的，所以請把這個檔案和圖片放在一起。文件必須先儲存。

以 [Marp Core](https://github.com/marp-team/marp-core)（MIT）為基礎，它帶來主題（default、gaia、uncover）、數學公式和程式碼醒目提示，也讓這個外掛大約有 4 MB。

## 權限

- **讀取文件**：在你寫作時畫出投影片。
- **讀寫檔案**：找到要顯示的圖片，並把 HTML 投影片存在文件旁邊。
- **Textus AI 工具**：讓 Textus AI 能替你儲存投影片。

## 更新紀錄

- **0.3.14** - Its icon is Marp's own logo.
- **0.3.13** - The deck no longer stays blank when no document is in front - in Source Mode or Source and Preview, or presented from the plugin's page: it shows the document open in another tab, as last saved, or says to click one. Slides scale to their frame on a Mac, iPhone and iPad, in the tab and in a saved deck opened in Safari.
- **0.3.12** - Presenting on a phone or tablet: tap or swipe to move between slides, and Exit to stop - no keyboard needed. A click moves on in full screen too, as in a saved deck. In a narrow tab, Save HTML goes into the ⋯ menu instead of pushing Full Screen onto a second row. Its page is in every language Textus speaks.
- **0.3.11** - Its package lists the libraries it carries, with their licenses.
- **0.3.10** - Code kept for Textus versions it no longer runs on is gone. From Textus 1.4.4 the deck is also in File › Export, as Slides (HTML).
- **0.3.9** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.3.8** - Present as Slides draws the deck on a phone, where its tab comes to the front alone.
- **0.3.7** - Formulas use KaTeX's own fonts from Textus 1.4.2 on, in the tab and in a saved HTML file; earlier versions keep the system's fonts.
- **0.3.6** - A deck needs nothing from the web: emoji show as text instead of pictures from a CDN, formulas use the system's fonts, and the Gaia theme no longer loads a web font, in the tab and in a saved HTML file.
- **0.3.5** - Writing a deck with many pictures is lighter: the slides are made again only when the text changed, and pictures it no longer shows are let go.
- **0.3.4** - Full Screen works in the tab (presenting in place where the window can't go full screen); the deck renders only while its tab is open; shortcuts leave Cmd/Ctrl/Alt keys alone.
- **0.3.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - pictures in the deck, including Obsidian's `![[picture]]` embeds with a width
- **0.3.0** - a tool for Textus AI, `export_slides`
- **0.2.0** - named Marp in every language; Textus's own buttons and colors; labels follow the interface language
- **0.1.0-0.1.1** - first versions: a live deck beside the document, full screen, and a self-presenting HTML file

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `export_slides`：把目前文件依 Marp 投影片匯出（每條 --- 分隔一頁），在它旁邊儲存為一個 HTML 檔（name.slides.html），可在任何瀏覽器中放映。回傳檔案路徑和頁數。
<!-- /ai-tools -->

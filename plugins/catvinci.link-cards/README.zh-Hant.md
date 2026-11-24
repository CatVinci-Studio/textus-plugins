# 連結卡片

把連結顯示成一張卡片，帶有網頁的標題、簡介和圖片；Bilibili 影片則直接在文中播放。

## 製作卡片

- 輸入 `/`，選 **插入連結卡片…**，再貼上連結。或者在文中選取一個連結，按右鍵選 **插入連結卡片…**，把它變成卡片。
- 卡片顯示網頁的標題、簡介、圖片和網站名稱。點一下就會在瀏覽器裡開啟網頁。
- Bilibili 連結會直接在卡片裡播放影片。YouTube 連結會顯示成帶有影片截圖的卡片，在瀏覽器裡開啟。
- 如果讀不到網頁（離線，或不是網頁），卡片只會顯示網址。

## 保存的內容

卡片是一個 `card` 區塊，保存了網頁上的資訊，所以不連網也能顯示，在任何 Markdown 軟體裡也能當文字閱讀：

````markdown
```card
url: https://textus.md
title: Textus
description: A Markdown editor with AI that writes with you.
image: https://textus.md/og.png
```
````

- 卡片右鍵選單裡的 **重新取得**，會抓取網頁最新的標題和圖片。
- 來自 Obsidian 的卡片也能顯示：Auto Card Link 的 `cardlink` 區塊和 Link Embed 的 `embed` 區塊都會畫成卡片，並保持原本的寫法。

## 權限

- **網路（任何位址）**：讀取你要做成卡片的網頁。它只抓取這些連結。
- **讀取和編輯文件**：讀取選取的連結，並插入卡片。
- **Textus AI 工具**：讓 Textus AI 能替連結做一張卡片。

## 更新紀錄

- **0.5.1** - Its page is in every language Textus speaks. Needs Textus 1.4.4 itself, not a test version of it.
- **0.5.0** - Right-click a selected web address for Turn into a Link Card; the item no longer shows for other selections. Needs Textus 1.4.4.
- **0.4.3** - Pictures and site icons show again; titles with an apostrophe are kept whole; **Fetch again** moved into the card's right-click menu; YouTube links show as cards with the video's still.
- **0.4.2** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.0** - Obsidian's `cardlink` (Auto Card Link) and `embed` (Link Embed) blocks are drawn as cards
- **0.3.1** - the README's example links to textus.md
- **0.3.0** - a tool for Textus AI, `fetch_link_card`
- **0.2.0** - Textus's own buttons and colors (Textus 1.3.2)
- **0.1.0-0.1.1** - first versions: link cards kept in a `card` block, video players, **Fetch again**

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `fetch_link_card`：擷取網頁的標題、簡介、配圖和網站名稱，連同一個把連結顯示成卡片的 ```card 區塊一起回傳，可插入到使用者想要的位置。
<!-- /ai-tools -->

# 快速預覽

不用開啟，就能看到連結指向的內容：把滑鼠停在指向其他文件的連結上，旁邊的卡片會顯示它的文字。

- 把滑鼠停在指向其他文件的連結上，Markdown 連結或 [[雙向連結]] 都可以。
- 旁邊會出現一張卡片，顯示那篇文件的開頭（不含開頭屬性）。連結指向某個標題（`#標題`）時，顯示那一節；指向某個區塊（`#^id`）時，顯示那一段。
- 卡片最多顯示約 1500 個字元，在段落結尾處截斷。**開啟** 跳到那篇文件；**釘住** 讓卡片在你寫作時一直開著。
- 只預覽目前開啟的資料夾裡的文件。

外掛要求讀取編輯器（知道你指著哪個連結）和讀取檔案（顯示被連結的文件）的權限，從不修改檔案。電腦、iPhone 和 iPad 上都能使用。

## 更新紀錄

- **0.2.3** - The store description now opens with what the plugin does.
- **0.2.2** - A link to a nested heading (`[[Note#A#B]]`) shows that heading's section, as a click opens it. Needs Textus 1.4.0.
- **0.2.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.0** - A link to a block (`#^id`) shows that block. Needs Textus 1.3.9.
- **0.1.3** - Says where it runs: the desktop, iPhone and iPad.
- **0.1.2** - The card's length is fixed instead of a setting.
- **0.1.0-0.1.1** - First versions: a card for links to documents, with the document's opening or the section the link names, and Open and Pin.

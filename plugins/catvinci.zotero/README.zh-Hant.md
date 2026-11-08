# Zotero

寫作時直接引用 Zotero 文獻庫裡的文獻。

- 需要 Zotero 7 或更新版本（包括 Zotero 10）正在執行，並在 **Settings › Advanced › Allow other applications on this computer to communicate with Zotero** 中開啟該選項。
- 按 **Ctrl+Alt+R**（Mac 上為 **⌘⌥R**），或按右鍵 › **從 Zotero 插入引用…**，或從外掛程式選單：最近引用過的文獻排在最前面，後面是文獻庫搜尋。
- 如果選取了文字，就會用選取的文字去搜尋。
- 選一筆文獻，引用就會插在游標處。
- **外掛程式 › 插入參考文獻列表** 會在文件末尾加上本文引用的所有文獻。
- **外掛程式 › 從 Zotero 新增文獻筆記…** 在 References 裡建立 `@citekey.md`（已存在就直接開啟），填入標題、作者、年份、摘要、DOI 或網址，以及 Zotero 裡的標註和筆記。可以指定範本檔案；在 Obsidian 儲存庫裡，依照 Zotero Integration 或 Citations 外掛的資料夾和範本。
- 引用也可以寫成 Obsidian 的 `[[@citekey]]`：連結到那篇文獻筆記，插入引用後會詢問要不要建立。
- 引用的寫法可以在外掛程式的設定中修改。

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `search_library`：搜尋這台電腦上使用者的 Zotero 文獻庫（需要 Zotero 7 或更新版本正在執行）：給出每個項目的 key、標題、作者、年份、類型、出處、引用鍵，以及依使用者所選格式要插入的引文。連不上 Zotero 時會失敗並說明該怎麼做。
<!-- /ai-tools -->

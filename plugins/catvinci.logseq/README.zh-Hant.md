# Logseq 資料夾

依照 Logseq 的寫法開啟 Logseq 圖譜：依頁面名稱連結，圖片放在 assets，日記使用它的資料夾和日期格式。

## 它做什麼

- 當你開啟的資料夾（或它上層的資料夾）是以檔案保存的 Logseq 圖譜（裡面有 `logseq/config.edn`）時，Textus 會依頁面名稱寫連結（`[[頁面]]`），把從連結建立的頁面放進 `pages/`（或你的 `:pages-directory`），日曆與每日筆記則把日記放在 `journals/`，並依你的 `:journal/file-name-format` 命名。
- Logseq 的圖片資料夾 `assets/` 會在角落的卡片上提議一次。接受的話，會記在資料夾的 `.textus/settings.json` 裡；保留你自己的設定，Textus 就不會再問。
- 即使沒有這個外掛，圖譜裡的雙向連結也會從圖譜的資料夾找起。

## 權限

只要求 **讀取開啟的資料夾中的檔案**：Textus 把 `logseq/config.edn` 交給它，由它說明這個檔案的意思。它不會修改任何東西。

## 更新紀錄

- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it.
- **0.1.0** - First version: Logseq's settings offered when a Logseq graph is opened. Needs Textus 1.4.6.

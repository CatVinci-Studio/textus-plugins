# Notion 匯入

把 Notion 匯出檔轉成開啟的資料夾裡的一般 Markdown 檔案，Obsidian 也能讀。

頁面和子頁面、圖片和附件、它們之間的連結，以及以 Obsidian Bases 格式寫成的資料庫，全都會一起搬過來。

1. 在 Notion 裡選 **Settings › Export all workspace content**，格式選 **Markdown & CSV**，並包含子頁面。把它給你的 .zip（或解壓後的資料夾）放進 Textus 開啟的資料夾。
2. 選 **外掛程式 › 從 Notion 匯入…**（或在側邊欄的 .zip 上按右鍵），再選擇匯出檔。很大的匯出檔如果在一個 zip 裡分成 Part-1.zip、Part-2.zip…，會被當成一份開啟。超過 256 MB 的 .zip 太大，無法一次讀取：請把它解壓縮到開啟的資料夾，再選那個資料夾。
3. 替匯入的目標資料夾取個名字（沒輸入的話是 **Notion**）；那裡原有的東西都不會改動。進度列可以讓你取消，已經寫好的內容會保留。最後會開啟一份報告頁面；如果裝了 **知識庫**，側邊欄會把匯入的內容顯示成頁面樹。

## 會變成什麼

- **頁面**：有子頁面的頁面（包括有子頁面的資料庫列）會變成一個資料夾，頁面放在裡面，例如 `Plans/Plans.md`，子頁面就在它旁邊；沒有子頁面的頁面則是一個檔案，例如 `Plans.md`。名稱裡不會留下 Notion 的 id；資料庫列的頁面會使用完整標題，Notion 在檔名裡會把標題截短。
- **資料庫**：每個資料庫會變成一個資料夾，裡面有一個含 `base` 區塊的頁面，各種檢視點一下就能切換：有狀態時是看板，還有表格，有日期時還有日曆。每一列都是那個資料夾裡的一篇筆記，屬性寫在它的 front matter 裡：日期寫成 2026-01-04，還有核取方塊、數字、清單，關聯則寫成連結。其他頁面顯示了某個資料庫的地方，這裡也會照樣顯示，並依匯出檔的排序。Notion 裡空白的「Untitled」列和頁面會略過。
- **圖片和附件** 放進顯示它們的頁面旁邊的 `assets` 資料夾；貼上的圖片會以所在頁面命名。
- **連結**：頁面之間、指向圖片和附件的連結，都會跟著新名稱更新。指向沒有匯出的頁面的連結，會列在報告裡。
- **頁面之間的連結**：開始時會問你要用哪一種：標準連結（建議）`[Page](Page.md)`，也就是 Notion 匯出的寫法，任何軟體都能開啟；或是 Obsidian 寫法的 `[[雙向連結]]`。匯入的資料夾會記住這個選擇，之後在裡面新建的頁面也會用同樣的方式連結。
- **標註** 會變成提示區塊（`> [!NOTE]`），保留它的表情符號。摺疊區塊保留為 `<details>`。

**頁面圖示**：Notion 的 Markdown 匯出不包含頁面圖示。把同一批頁面再匯出一份 HTML，在匯入時詢問的地方選它，頁面的表情符號圖示就會一起帶過來。

**留在原處的**：Notion 的匯出沒有封面、留言，也沒有已儲存檢視的篩選條件，所以這些不會帶過來；檢視的排序則會。公式和彙總屬性保留匯出時的值，提及的人和日期會變成一般文字。

## 報告

報告會統計匯入了哪些內容，列出找不到的連結、無法讀取或寫入的檔案，以及改動過的區塊，並推薦能處理其餘部分的外掛：首先是知識庫，用於頁面樹和資料庫；接著是雙向連結、快速預覽、任務、連結卡片、PDF 閱讀器和範本，每一個都只在匯入內容用得上時才推薦。**外掛程式 › Notion 匯入後推薦的外掛…** 會讓你選一個安裝；Textus 會先問你，什麼都不會自行安裝。

## 權限

一切都在你的裝置上進行：外掛只讀寫開啟的資料夾中的檔案，從不使用網路。需要 Textus 1.3.10 以上版本。

## 更新紀錄

- **0.7.13** - A simpler icon, drawn in the text colour.
- **0.7.12** - Its page is in every language Textus speaks. In Chinese, a database is 数据库, and 知识库 is only the Wiki plugin's name. Every language calls the Wiki plugin by its current name.
- **0.7.11** - Its package lists the libraries it carries, with their licenses.
- **0.7.10** - The database code it shares with Database brought up to date (its file columns filled).
- **0.7.9** - Databases it makes keep a view another plugin draws (Textus 1.4.6).
- **0.7.8** - The import report gets a free name as it is written (Textus 1.4.3).
- **0.7.7** - Bundles the Wiki plugin's newer base code; importing works as before.
- **0.7.6** - Importing a database with many rows is quicker.
- **0.7.5** - Page icons now come through from an unzipped HTML export too, and such an export shows up when you pick where the icons come from.
- **0.7.4** - Shares the database's updated filter code: a filter ticking several values reads the same in both. Shorter help and empty-state text.
- **0.7.3** - Once imported, the sidebar goes into the new folder (Textus 1.3.12) and shows its pages tree. Notion's blank rows and pages - no title, nothing written, only the "Not started" status Notion fills in - are left out.
- **0.7.2** - A database that sits under a page (as in Notion) stays a link on that page, no longer also shown there as a table; its own page shows it. Its code is split into smaller files by what each part does.
- **0.7.1** - Shares Two-way Links' fix for working out how a note links.
- **0.7.0** - asks how the pages link: standard links (recommended), as Notion exports them, or [[wiki links]] - a path shown by the page's name; the imported folder keeps the choice for pages made in it later
- **0.6.1** - Calls Workspace by its name in the import report and in the suggested plugins.
- **0.6.0** - Dates written by Textus itself; needs Textus 1.3.10.
- **0.5.0** - Page emoji icons, from Notion's HTML export of the same pages.
- **0.4.0** - Its own plugin again: pages with sub-pages as folders, databases as Obsidian bases, empty "Untitled" pages left out, and the import opened in Workspace's pages tree.
- **0.3.0** - Merged into Workspace for a while; this version only pointed there.
- **0.2.2** - One database block per database, opening on the board when there is a status.
- **0.2.1** - Asks what to name the import's folder; pasted pictures are named after their page.
- **0.2.0** - Reads Notion's newer exports: no doubled pages or rows, rows keep their whole titles, attachments go beside the page that uses them, databases shown on other pages keep their sort.
- **0.1.1** - The report suggests Two-way Links by its new name.
- **0.1.0** - First version: a Notion export (.zip or folder) into a folder of Markdown, ids out of names, links rewritten, databases as notes with front matter, callouts as notes, a report with plugins that help.

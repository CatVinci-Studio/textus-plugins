# Git

用於以 Git 管理的資料夾：

- 上次提交後改過的檔案，會在側邊欄標出來：**M** 已修改，**A** 已新增，**U** 新檔案、尚未加入 Git，**R** 已重新命名，**!** 有衝突。
- 在改過的文件裡，含有上次提交中沒有的行（以儲存的內容為準）的段落、標題或清單，右側邊緣會有一個標記；點一下就會提交（Textus 1.4.4）。
- 狀態列顯示分支，↑ 是待推送的提交，↓ 是待拉取的提交；點一下就會提交。
- **提交變更…**（「外掛程式」選單，或點分支）列出改過的檔案，並預先勾選目前的文件；你寫好說明，你自己的 Git 只提交這些檔案，它的鉤子和簽署照常執行。在一個資料夾裡第一次提交前會先問你。
- **推送** 和 **拉取**（「外掛程式」選單）把分支推送到它的遠端分支，或把遠端的提交拉取回來，使用你自己的 Git 和它已儲存的憑證；如果它要求登入，請先在終端機裡用 Git 登入一次。還沒有遠端分支的分支會推送到 `origin`。會產生衝突的拉取會被撤銷，什麼都不會改變，並告訴你（Textus 1.4.6）。
- 搭配版本紀錄 0.4，文件的提交會顯示在它的版本之中，用同樣的方式比較和還原。
- Textus AI 可以讀取變更、一個檔案的提交，以及某次提交時的檔案內容，例如幫你草擬提交說明。

這個外掛不會切換分支。需要安裝 Git（在 Mac 上是 Command Line Tools）和 Textus 1.4.6。

## 更新紀錄

- **0.3.1** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it. Its description no longer ends in "Desktop.", and its tools for Textus AI are described in every language.
- **0.3.0** - Push and Pull, and what waits to be pushed or pulled beside the branch (Textus 1.4.6).
- **0.2.0** - Blocks changed since the last commit are marked in the margin (Textus 1.4.4).
- **0.1.1** - The first-commit confirmation's button reads "Commit".
- **0.1.0** - First version.

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `git_changes`：開啟的資料夾的分支和變更的檔案，以及每個變更的文字檔相對上次提交改了哪些行。寫提交訊息前先讀它。
- `git_history`：一個檔案的 Git 提交，由新到舊，跟隨重新命名：雜湊、日期、作者、標題。
- `git_file_at`：一個檔案在某次提交時的內容（雜湊來自 git_history）。
<!-- /ai-tools -->

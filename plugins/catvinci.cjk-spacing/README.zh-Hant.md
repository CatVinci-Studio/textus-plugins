# 中英文間距

在中文、日文與英文字母或數字之間加上空格。

## 替文件加空格

- 選擇 **外掛 › 在中英文之間加空格**，或在右鍵選單中選同一項。「用Textus寫作」會變成「用 Textus 寫作」。整份文件的修改可以一步復原，完成後會提示改了幾處。
- 在外掛設定中開啟 **儲存時也自動加**，每次儲存都會自動調整。只會改內文：段落、標題、清單等。
- 韓文不處理：韓文本來就用空格分隔詞語。

## 保持原樣的內容

- 程式碼、公式、連結和維基連結、註腳、#標籤、提醒 (@…)、%% 註解、HTML 和 front matter，儲存時也一樣。
- Obsidian 的寫法：區塊 id（^1a2b3c）、Dataview 欄位（key:: value）、==醒目標示== 和 Obsidian Tasks 的欄位（📅 2026-11-07）。

## 權限

- **讀取和編輯文件**：替目前的文件加空格。
- **寫入檔案**：開啟 **儲存時也自動加** 時，在儲存時調整文件。
- **Textus AI 工具**：讓 Textus AI 能替一段文字加空格。

## 更新紀錄

- **0.3.0** - From Textus 1.4.4, a paragraph missing a space between CJK and Latin text is underlined; its card adds the spaces. Turn it off in the plugin's settings.
- **0.2.4** - A code block inside a longer fence (```` holding ```) is left alone.
- **0.2.3** - Its Textus AI tool says what it does: Chinese and Japanese, not Korean.
- **0.2.2** - leaves Obsidian's block ids, Dataview fields, highlights and Tasks fields as written
- **0.2.1** - leaves #tags, reminders and %% comments alone; on save only prose blocks change
- **0.2.0** - a tool for Textus AI, `fix_cjk_spacing`
- **0.1.3** - runs on the desktop and on iOS
- **0.1.2** - leaves links, wiki links, footnotes, tags and front matter alone
- **0.1.0-0.1.1** - first versions: the command in the right-click and Plugins menus, and spacing on save

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `fix_cjk_spacing`：在一段 Markdown 中為中日文字與英文字母、數字之間加上空格，程式碼和連結保持不變，和外掛命令的做法一樣。回傳處理後的文字，不寫入任何檔案。
<!-- /ai-tools -->

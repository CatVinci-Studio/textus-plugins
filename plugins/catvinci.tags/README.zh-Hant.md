# 標籤

在側邊欄列出開啟的資料夾裡所有的 `#標籤`，以及各有多少篇筆記使用。

- **標籤** 分頁列出所有標籤，用得最多的排在前面。巢狀標籤（`#project/alpha`）會像 Obsidian 一樣排成樹狀，一個標籤的數量也包括它底下各標籤的筆記。在篩選欄位輸入文字，可以縮小清單。
- 展開一個標籤，就能看到它的筆記，點一下即可開啟。
- 在標籤上按右鍵，選 **重新命名…**，就會在所有筆記裡替它改名，連同它底下的巢狀標籤（`#project/alpha` 會變成 `#new/alpha`）。比對標籤時不分大小寫。改成一個已經存在的標籤，兩個就會合而為一。標籤由文字、數字、`_`、`-` 和 `/` 組成，且不能全是數字。
- front matter 裡的標籤（`tags: [a, b]`，或 `tags:` 底下的清單）也會一起改名。程式碼、行內程式碼、連結網址，以及開頭相同的較長標籤（重新命名 `#draft` 時的 `#drafts`）都保持不變。

## 權限

- 讀取檔案：找出資料夾裡的標籤。
- 寫入檔案：在含有某個標籤的筆記裡替它改名。
- Textus AI 工具：讓 Textus AI 能列出你的標籤，以及帶有某個標籤的筆記。

## 更新紀錄

- **0.3.7** - Its page is in every language Textus speaks.
- **0.3.6** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller.
- **0.3.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.3.4** - Renaming leaves `[[#Heading]]` links alone, and a ``` line inside a `~~~` block no longer ends the code.
- **0.3.3** - Tags match in any letter case, as their counts do; renaming a tag moves its nested tags too and no longer touches link addresses or front-matter tags like `project-x`; tags like `a/` or `a//b` are refused.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - Tags used equally often are listed in natural name order ("Week2" before "Week10").
- **0.3.0** - Nested tags form a tree, each counting the notes of the tags under it; Textus AI finds a tag's nested tags too.
- **0.2.0** - Textus AI can list your tags and the notes with a tag (`list_tags`, `notes_with_tag`).
- **0.1.0-0.1.1** - First versions: tags with their counts, a tag's notes, renaming and merging in every note; runs on desktop and iOS.

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `list_tags`：列出開啟的資料夾中所有文件用到的 #標籤，以及每個標籤被多少份文件使用，用得最多的排在前面。
- `notes_with_tag`：列出開啟的資料夾中帶有某個 #標籤的文件，每份附標題、路徑和它的全部標籤。
<!-- /ai-tools -->

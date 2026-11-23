# 快速插入

輸入 `/` 插入標題、清單、表格和其他區塊，`:` 插入表情符號，`@` 插入日期。

## / 選單

在一行開頭或空格之後輸入 `/`，選擇要放的東西，也就是 Textus 自己的區塊，和「格式」選單裡的一樣：

- **內文、標題 1–3**，以及 **項目符號、編號和任務清單**
- **引用區塊、提示框、程式碼區塊、公式、表格、分隔線**

選了之後，游標所在的那一行就會變成它。其他外掛也會把自己的區塊加進選單（資料庫、連結卡片、提醒、範本）。

繼續輸入可以縮小清單：`/table`、`/tab`，任何語言都可以，中文名稱也能用拼音（`/biaoge`）。

## 表情符號

輸入 `:` 和一個詞來插入表情符號：`:tada` 是 🎉，`:+1` 是 👍，`:笑` 是 😄。

## 日期

輸入 `@` 和一個日子，再選它指的日期：

- English: `@today`, `@tomorrow`, `@yesterday`, `@friday`, `@next friday`, `@in 3 days`, `@next week`
- 中文: `@今天`、`@明天`、`@后天`、`@周五`、`@下周五`、`@星期三`、`@3天后`、`@下周`（也可以寫 `@後天`、`@下週五`、`@禮拜三`、`@3天後`）
- 日本語: `@今日`、`@明日`、`@明後日`、`@金曜日`、`@来週金曜日`、`@3日後`

每週從星期一開始，只寫星期幾的話，指的是下一個。

日期會寫成 `2026-11-06`。在外掛設定裡把 **插入為** 設成 **那天每日筆記的連結**，就會改寫成指向那天每日筆記的連結，寫法依照資料夾的連結寫法：標準連結，例如 `[2026-11-06](Daily/2026-11-06.md)`；在 Obsidian 儲存庫，或筆記使用雙向連結的資料夾裡，則寫成 `[[2026-11-06]]`，名稱和資料夾依它的每日筆記設定而定，例如 `[[November 6th, 2026]]` 或 `[[Journal/2026/11/2026-11-06]]`。在沒有這類設定的資料夾裡，會到 `Daily/` 裡找每日筆記。

清單只在空格之後、一行開頭或括號之後出現，不會出現在 `me@example.com` 這樣的網址或 `[@key]` 這樣的引用裡。在 `(` 之後，`@` 會保留下來，所以 `(@tomorrow` 會變成提醒 `(@2026-11-06`。

它插入的一切都是普通的 Markdown。

## 權限

- **讀取和編輯文件**：插入區塊、表情符號和日期。
- **讀取檔案**：讀取儲存庫的每日筆記設定，用來寫日期連結。
- **Textus AI 工具**：讓 Textus AI 能把用文字說的日子換算成日期。

## 更新紀錄

- **0.5.1** - Its page is in every language Textus speaks. Needs Textus 1.4.4 itself, not a test version of it.
- **0.5.0** - The `/` menu lists Textus's own blocks, the Format menu's, so it always matches the app; Turn into… is gone from it, since picking a block turns the line you're on (the block handle's ⋮⋮ also has Turn Into). Needs Textus 1.4.4
- **0.4.3** - Dates in Traditional Chinese like 後天, 3天後 and 下週五 now work. A bare @ lists your app language's dates first, and day links are right relative to the note.
- **0.4.2** - Shares Two-way Links' fix for working out how a note links.
- **0.4.1** - a day's link is a standard link, [2026-11-08](Journal/2026-11-08.md), unless the folder or the note already uses [[wiki links]]
- **0.4.0** - day links are written the way the folder writes links, on Textus 1.3.10's dates; needs Textus 1.3.10
- **0.3.1** - carries the updated shared date code
- **0.3.0** - Natural Dates merged in: `@` dates in English, Chinese and Japanese, links to daily notes, and the `parse_date` tool for Textus AI
- **0.2.0** - **Today's date** leaves the `/` menu for `@today`
- **0.1.0-0.1.1** - first versions: the `/` menu, **Turn into…**, emoji after `:`

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `parse_date`：把用文字說的日子（英文、中文或日文，與外掛的 @ 補全認得的一樣：tomorrow、next wednesday、in 3 days、下周五、明後日）換算成日期 YYYY-MM-DD，從今天算起。每週從週一開始；只說星期幾指下一個。
<!-- /ai-tools -->

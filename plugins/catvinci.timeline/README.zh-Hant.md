# 時間軸圖

把事件畫成時間軸，每行一個：時間 | 事件 | 說明。

## 畫一條時間軸

- 寫一個 `timeline` 程式碼區塊，每行一個事件：發生時間、發生了什麼，再加一句可選的說明，用 `|` 隔開。時間軸畫在區塊下方；點進區塊可以再看到並修改原始碼。
- 事件依你寫的順序排在一條直線上，每個事件一個圓點。「時間」可以是任何文字：日期、年份、「第 3 天」都可以。
- 空行會略過。第三個 `|` 之後的內容不會顯示。
- 在語言後面寫 `height=400` 可以設定圖的高度。
- 時間軸使用佈景主題的顏色，切換主題時會重新繪製。
- 匯出 HTML、PDF、Word 時，時間軸會以圖片放進去。

## 範例

```timeline
2024-03 | 初稿 | 大綱和前兩章
2024-09 | 審閱 | 三位讀者的意見
2025-01 | 出版
```

## 權限

只需要 **Textus AI 工具** 權限，讓 Textus AI 在寫入區塊前先檢查一次。它不讀取任何檔案，全部在本機繪製。

## 更新紀錄

- **0.4.1** - Its page no longer says which devices it runs on: the store shows that.
- **0.4.0** - A database can be shown as a timeline: pick Timeline among its views, and its dated rows line up in order; a click opens a row. Needs Textus 1.4.6.
- **0.3.3** - A date no longer breaks in the middle ("2024-0" over "3"); a chart drawn while its block was folded fits once it opens.
- **0.3.2** - long notes and dates wrap to fit a narrow island, the timeline uses the document's font, and an empty block says what to write
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - a tool for Textus AI, `check_timeline`
- **0.2.0** - the theme's colors, drawn again when the theme changes
- **0.1.3** - text in the theme's colors on Textus 1.3
- **0.1.2** - keeps up with quick edits: an older drawing never replaces a newer one
- **0.1.0-0.1.1** - first versions: events drawn as a timeline, a height setting, pictures in exports

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `check_timeline`：在把 ```timeline 區塊寫進文件之前檢查它的原始碼（每行一個事件，寫成 時間 | 事件 | 補充），不實際繪製。回傳 ok，或需要先修正的問題。傳入時不帶程式碼圍欄。
<!-- /ai-tools -->

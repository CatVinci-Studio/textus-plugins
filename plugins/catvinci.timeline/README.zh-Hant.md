# 時間軸

依序排列的事件，每行一個：時間 | 事件 | 說明。

- 寫一個 `timeline` 程式碼區塊，下方就會畫出來；點進區塊可以再看到並修改原始碼。
- 在語言後面寫 `height=400` 可以設定圖的高度。
- 匯出 HTML、PDF、Word 時，圖會以圖片放進去。

## 範例

```timeline
2024-03 | First draft | The outline and two chapters
2024-09 | Review | Notes from three readers
2025-01 | Published
```

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `check_timeline`：在把 ```timeline 區塊寫進文件之前檢查它的原始碼（每行一個事件，寫成 時間 | 事件 | 補充），不實際繪製。回傳 ok，或需要先修正的問題。傳入時不帶程式碼圍欄。
<!-- /ai-tools -->

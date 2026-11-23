# 樂譜（ABC）

把程式碼區塊裡的 ABC 記譜法畫成樂譜。

寫一個語言為 `abc` 的程式碼區塊，樂譜會直接畫在它下方；點進區塊就能再看到原始碼並修改。

- 小節會依欄寬自動換行，窄面板裡音符也看得清楚。
- 音符採用佈景主題的文字顏色，切換淺色與深色時會重新繪製。
- 匯出 HTML、PDF、Word 時，樂譜會以圖片放入。

需要 Textus 1.3.2 以上版本。外掛只要求一項權限：Textus AI 工具，讓 Textus AI 在把 `abc` 區塊寫進文件前先檢查。

## 範例

```abc
X:1
T:Scale
M:4/4
L:1/4
K:C
C D E F | G A B c |
```

## 更新紀錄

- **0.3.5** - Its page no longer says which devices it runs on: the store shows that. Its page receives Textus's messages by the API's current name.
- **0.3.4** - Its package lists the libraries it carries, with their licenses.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Bars wrap to the column instead of the whole score shrinking; clicking a note no longer turns it red; `check_abc` accepts full mode names, any note length, `+:` lines, `` ` `` and `$`; `height=` is gone.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - Textus AI can check an `abc` block before writing it (`check_abc`).
- **0.2.0** - The notes follow the theme's text color; needs Textus 1.3.2.
- **0.1.3** - Uses Textus's renamed document colors.
- **0.1.2** - Exported pictures keep the music's width and height.
- **0.1.0-0.1.1** - First versions: `abc` blocks drawn under their source, `height=`, pictures in exports; store page and icon.

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `check_abc`：在把 ```abc 區塊寫進文件之前檢查它的原始碼（ABC 樂譜記法：以 K: 結尾的欄位標頭，然後是音符），不實際繪製。回傳 ok，或需要先修正的問題。傳入時不帶程式碼圍欄。
<!-- /ai-tools -->

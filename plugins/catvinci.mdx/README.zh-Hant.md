# MDX

用於 MDX 文件，也就是 Docusaurus、Nextra 等網站工具使用、可以放元件的 Markdown。Textus 本身就能開啟 `.mdx` 檔案，並把其中的 import、`{expressions}` 和元件原樣保留；這個外掛再加上：

- **標出問題。** MDX 官方的編譯器會在你寫作時檢查文件，找到的第一個問題會在出錯的地方畫上底線，並標出行數和錯在哪裡。
- **預覽 MDX。** 在文件旁邊畫出它的樣子：分頁、提示框（`<Callout>`、`<Admonition>`、`:::tip`）和 `<details>` 以 Textus 的樣式顯示，其他元件則顯示成一張卡片，寫出它的名稱和屬性。文件裡的程式碼一概不執行。
- **另存為 Markdown / 另存為 MDX。** 在文件旁邊存一份副本：提示框變成 GitHub 提示，分頁變成帶標題的段落，裡面沒有內容的元件則保留為註解；反過來轉換時，大括號和 `<` 會被跳脫，註解和 `<br>` 也會寫成 MDX 要的樣子。

這些功能在「外掛程式」選單裡，或在 `.mdx` 文件裡按右鍵就能找到。

## 權限

- **讀取文件**：在你寫作時檢查並畫出文件。
- **讀寫檔案**：檢查 Textus AI 指定的 .mdx 檔案，並把轉換後的副本存在文件旁邊。
- **Textus AI 工具**：讓 Textus AI 能檢查它寫的 MDX。

## 更新紀錄

- **0.1.4** - Its icon is MDX's own logo.
- **0.1.3** - Its page is in every language Textus speaks.
- **0.1.2** - Its package lists the libraries it carries, with their licenses.
- **0.1.1** - Preview MDX on a phone, where the preview shows alone, draws the document it was opened from instead of an empty page.
- **0.1.0** - First version: problems underlined by MDX's compiler, Preview MDX, Save as Markdown and Save as MDX, and check_mdx for Textus AI.

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `check_mdx`：用 MDX 官方編譯器檢查 MDX，給出第一個問題和它的行、列。寫完或改完 .mdx 文件後、說它能用之前先查。
<!-- /ai-tools -->

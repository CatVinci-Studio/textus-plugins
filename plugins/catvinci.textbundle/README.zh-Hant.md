# TextBundle

把 .textbundle 資料夾（Bear、Ulysses 和 iA Writer 存成的那種）當作一篇文件開啟，圖片就在旁邊。

## 它做什麼

- `.textbundle` 資料夾在側邊欄裡顯示成一篇文件。點一下，它的文字（`text.md`）就會在以這個 bundle 命名的分頁中開啟。
- bundle 裡 `assets/` 的圖片會直接顯示在文中。
- 在側邊欄移動、重新命名或刪除 bundle 時，整個資料夾會一起處理。

## 權限

不需要任何權限。它只告訴 Textus 哪些資料夾是文件，自己什麼也不讀。

## 更新紀錄

- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it.
- **0.1.0** - First version: a .textbundle folder opens as one document. Needs Textus 1.4.6.

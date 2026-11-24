# SSH 資料夾

透過你自己的 ssh 開啟伺服器上的資料夾，像在這台電腦的資料夾裡一樣寫作：文件在分頁裡，檔案在側邊欄裡。

## 它做什麼

- **外掛程式 › 開啟遠端資料夾…** 會列出你 `~/.ssh/config` 裡的伺服器（也可以自己輸入，例如 `me@server`），再選要開啟的資料夾，從你在那裡的家目錄開始。
- 資料夾會在側邊欄開啟。文件的開啟、儲存、重新命名、移動和搜尋，都和一般資料夾一樣；新的文件或資料夾會建立在伺服器上。
- 連線由你自己的 `ssh` 建立，使用你的設定、金鑰、agent 和已知主機。只要求檔案傳輸（SFTP）：不開 shell，也不執行指令。
- 連線中斷後，下次讀取或儲存檔案時會重新連上。

## 限制

- 只能用金鑰或 agent 登入。要求密碼的伺服器會被拒絕；請先替它加上金鑰。
- ssh 還不認識的伺服器會被拒絕，絕不會替你接受：請先在終端機裡用 `ssh` 連線一次，在那裡接受它的金鑰。
- 目前還不能把圖片貼到伺服器上的文件裡，而且刪掉的檔案就永久消失了：伺服器沒有垃圾桶。

## 權限

外掛要求 **ssh** 權限：每台伺服器在外掛第一次連線前，Textus 都會先問你一次。

## 更新紀錄

- **0.1.2** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it. Its description no longer ends in "Desktop.": the store shows that.
- **0.1.1** - Uses the plugin API as Textus 1.4.6 ships it.
- **0.1.0** - First version. Needs Textus 1.4.6.

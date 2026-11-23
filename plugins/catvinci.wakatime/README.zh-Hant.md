# WakaTime

把你在 Textus 裡寫作的時間傳到你的 [WakaTime](https://wakatime.com) 帳號，在統計面板上和寫程式的時間並列。

1. 從 [wakatime.com/settings/api-key](https://wakatime.com/settings/api-key) 複製你的 API 金鑰。
2. 在 Textus 設定裡 WakaTime 的頁面上點 **設定 API 金鑰…**，貼上金鑰。金鑰保存在 Textus 的安全儲存空間裡。

「外掛程式」選單和命令面板裡有 **WakaTime：設定 API 金鑰…**、**WakaTime：今天的寫作時間**（顯示 WakaTime 算出的今天總時間），以及 **WakaTime：開啟統計面板**。

## 哪些算數，傳送什麼

- 只算你自己在前景 Textus 視窗裡的工作：打字、移動游標、切換文件和儲存。Textus 在背景的時間，以及在磁碟上或由外掛做的修改，都不算。用 Textus AI 寫的內容算作 AI 寫程式的時間。
- 每一刻的工作，它會告訴 WakaTime 文件的路徑、語言（Markdown）、行數、專案和 Git 分支。專案是開啟的資料夾裡 `.wakatime-project` 檔案的第一行，沒有的話就是開啟的資料夾的名稱。
- 同一份文件最多每兩分鐘傳送一次，儲存時一定會傳送，和 WakaTime 自己的外掛一樣。
- 離線時，時間會先排在佇列裡，之後再分批傳送。
- 設定金鑰之前不會傳送任何內容，未儲存的文件也從不傳送。要停止的話，把金鑰設成空白即可。

需要 Textus 1.3.0 以上版本。外掛要求讀取編輯器和開啟的資料夾中的檔案（用來取得文件、行數、`.wakatime-project` 和 `.git/HEAD`），以及連線到 `api.wakatime.com`，網路上的其他地方一概不連。

## 更新紀錄

- **0.2.5** - Set the API key with a button on its page in Settings, and find its commands in the Plugins menu: on a phone, with no command palette, too. Its page is in every language Textus speaks.
- **0.2.4** - Leaving the key empty now really turns it off; a garbled reply to Today's Writing Time shows the usual message.
- **0.2.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.2** - Finds `.wakatime-project` and the Git branch the same way on every system.
- **0.2.1** - Says where it runs: desktop and iPhone.
- **0.2.0** - Only your own work in a window in front counts; an offline queue sent in batches; project, branch and lines; Today's Writing Time.
- **0.1.0** - First version: writing time in Textus on your WakaTime dashboard.

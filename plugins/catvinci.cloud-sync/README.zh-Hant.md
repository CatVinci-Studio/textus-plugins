# 雲端同步

透過你自己的 S3 相容儲存、WebDAV 或堅果雲，讓一個資料夾在你的各台電腦上保持一致；雲端會保留舊版本，你也可以選擇在資料離開每台裝置前先加密。

開啟端對端加密後，儲存服務既看不到檔案的內容，也看不到檔名。
雲端同步需要 Textus 1.4.1 以上版本。

## 開始使用

1. 在 Textus 中開啟要同步的資料夾，然後選 **外掛程式 › 雲端同步**（或它側邊欄分頁裡的 **連線設定…**）。
2. 選擇儲存服務，填入伺服器位址和登入資訊。堅果雲只需要你的電子郵件，以及在「帳戶 › 安全」裡產生的應用程式密碼。
3. 要加密的話，開啟 **端對端加密**，並設定至少 12 個字元的 **同步密碼**；請把它存在你的密碼管理工具裡，因為它無法重設。每個遠端資料夾只能決定一次：之後要切換，必須改用一個新的空資料夾。
4. 選 **儲存連線**，再選 **立即同步**。

在另一台裝置上，開啟對應的資料夾，填入同樣的服務和同樣的遠端資料夾（加密的話，還有同樣的同步密碼）。開啟 **自動同步**（在 Textus 開著時）：之後每次儲存或重新命名檔案，幾秒後就會同步，另外每 5 分鐘也會同步一次，以防沒有任何事件觸發（**同步間隔**：5 到 60 分鐘）。你刪除的檔案會在下一次同步時一起處理。**外掛程式 › 立即同步** 隨時都能同步一次。

連線儲存後，狀態列會顯示同步狀況：**已同步 · 2 分鐘前**、**正在同步…**、**同步衝突** 或 **同步出錯**。點一下就會開啟面板。

兩台裝置都改了同一個檔案時，兩個版本都會保留：你的留在原處，另一台裝置的放在 `Sync conflicts/` 裡。

## 在手機上

在 iPhone、iPad 或 Android 手機上（Textus 1.4.7 或更新的版本），雲端同步會在打開資料夾時、回到 Textus 時、儲存幾秒後以及點**立即同步**時同步；不在背景同步。離開 Textus 時被打斷的同步，回來後會自己接著做完。

- **設定**：在已經同步這個資料夾的裝置上，點連線下方的**複製設定碼**，把設定碼傳到手機上，貼進**設定碼**：服務、位址和遠端資料夾會自動填好。帳號、金鑰和同步密語要在手機上自己填，設定碼裡從不帶這些。
- **大檔案**：手機上超過 32 MiB 的檔案不同步（**同步的最大檔案**，最多 128 MiB），會列在狀態下方。
- **在別處刪除的檔案**：Android 上會移進資料夾裡的 `Sync trash/`，它不參與同步，需要你自己清空。
- **iCloud 雲碟**：那裡的資料夾已經由 iCloud 同步。雲端同步會提示一句，照樣能用，但一個資料夾只用一種方式同步。
- **Android**：先允許 Textus 存取所有檔案，再打開資料夾；沒有這個權限時打開的資料夾無法同步。

## 雲端歷史

每次同步取代或刪除一個檔案時，它之前的內容會留在遠端資料夾裡。在檔案上按右鍵選 **雲端歷史版本…**，就能看到它的各個版本（什麼時候、來自哪台裝置、多大），閱讀其中一個，並 **復原這個版本**：它會成為目前的檔案並同步出去，被取代的版本則留在歷史裡。如果那個檔案還有尚未同步的修改，或正開著，版本會改為寫在它旁邊（`Note (3f2a9c1b).md`）。**外掛程式 › 雲端歷史版本…** 會列出從資料夾中刪除的檔案；開啟其中一個就能找回來。

**保留雲端歷史** 設定保留多久，從版本被取代時算起：30 天、90 天（預設）、365 天，或永久。整個資料夾只有一個設定：以任何一台裝置最後同步上去的為準，其他裝置也會跟著顯示。第一天每小時保留一個版本，之後每天一個，每個檔案最多 200 個；歷史紀錄超過 8 MB 時，會先刪除最舊的版本。每次有變更的同步，以及沒有變更時每天一次，都會清掉過期的版本，並刪除只有它們用到的區塊。0.5 之前（舊的快照）佔用的空間不會回收。請把每台裝置都更新到 0.5：0.4 裝置做的修改，要等到下一次 0.5 同步才會加入歷史，它自己刪除的檔案在那之前也不會列出。

**權限：** 讀寫開啟的資料夾（用來掃描它，並套用下載下來的變更），以及連線到任何網站（只連你填入的 HTTPS 伺服器）。沒有遙測、分析、遠端程式碼或自動更新。

## 細節

S3 可以在 **更多選項** 裡設定自訂端點（留空代表 AWS）、區域、儲存貯體、路徑式或虛擬主機式位址，以及選填的工作階段權杖。遠端資料夾存放的是外掛自己的儲存格式，不是檔案的單純鏡像；每個工作區請使用不同的遠端資料夾。

憑證透過 `ctx.secrets` 儲存，和同步狀態分開。它們從不會傳回設定頁面，也不會複製到遠端清單裡。憑證欄位留空時，會沿用現有連線的憑證。修改端點、遠端資料夾或帳號時，需要提供相應的憑證。同步密碼也會透過 `ctx.secrets` 儲存在本機，供自動同步使用，從不會傳回設定頁面，也不會傳給儲存服務。密碼欄位留空時會保留原本的密碼。在這裡輸入不同的密碼，並不會重新加密現有的儲存庫：它必須和初始化那個遠端資料夾時用的密碼相同。

## 同步哪些內容

- 已儲存的 `.md`、`.markdown`、`.mdown`、`.mkd`、`.txt` 和 `.csv` 文件，以及 Obsidian 的資料庫（`.base`）和白板（`.canvas`）。
- 圖片、PDF、Office/OpenDocument 檔案、音訊和影片。完整的允許清單在外掛儲存庫的 `development/cloud-sync/src/config.ts` 裡。
- Textus 的專案資料：`.textus/agent.md`、`style.md`、`style.previous.md`，以及 `.textus/library/`、`memory/` 和 `skills/` 底下的 Markdown。

全域設定、對話紀錄、草稿、未儲存的修改、憑證、其他外掛的資料、任意的點檔案，以及建置和相依套件資料夾都不會同步。只能存取開啟的工作區裡的檔案。工作區以外的檔案，包括連結到資料夾外的附件，都不會上傳。

在設定裡還可以排除更多：每行一條規則，寫法和 `.gitignore` 相同（`drafts/`、`*.pdf`、`!keep.pdf`）。有一個開關會一併套用資料夾自己的 `.gitignore`。被排除的檔案在每台裝置上都保持原樣：不會上傳、下載或刪除。另一個開關會同步 Obsidian 的共用設定（`.obsidian/app.json`、`appearance.json`、`hotkeys.json`、`bookmarks.json`、`graph.json`、`core-plugins.json`、`types.json`）；`workspace.json` 這類每台裝置各自的檔案則留在本機。

目前的上限是每個檔案 128 MiB、20,000 個檔案和資料夾、48 層目錄，以及 8 MiB 的清單。空資料夾不會同步。在支援的平台上不安全的路徑，或只差在大小寫或 Unicode 正規化形式的路徑，會讓同步停下來，而不是悄悄改名。

## 變更與衝突

由 SHA-256 雜湊值和上次成功的同步判斷是哪一邊改了。只傳輸有變更的內容。檔案以 2 MiB 的區塊儲存，相同的區塊會重複使用；ETag 不會被當成內容雜湊值。

- 各自獨立的修改，會複製到另一台裝置。
- 同時發生的修改，會保留本機的檔案，並把遠端版本存到 `Sync conflicts/` 底下。兩個版本都會發布給其他裝置。
- 開著的目標檔案會延後處理；儲存並關閉它們後，再同步一次。
- 已存在的文字檔，透過 Textus 會檢查版本的 `files.process` API 更新。已存在的二進位檔案從不會被覆寫：內容不同的附件會保留兩個版本，即使只有一邊改過。目前的外掛 API 沒有附條件替換二進位檔案的操作。
- 在一台裝置上刪除的檔案，其他裝置會在下次同步時刪除，並把它移到系統的垃圾桶，你可以從那裡找回來。刪除的檔案在雲端歷史保留版本的期間內，都會留在雲端歷史裡。重新命名會以重新命名的方式傳到其他裝置。
- 只有在歷史紀錄放掉某些內容時，它才會離開伺服器：在那之前，任何能讀取遠端資料夾的人（如果有加密，還要知道同步密碼）都能讀到已刪除的檔案。要徹底移除內容，請替清理過的工作區改用一個新的遠端資料夾。
- 修改優先於刪除：如果上次同步後，一台裝置刪除了另一台裝置修改過的檔案，修改後的檔案會在每台裝置上回來。
- 第一次同步某個資料夾的裝置從不刪除任何東西；只有一邊有的檔案會複製到另一邊。
- 一次同步如果會從雲端刪除很多檔案（超過十個，而且超過已同步檔案的 30%），會在刪除任何檔案前停下來問你；自動開始的同步只問一次，**立即同步** 會再問一次。重新命名或移動的檔案不算在內。如果一個資料夾裡什麼都找不到，但之前從那裡同步過很多檔案，就會被視為無法讀取（失去存取權，或檔案沒有下載），同步會停下來，什麼都不刪除。
- 在別處刪除的檔案，如果系統垃圾桶不接受，它會留在原處，列在面板裡，下次同步時再試；其餘的同步照常進行。
- 在分頁中開著的檔案不會被移除或重新命名；關掉它們後再同步一次。
- 要依賴刪除功能之前，請先把每台裝置都更新到 0.4：較舊的裝置會把在別處刪除的檔案放回來。

開啟 **端對端加密** 時，內容和檔名會在上傳前加密；無論哪種方式，所有資料都經由 HTTPS 傳輸。請使用私人的 S3 儲存貯體或 WebDAV 資料夾。服務帳號需要在專用的遠端資料夾裡擁有讀取、寫入和刪除權限（刪除權限用於暫存物件和鎖定）。

## 每次同步的請求數

由測試透過 HTTP 測得，對象是一份小文件，在這次工作階段的第一次同步之後（第一次同步還會檢查伺服器的互斥寫入：S3 上多 4 個請求）：

| 同步                              | S3  | WebDAV / 堅果雲 |
| --------------------------------- | --- | --------------- |
| 沒有變更                          | 3   | 3               |
| 修改了一份文件（一個 2 MiB 區塊） | 18  | 20              |
| 刪除了一個檔案                    | 20  | 22              |

兩邊都沒有變更時，同步只讀取資料夾目前的版本號，不取得鎖定。每多一個變更的區塊，就多 1 個請求：區塊只傳送一次，不會先問它在不在，也不會再讀回來（區塊以內容命名；每次下載都會逐一檢查）。在 WebDAV 上，放進尚不存在的資料夾的區塊要多花 2 個請求：被拒絕的上傳，以及建立資料夾；取得鎖定要花一次上傳和一次 `MOVE`。儲存後的同步會等儲存穩定下來（5 秒），再等 **同步延遲**（不延遲到 10 分鐘）：新的堅果雲連線預設 3 分鐘，因為堅果雲限制每個帳號的請求次數；S3 和 WebDAV 則是 0。伺服器忙碌的回應（429、503）會暫停所有請求；伺服器要求等待時，狀態會顯示「正在等伺服器」和秒數，最多 60 秒。要求等更久時，那次同步會停下來，請你稍後再試；已經送出的內容會留給下一次使用。

## 端對端加密

開啟 **端對端加密** 後，檔案內容、路徑、內容雜湊值和快照，都會透過 Web Crypto 以 AES-256-GCM 驗證並加密。每次加密都使用新的 96 位元 nonce 和 128 位元標籤。驗證會綁定儲存庫的加密標頭和邏輯物件鍵，防止區塊、清單和快照之間互相替換。

一把 256 位元的根金鑰在本機以 PBKDF2-HMAC-SHA-256 衍生，經過 600,000 次迭代，並使用隨機的 256 位元儲存庫鹽值。HKDF-SHA-256 再分別衍生出 AES 用的金鑰，以及 HMAC-SHA-256 物件命名用的金鑰。內容區塊的名稱是帶金鑰的 HMAC，不是公開的明文雜湊值。相同的區塊在同一個儲存庫內會重複使用；不相關的儲存庫使用不同的鹽值和金鑰。解密時會先驗證位元組，再套用到檔案。

加密描述資訊裡只存放公開的 KDF 參數、儲存庫 ID，以及一段加密過的固定驗證訊息。裝置第一次成功解鎖後，會記住描述資訊的指紋，指紋改變或消失時就會停止。密碼錯誤、描述資訊格式不對，或密文遭竄改，都會讓同步停止。

服務商仍然能看到你選的遠端前綴、物件的大小和數量、同一個儲存庫內區塊的重複使用、請求的時間，以及匿名的鎖定擁有者和時間。這個協定不保證能察覺惡意伺服器重放較舊但有效的加密狀態。強密碼很重要，因為拿到遠端密文就能離線猜測密碼；KDF 能提高猜測的成本，但無法讓弱密碼變強。這套實作有自動化的互通性和竄改測試，但還沒有經過獨立的安全稽核。

本機檔案仍然可以讀取。密碼存放在 Textus 每位使用者各自的本機安全儲存空間裡，不在遠端儲存庫中；這無法保護已被入侵或已解鎖的用戶端。遺失密碼或原本的加密描述資訊，遠端資料就無法復原。完整的備份必須包含描述資訊和加密物件。

### 遠端格式

- `v1/head.json`：公開的加密描述資訊（`textus-cloud-sync-e2ee/1`）。沿用舊路徑是刻意的：v0.1 用戶端會在上傳檔案前拒絕這種格式。
- `v1/lock.json`：新舊用戶端共用的互斥鎖；不含文件資料。
- `v2/head.bin`：加密的目前清單。
- `v2/history.bin`：加密的歷史紀錄（每個檔案的舊版本和來源）。
- `v2/blocks/<prefix>/<HMAC>`：加密的內容區塊。
- `v2/snapshots/<revision>.bin`：目前和前一個版本的加密清單。

沒有加密時，同樣的物件以 JSON 和原始區塊儲存：`v1/head.json`、`v1/history.json`、`v1/blocks/<prefix>/<SHA-256>` 和 `v1/snapshots/<revision>.json`。一個遠端資料夾要嘛加密、要嘛不加密；外掛拒絕混用。

加密物件的內容是 `TCS2`、一個 12 位元組的 nonce，接著是密文和它 16 位元組的 GCM 標籤。AAD 是正規化 JSON 標頭（依序為 `format`、`repositoryId`、`kdf`、`iterations`、`salt`）的 UTF-8、一個換行，以及邏輯 v1 物件鍵。密碼以 UTF-8 編碼，不做正規化。HKDF 以 UTF-8 的儲存庫 ID 為鹽值，以 `textus-cloud-sync-e2ee/1/content` 或 `/names` 為 info。區塊 HMAC 的輸入是 UTF-8 的邏輯 `v1/blocks/<hash-prefix>/<SHA-256>` 鍵。驗證用的明文是 `Textus encrypted workspace key check`，邏輯鍵是 `key-check`；它的封裝以十六進位編碼存在 `verifier` 裡。這些做法都在測試中以 Node 獨立的 PBKDF2、HKDF、HMAC 和 AES-GCM API 驗證過。

### 把資料夾改為加密

遠端資料夾不會就地轉換。先確認有一個本機工作區包含你需要的所有檔案和衝突副本，然後選一個 **新的空遠端資料夾**，開啟加密並設定同步密碼。先同步這個完整的工作區；之後其他裝置再用同樣的密碼和遠端資料夾加入。

舊的遠端資料，包括服務商自己的版本紀錄和備份，仍然是未加密的。確認加密的工作區沒問題後，再到服務商那裡處理舊的副本。不支援就地更換密碼；要換密碼，請再改用另一個新的遠端資料夾。

## 中斷的同步

遠端鎖定讓各台裝置依序同步。S3 使用 `If-None-Match: *`；WebDAV 先上傳暫存檔，再以 `Overwrite: F` 執行 `MOVE`，堅果雲對已存在目標回傳的 409 也照此處理。同步碰到工作區資料之前，連線測試會先確認互斥機制可用。不需要任何列出檔案的 API，也不需要沒有上限的目錄列表。

加密區塊和一份不可變更的快照，會在發布 `v2/head.bin` 之前寫好。本機的基準只在發布成功後才前進。重試時會重複使用已完成的區塊，重新啟動後也一樣：中斷的同步已存好的區塊會記在本機，不再檢查，只要期間沒有其他裝置發布過。取消會在目前的網路請求結束後停下，並盡可能釋放鎖定。Textus 的網路 API 把一個請求限制在 60 秒內；它不提供單一請求的取消。

新下載的二進位檔案，會以一個記錄在外掛本機儲存空間裡的唯一標記預留路徑。寫入中斷後，下一次同步會從那個標記接著做，而不是把它當成檔案內容上傳。如果其他應用程式改了這個檔案，它的內容會保留下來。重試時請保留外掛的本機資料。

這台裝置在 Textus 關閉或同步途中停止時留下的鎖定，下一次同步會直接收回，不會詢問。正在執行的同步每 10 秒會更新一次鎖定的紀錄；下一次同步會在紀錄超過 30 秒後收回鎖定，如果太早開始就等到時間到，期間紀錄若有更新（另一個視窗裡的同步還在執行），就不去動它。其他裝置的鎖定絕不會被收回：那台裝置當機後，**復原 › 清除遺留鎖定** 會在你確認後才移除它。請先確認所有其他裝置都已停止同步。鎖定在遠端永遠不會過期，所以慢的裝置不會只因為計時器到期就失去寫入權。

同步時對每個檔案的發現（大小、時間、雜湊值）會保存在本機，跨啟動保留，所以重新啟動後的第一次同步只會重讀期間改過的檔案。如果描述資訊或目前的清單不小心被刪除，之前加入過的裝置會停止同步。請用原本的描述資訊還原完整的遠端備份。加密的快照綁定在它自己的物件名稱上，不能直接複製去覆蓋 `v2/head.bin`；要還原單一快照，必須先解密，再為那個邏輯鍵重新加密。目前還沒有還原單一快照的介面。同步進行時，請不要修改遠端檔案。

## 從社群外掛轉過來

官方外掛是 `catvinci.cloud-sync`。之前的社群外掛 `ciao1019.cloud-sync` 有各自獨立的本機設定、金鑰和同步狀態。切換之前，請先用舊外掛完成或復原任何中斷的同步，然後關掉它的自動同步並停用它。請保留一份工作區的備份。

安裝官方外掛，填入同樣的儲存連線、完全相同的遠端資料夾和同步密碼。加密的遠端格式沒有改變，所以現有的 v0.2/v0.3 遠端資料不必搬移或重新加密就能讀取。本機憑證、描述資訊指紋和同步基準不會跨外掛 ID 複製；第一次執行時會以新裝置的身分加入現有的遠端，檔案不同的話可能會保留衝突副本。絕不要在同一個工作區上同時執行兩個外掛的自動同步。未加密的 v0.1 資料仍需要依照上面另外的升級步驟處理。

## 開發與致謝

原始碼、協定測試和建置說明在 [development/cloud-sync](https://github.com/CatVinci-Studio/textus-plugins/tree/main/development/cloud-sync)。外掛目錄直接打包 `plugins/catvinci.cloud-sync/` 裡可讀的檔案，不做編譯。發布遵循這個儲存庫的官方外掛流程，使用像 `catvinci.cloud-sync-v0.3.0` 這樣的標籤。

最初由 Ciao1019 開發；0.3.0 的介面和設定改進由 ChengAo Shen 貢獻。MIT 授權聲明保留在 `LICENSE` 和 `THIRD_PARTY_NOTICES.md` 裡。儲存設計參考了 Petrichor/Sylva 的 `apps/api/internal/cloudsync/`；沒有複製任何 Go 原始碼或 PostgreSQL 備份格式。

## 更新紀錄

- **0.10.0** - On iPhone, iPad and Android phones (Textus 1.4.7 or later): it syncs when the folder opens, when you come back to Textus and after you save, never in the background. **Copy Setup Code** carries a connection to another device without its account, keys or password. Disconnecting forgets the folder's sync record too, so connecting again starts with a first sync, which deletes nothing.
- **0.8.1** - A file over 128 MiB no longer stops the whole sync: it stays where it is on every device and is listed under the status. A conflict copy opens from the page with a click. Ready for phones, not offered there yet: a sync when a folder opens and when you come back to Textus, none in the background; settings that survive an iPhone update; a smaller largest file and fewer transfers at once; deleted files kept in "Sync trash/" where there is no system Trash.
- **0.8.0** - Safer when a sync is cut short: a lock this device left (Textus closed or stopped mid-sync) is taken back by its next sync without asking; another device's lock still needs **Recover stale lock**. A sync that would delete many files from the cloud stops and asks first, and a folder where suddenly nothing is found is taken as unreadable, not emptied. A file the system Trash refuses no longer stops the whole sync: it stays in place and is tried again. The first sync after a restart reads only the files changed meanwhile, not the whole folder. Its page is in every language Textus speaks. Its pickers keep Textus's own height.
- **0.7.0** - Faster syncs with fewer requests: with nothing changed, a sync asks the service once instead of 8 to 16 times; a changed file's blocks are sent in one request each, without checking first or reading them back; on WebDAV folders are made only when one is missing. A busy service is waited for (up to a minute, shown in the status) instead of stopping the sync, and requests that got no answer are sent again. The progress counts files that are done. From Textus 1.4.4 the versions it keeps of a document show in Version History too.
- **0.6.1** - A big first sync that stops halfway (cancelled, offline, or slowed by the service) goes on where it stopped next time, instead of checking every file it already sent; on Nutstore that saves most of the requests.
- **0.6.0** - Sync settings rearranged: sync options sit at the top and apply as you pick them, with no Save button. **Sync interval**, **Sync delay**, and **Keep cloud history** are pickers. Files now go up and down several at a time: **Transfers at once** sets how many (S3 8, WebDAV 4, Nutstore 2 to start), and blocks the cloud already holds are no longer checked again. A connected service shows as a card with the account masked and **Test connection**, **Edit** and **Disconnect**; the encryption switch and password are part of the connection. **Test connection** works before saving, and names the missing permission (write, read or delete) when a check fails.
- **0.5.3** - One set of rules for every service: the automatic interval can be 1 to 1,440 minutes, and **After a save, wait** sets how long a sync waits after saving (Nutstore starts at 3 minutes, S3 and WebDAV at 0; WebDAV no longer waits 30 s).
- **0.5.2** - The plugin no longer caps its own requests: a first Nutstore sync of a folder with many files no longer stops at "The service request limit was reached".
- **0.5.1** - A sync interrupted after it wrote the history but before the new state no longer leaves versions in the history that were never synced. Trash and old versions age by the storage server's clock, so a device whose clock is wrong no longer drops what the others keep.
- **0.5.0** - Older versions stay in the cloud: right-click a file › **Cloud History…** to read and restore one, and **Plugins › Cloud History…** brings back deleted files. **Keep cloud history** sets 30, 90 or 365 days, or always, and old versions are cleaned up by themselves. End-to-end encryption is now a switch, off for new connections; connections set up before keep it. Also brings 0.4.7's changes. Needs Textus 1.4.1.
- **0.4.7** - A sync reads again only the files whose size or time changed since the last one, so syncing a big folder while you write takes far less work. Your own rules can leave out more files (written as in a `.gitignore`), the folder's `.gitignore` can count too, and Obsidian's shared settings can sync. A picture or other attachment changed on another device now replaces the one here instead of being kept twice. Needs Textus 1.4.1.
- **0.4.6** - Every language now has the whole page translated, not just a few lines. In a narrow panel the status and the connection hint keep a readable width and the buttons move to their own line.
- **0.4.5** - The sidebar keeps to the sync status and **Sync now**; **Connection settings…** there opens the plugin's own page, where the connection is set up. The sidebar page draws no title of its own, as the sidebar's other tabs. Needs Textus 1.3.13. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.4.4** - A Cloud Sync tab in the sidebar shows at a glance how sync stands - connected or not, the last sync, any error, which service and remote folder - with the whole connection form below; Settings shows the same page. The service is picked from a dropdown, and a long name, path or error wraps inside the page.
- **0.4.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.1** - Obsidian bases (`.base`) and canvases (`.canvas`) sync too.
- **0.4.0** - Deletions and renames reach your other devices (deleted files go to the system Trash there); automatic sync runs a few seconds after you save; the status bar shows how sync stands; syncs are paced to stay within WebDAV and Nutstore request limits.
- **0.3.1** - Nutstore: a remote folder that already exists no longer stops the sync.
- **0.3.0** - First official version: end-to-end encrypted sync through S3, WebDAV or Nutstore, with conflict copies when both sides changed a file.

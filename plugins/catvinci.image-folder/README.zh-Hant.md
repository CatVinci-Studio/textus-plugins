# 圖片跟隨文件

和 Typora、VS Code 一樣，把每份文件的圖片放在它旁邊、以它命名的資料夾裡：`Note.md` 的圖片放在 `Note.assets/`。

不需要開啟或設定任何東西，安裝後就會自動運作。

- 在已儲存的文件裡貼上或拖入圖片。Textus 會先儲存圖片，這個外掛再把它移到文件的圖片資料夾，並把連結改成 `Note.assets/圖片.png`。名稱重複時會加上編號，不會覆寫任何檔案。連結改不了時，圖片會放回原處。
- 在同一個資料夾裡替文件改名，它的圖片資料夾和連結會跟著改名；如果還有其他文件連結到這個資料夾，兩者都維持不變。
- 文件裡已有的圖片留在原處。
- 在設定了附件資料夾的 Obsidian 儲存庫裡，以及在 Logseq 圖譜裡，圖片留在那個應用程式放的位置。

支援 PNG、JPEG、GIF、WebP、AVIF、BMP、SVG、ICO、HEIC 和 TIFF 圖片。需要 Textus 1.4.0 以上版本。外掛需要讀寫檔案，用來移動圖片、替圖片資料夾改名；也需要讀取和編輯目前的文件，用來修改指向圖片的連結。

## 更新紀錄

- **0.1.8** - Its page no longer says which devices it runs on: the store shows that. It names the Textus it needs, 1.4.0.
- **0.1.7** - The store description now opens with what the plugin does.
- **0.1.6** - Adding many pictures at once (a sync, a folder copied in) no longer reads the open document over and over.
- **0.1.5** - In an Obsidian vault, pictures stay where the vault's attachment setting puts them again: the setting is read through Textus.
- **0.1.4** - Leaves pictures where a document's Typora image folder setting puts them, and no longer moves a folder while some links to it may still be unchecked.
- **0.1.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.2** - Leaves pictures where an Obsidian vault's attachment folder setting or a Logseq graph puts them.
- **0.1.1** - A shorter name: Images Follow Document.
- **0.1.0** - First version: pasted and dropped pictures move into `Note.assets/`, and the folder follows a renamed document.

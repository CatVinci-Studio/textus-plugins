# 图片跟随文档

和 Typora、VS Code 一样，把每篇文档的图片放在它旁边、以它命名的文件夹里：`Note.md` 的图片放在 `Note.assets/`。

不需要打开或设置什么，装好就会自己工作。

- 往已保存的文档里粘贴或拖入图片。Textus 先保存图片，这个插件再把它移到文档的图片文件夹，并把链接改成 `Note.assets/图片.png`。重名的会加上编号，不会覆盖任何文件。链接改不了时，图片会放回原处。
- 在同一个文件夹里给文档改名，它的图片文件夹和链接会跟着改名；如果还有别的文档链接到这个文件夹，两者都保持不变。
- 文档里已有的图片留在原处。
- 在设置了附件文件夹的 Obsidian 库里，以及在 Logseq 图谱里，图片留在那个应用放的位置。

支持 PNG、JPEG、GIF、WebP、AVIF、BMP、SVG、ICO、HEIC 和 TIFF 图片。支持桌面版，需要 Textus 1.3.0 或更新版本。插件需要读写文件，用来移动图片、给图片文件夹改名；还需要读取和编辑当前文档，用来改动指向图片的链接。

## 更新日志

- **0.1.7** - The store description now opens with what the plugin does.
- **0.1.6** - Adding many pictures at once (a sync, a folder copied in) no longer reads the open document over and over.
- **0.1.5** - In an Obsidian vault, pictures stay where the vault's attachment setting puts them again: the setting is read through Textus.
- **0.1.4** - Leaves pictures where a document's Typora image folder setting puts them, and no longer moves a folder while some links to it may still be unchecked.
- **0.1.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.2** - Leaves pictures where an Obsidian vault's attachment folder setting or a Logseq graph puts them.
- **0.1.1** - A shorter name: Images Follow Document.
- **0.1.0** - First version: pasted and dropped pictures move into `Note.assets/`, and the folder follows a renamed document.

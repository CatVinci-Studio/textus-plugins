# 版本历史

把文档每次保存的内容留作一个版本，可以查看改了什么，也能把旧版本找回来。

- 每次保存，文档的文字都会留作一个版本。间隔很近的保存（比如自动保存每隔几秒一次）算作同一个版本，最多每 15 分钟产生一个新版本。最近一天的全部保留，一周内每小时留一个，三个月内每天留一个，更早的每周留一个。
- 侧边栏的 **历史** 标签页列出当前文档的各个版本，最新的在最上面，按天分组：今天、昨天，然后是日期。
- 选一个版本，可以逐行看到从那以后改了什么。
- 可以和现在的文档或任意另一个版本对比，改动的字词会标出来。改动旁的“恢复”只拿回这一处；“更多”里可以给版本命名或钉住（之后一直保留），或另开为新文档。在 Textus 之外的改动（别的应用、同步、git）也会留下改动前后的版本。
- **恢复** 会把旧内容作为一次修改提交给文档，你可以像其他修改一样接受或拒绝。**作为新文档打开** 则在旁边打开它。
- 版本保存在 Textus 里，不在你的文件夹中。超过 2 MB 的文档不保留版本；存储空间满了时，先删掉最旧的版本。

## 权限

- 读取文件和文档：保存每个版本，并和现在的内容比较。
- 提出修改：把旧版本作为一次修改送回文档，由你接受或拒绝。
- Textus AI 工具：让 Textus AI 能列出文档的版本并比较它们。

## 更新日志

- **0.5.1** - Its page shows its list of changes in English in every language. Its page receives Textus's messages by the API's current name.
- **0.5.0** - From Textus 1.4.4 the versions other plugins keep of a document - Cloud Sync's - are listed too, each under its source's name, to compare and restore like the rest.
- **0.4.1** - Restore is one word, so its button fits a narrow sidebar in every language.
- **0.4.0** - Versions thin out with age instead of the last 50 going; each text is stored once; a deleted document's versions go a month later. Compare any two versions, word by word; take back one change; name and pin versions; changes made outside Textus are kept. Versions from 0.3 move over by themselves. Needs Textus 1.4.3. In a Git folder on the desktop, the document's commits show under its versions.
- **0.3.8** - The text from before the first save is no longer lost when that save comes right as the document opens.
- **0.3.7** - The text a document had before its first save is kept as a version too, and a document's versions follow it when it is renamed or moved.
- **0.3.6** - Autosave while you type writes only the newest version, not every version of the document, so long documents save with much less work.
- **0.3.5** - An open version stays open while autosave updates it, and Restore always finds it. When storage is full, older versions of other documents make room, and the panel says when a save couldn't be kept. Rows work from the keyboard; buttons wrap in a narrow sidebar.
- **0.3.4** - In the sidebar the panel draws no title of its own, as the sidebar's other tabs. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.3.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - Only the path code shared with other plugins changed; nothing changes in use.
- **0.3.0** - Textus AI can list a document's versions and compare them (`list_versions`, `diff_versions`).
- **0.2.0** - Textus's own controls. Needs Textus 1.3.2.
- **0.1.0-0.1.3** - First versions: a version on each save, what changed since, restore as an edit to accept or reject, open as a new document, saves close together kept as one, versions grouped by day, the oldest dropped when storage is full.

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `list_versions`：列出一篇文档（默认当前文档）保存过的各个版本，最新的在前，从 1 开始编号，每个版本带保存时间和大小。
- `diff_versions`：逐行显示一篇文档两个版本之间、或某个版本与当前内容之间的改动：+ 表示新增，- 表示删除，并附少量上下文。
<!-- /ai-tools -->

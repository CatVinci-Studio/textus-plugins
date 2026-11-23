# 云同步

通过你自己的 S3 兼容存储、WebDAV 或坚果云，让一个文件夹在几台电脑上保持一致；云端保留历史版本，也可以选择在文件离开设备前先加密。

打开端到端加密后，服务商既看不到文件内容，也看不到文件名。需要 Textus 1.4.1 或更新版本。

## 开始使用

1. 在 Textus 里打开要同步的文件夹，再从 **插件 › 云同步**（或侧边栏云同步标签里的 **连接设置…**）打开面板。
2. 选择存储服务，填写服务器地址和账号。坚果云只需填邮箱和
   「账户信息 › 安全选项」里生成的应用密码。
3. 要加密的话，打开 **端到端加密**，设置一个至少 12 个字符的 **同步密码**，
   存进密码管理器——忘了无法重置。每个远端目录定一次，之后要切换需改用新的空目录。
4. 点 **保存连接**，再点 **立即同步**。

在另一台设备上：打开对应的文件夹，填同样的服务和同样的远端目录（加密的目录还要填
同样的同步密码），点立即同步即可。打开 **自动同步** 后（Textus 开着时），保存或重命名文件几秒后
就会同步，另外默认每 5 分钟兜底同步一次（**同步间隔** 可选 5 到 60 分钟）；删除的文件随下一次
同步传出。随时可以用 **插件 › 立即同步** 手动同步。

保存连接后，状态栏会显示同步状态：**已同步 · 2分钟前**、**正在同步…**、
**同步冲突** 或 **同步出错**，点击打开面板。

两台设备改了同一个文件时，两份都会留下：你本机的保留原位，另一台的放进
`Sync conflicts/`。

## 云端历史

每次同步替换或删除文件时，之前的内容会留在远端目录。在文件上右键选 **云端历史版本…**，
可以看到它的各个版本（时间、哪台设备、大小），打开一个查看，再点 **恢复这个版本**：
它成为当前文件并同步，被替换的版本仍留在历史里。如果那个文件有尚未同步的修改，或正开着，
版本会写在它旁边（`笔记 (3f2a9c1b).md`）。**插件 › 云端历史版本…** 列出从文件夹
删除的文件，打开一个即可找回。

**保留云端历史** 可选 30、90（默认）、365 天或永久，从版本被替换时算起。整个文件夹只有
一个设置：以任何设备上最后同步上去的选择为准，其他设备随之显示。一天内每小时留一个版本，之后
每天留一个，每个文件最多 200 个；历史记录超过 8 MB 时先删最旧的。每次有改动的同步，以及
每天一次，会清掉过期版本以及只被它们用到的分块。0.5 之前占用的空间（旧快照）不会回收。
请把所有设备都更新到 0.5：0.4 设备的改动要到下一次 0.5 同步才进入历史，它删除的文件在那之前
也不会列出。

**权限**：读写打开的文件夹（扫描和写入同步下来的文件）；连接任意网站（只连接你填写的
HTTPS 服务器）。没有统计、遥测、远程代码或自动更新。

## 同步行为

同步已保存的 Markdown、文本、CSV、Obsidian 的数据库（`.base`）和白板（`.canvas`）、
图片、PDF／Office 文档、音视频，以及
`.textus/` 中的项目指令、风格、资料库、记忆和技能。
不包含应用全局设置、聊天记录、未保存编辑、凭据或其他插件数据。
在设置里可以再排除一些文件：每行一条规则，写法同 `.gitignore`（`drafts/`、`*.pdf`、`!keep.pdf`）；
打开开关后，文件夹自己的 `.gitignore` 也算在内。被排除的文件在每台设备上都保持原样，不上传、不下载、不删除。
另一个开关同步 Obsidian 的共享设置（`.obsidian/` 下的 app、appearance、hotkeys、bookmarks、graph、
core-plugins、types 这几个 `.json`）；`workspace.json` 这类每台设备各自的文件不同步。

- 只传输变化内容，以 SHA-256 校验，2 MiB 分块复用。
- 双端同时修改时保留本地原文件，将远端版本放入 `Sync conflicts/`，两份都会同步。
- 下载目标文件仍在编辑器中打开时暂缓，保存并关闭后重新同步。
- 已存在的文本通过 Textus 安全编辑接口更新；二进制附件有差异时保留双方版本。
- 一台设备删除的文件，其他设备下次同步时也会删除，并移到系统废纸篓，可从那里恢复。
  删除的文件在云端历史里保留到历史不再保留它为止。重命名在其他设备上也是重命名。
- 内容要等历史不再保留它时才从服务器上删除：在那之前，能读远端目录的人（加密时还需知道
  同步密码）仍能读到已删除的文件。要彻底清除内容，请为清理后的工作区换一个新的远端目录。
- 编辑优先于删除：一边删了、另一边改过的文件会在所有设备上恢复为修改后的版本。
- 首次同步的文件夹不会删除任何文件，只有一边有的文件会复制到另一边。
- 一次同步要从云端删除很多文件（超过 10 个且超过文件夹的三成）时，会在删除前停下来问；
  自动同步只问一次，点「立即同步」会再问。重命名或移动的文件不算。之前同步过很多文件、
  这次却一个都没找到的文件夹，会被当作读不到（权限没了、文件没下载到本机），同步停下，什么都不删。
- 系统废纸篓收不下别处删除的文件时，它先留在原处，列在面板里，下次同步再试，
  这次同步的其余部分照常完成。
- 在标签页中打开的文件不会被删除或重命名，关闭后重新同步。
- 依赖删除同步前请把所有设备更新到 0.4：旧版会把别处删除的文件传回来。
- 单文件上限 128 MiB，不同步空目录；远端目录保存的是插件格式，不是文件镜像。

## 每次同步的请求数

由测试通过 HTTP 实测，本会话首次同步之后，一个小文档（S3 上首次同步另需 4 次
检查服务器的独占写入）：

| 同步内容                        | S3  | WebDAV／坚果云 |
| ------------------------------- | --- | -------------- |
| 没有变化                        | 3   | 3              |
| 改了一个文档（一个 2 MiB 分块） | 18  | 20             |
| 删了一个文件                    | 20  | 22             |

两边都没变化时，同步只读一下云端当前的版本号，不加锁。每多一个变化的分块只加
1 次：分块直接上传一次，不先问在不在，也不读回来（分块按内容命名，每次下载都会
逐块校验）。WebDAV 上分块要放进还没有的文件夹时多 2 次（被拒的上传和建文件夹）。保存触发的同步会等保存
停下 5 秒，再按 **同步延迟**（不延迟到 10 分钟）等一会儿：新连的坚果云默认 3 分钟
（坚果云按账号限制请求次数），S3 和 WebDAV 默认 0。服务器忙（429、503）时所有请求一起
暂停；服务器要求等待时状态栏显示「正在等服务器」和秒数，最多等 60 秒。要求等更久时，
这次同步先停下，提示稍后再试，已经传上去的部分下次接着用。

## 端到端加密

打开 **端到端加密** 后，云同步加密文件内容、文件名清单、历史和快照。一个远端目录要么加密、
要么不加密，插件不会混用。
使用 AES-256-GCM，每次加密生成随机 nonce，下载时先验证认证标签再写入文件。
同步密码通过 PBKDF2-SHA-256（60 万次迭代、随机盐）派生密钥，再通过 HKDF 分离
内容加密和分块命名密钥。云端分块名称使用 HMAC，不暴露原始内容哈希。

同步密码必须不同于存储服务的账号、应用密码或密钥，建议使用较长且独一无二的
密码短语，并在密码管理器中备份。密码只通过 Textus 的 secrets 保存在本机，
不会发送给云端，也不会回显。两项密码字段留空可保留之前保存的密码。
**密码无法重置来解密已有数据；重新填写密码不会给已有远端换密码。**

本机工作区文件保持可读。服务商仍能看到远端目录、对象大小、数量、分块复用和
访问时间，但不能在没有同步密码的情况下解密文件内容和文件名。
本机还会记录远端加密标识；密码错误、标识变化、密文被篡改时会停止同步。
该协议不保证识别服务商回放的旧合法密文，也不保护已被入侵的设备。
实现已做互操作和篡改测试，尚未接受独立安全审计。

请使用私有存储；网络传输继续使用 HTTPS。
访问账号需要专用同步目录的读写和删除权限，删除用于清理临时文件和锁。

## 把目录改为加密

远端目录不会原地转换。请先确保某台设备上的工作区包含需要保留的所有文件和冲突副本，
再选择**新的空远端目录**，打开加密、设置同步密码并完成首次上传。其他设备使用相同目录和
同步密码加入。

旧目录及其版本历史、备份仍然未加密，不会自动删除。验证新目录后，再通过服务商
自行管理旧副本。暂不支持原地修改加密密码；需要换密码时也应使用新的远端目录。

## 中断恢复

同步到一半时 Textus 被关掉或停下，这台设备留下的锁会在它下一次同步时自动收回，不用确认
（同步进行中每 10 秒更新一次本机对这把锁的记录；记录 30 秒没更新才收回，下一次同步开始得早就等到那时，
等的时候记录又更新了就不动它——那是另一个窗口里还在跑的同步）。
别的设备留下的锁不会自动收回：先确认所有设备均已停止同步，再使用
**同步卡住了？ › 清除遗留锁**。正常取消会等待当前请求结束后释放锁。
每个文件扫描到的大小、时间和哈希存在本机，重启后第一次同步只重读这期间改过的文件。
同步中途停下（取消、断网或被服务限速）时，已上传的分块记在本机，下次接着传、不再逐个检查；期间别的设备同步过则重新检查。
新附件下载中断时，下次同步会识别并续写本插件的占位标记，不会将标记上传。
重试前请保留插件本机数据；若文件已被其他应用修改，则保留修改后的内容。

远端 `v1/head.json` 现在是加密描述信息，保留旧路径以阻止旧版插件误上传明文；
真正的加密清单位于 `v2/head.bin`。请连同描述信息一起备份整个远端目录。
描述信息或密码丢失会导致远端数据无法解密；加密快照绑定自己的对象路径，
不能直接复制覆盖 `head.bin`。目前没有单快照恢复界面。

## 从社区插件切换

官方插件 ID 为 `catvinci.cloud-sync`，旧社区插件为 `ciao1019.cloud-sync`。
请先在旧插件中完成同步、恢复中断的下载，再关闭自动同步并禁用旧插件，备份工作区。

在官方插件中重新填写相同连接、完全一致的远端目录和同步密码。加密格式保持兼容，
已有 v0.2/v0.3 远端数据无需搬迁或重新加密。本机凭据、加密标识和同步基线不会跨
插件 ID 自动复制；首次同步会作为新设备加入，文件有差异时可能保留冲突副本。
不要同时开启两个插件对同一工作区的自动同步。v0.1 明文目录仍需按上文迁移。

详细格式、限制、开发方式和贡献者说明见 `README.md`。

## 更新日志

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

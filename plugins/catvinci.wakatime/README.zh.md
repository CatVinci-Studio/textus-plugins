# WakaTime

把你在 Textus 里写作的时间发到你的 [WakaTime](https://wakatime.com) 账号，和写代码的时间一起显示在统计面板上。

1. 在 [wakatime.com/settings/api-key](https://wakatime.com/settings/api-key) 复制你的 API 密钥。
2. 在 Textus 设置里 WakaTime 的页面点 **设置 API 密钥…**，粘贴进去。密钥保存在 Textus 的密钥存储里。

「插件」菜单和命令面板里有 **WakaTime：设置 API 密钥…**、**WakaTime：今天的写作时间**（显示 WakaTime 统计的今天总时长）和 **WakaTime：打开统计面板**。

## 哪些时间会算、发送什么

- 只算你自己在前台 Textus 窗口里的工作：打字、移动光标、切换文档和保存。Textus 挂在后台的时间、磁盘上或插件做的改动都不算。用 Textus AI 写的内容记为 AI coding。
- 每次工作时，它会告诉 WakaTime：文档的路径、语言（Markdown）、行数、项目和 Git 分支。项目取打开的文件夹里 `.wakatime-project` 文件的第一行，没有这个文件时用文件夹名。
- 同一个文档最多每两分钟发送一次，保存时一定发送，和 WakaTime 官方插件的做法一样。
- 离线时记录会先排队存着，联网后再分批发送。
- 设置密钥之前不会发送任何内容，没保存过的文档也不会发送。想停止时，把密钥设为空即可。

需要 Textus 1.3.0 或更新版本。插件需要读取编辑器和打开的文件夹里的文件（文档、行数、`.wakatime-project` 和 `.git/HEAD`），并只连接 `api.wakatime.com`，不访问其他网络地址。

## 更新日志

- **0.2.6** - Its icon is WakaTime's own logo.
- **0.2.5** - Set the API key with a button on its page in Settings, and find its commands in the Plugins menu: on a phone, with no command palette, too. Its page is in every language Textus speaks.
- **0.2.4** - Leaving the key empty now really turns it off; a garbled reply to Today's Writing Time shows the usual message.
- **0.2.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.2** - Finds `.wakatime-project` and the Git branch the same way on every system.
- **0.2.1** - Says where it runs: desktop and iPhone.
- **0.2.0** - Only your own work in a window in front counts; an offline queue sent in batches; project, branch and lines; Today's Writing Time.
- **0.1.0** - First version: writing time in Textus on your WakaTime dashboard.

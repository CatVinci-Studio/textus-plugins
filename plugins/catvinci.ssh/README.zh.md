# SSH 文件夹

通过你自己的 ssh 打开服务器上的文件夹，像本机文件夹一样写作：文档在标签页里，文件在侧边栏里。

## 它做什么

- **插件 › 打开远程文件夹…** 列出你 `~/.ssh/config` 里的服务器（也可以自己输入，比如 `me@server`），再填要打开的文件夹，默认是你在那台服务器上的主目录。
- 文件夹在侧边栏打开。文档的打开、保存、重命名、移动和搜索都和普通文件夹一样；新建的文档和文件夹直接建在服务器上。
- 连接由你自己的 `ssh` 建立，用你的配置、密钥、agent 和 known_hosts。只请求文件传输（SFTP），不开 shell，不执行命令。
- 连接断开后，下次读取或保存文件时会自动重连。

## 限制

- 只支持密钥或 agent 登录。需要密码的服务器会被拒绝，请先为它配置密钥。
- ssh 还不认识的服务器会被拒绝，不会替你接受：请先在终端里用 `ssh` 连一次，在那里接受它的密钥。
- 暂时不能往服务器上的文档里粘贴图片；删除的文件会直接删掉，服务器没有废纸篓。

## 权限

需要 **ssh** 权限：插件第一次连接某台服务器前，Textus 会先问你。

## 更新日志

- **0.1.2** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it. Its description no longer ends in "Desktop.": the store shows that.
- **0.1.1** - Uses the plugin API as Textus 1.4.6 ships it.
- **0.1.0** - First version. Needs Textus 1.4.6.

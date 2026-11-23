# Git

在桌面版上打开用 Git 管理的文件夹时：

- 侧栏标出上次提交后改过的文件：**M** 已修改，**A** 已添加，**U** 新文件、尚未加入 Git，**R** 已改名，**!** 有冲突。
- 在改过的文档里，含有上次提交之后新写的行（以保存的为准）的段落、标题或列表，右边页边有个标记，点一下提交（Textus 1.4.4）。
- 状态栏显示当前分支，↑ 是待推送的提交数，↓ 是待拉取的；点一下就能提交。
- **提交改动…**（插件菜单，或点分支）列出改过的文件，默认选中正在看的那个；写好说明后，由你自己的 Git 只提交这些文件，钩子和签名照常运行。在一个文件夹里第一次提交时会先问你。
- **推送**和**拉取**（插件菜单）用你自己的 Git 和它保存的登录信息，把分支推到远端，或把远端的提交拉进来；要是提示登录，先在终端里用 Git 登录一次。还没有远端分支的分支会推到 `origin`。会产生冲突的拉取会被撤销，什么都不改，并告诉你（Textus 1.4.6）。
- 装了版本历史 0.4 时，文档的提交显示在本地版本下面，一样能对比和恢复。
- Textus AI 能读改动、文件的提交历史和某次提交里的文件，比如帮你写提交说明。

不会切换分支。需要装好 Git（Mac 上是命令行工具）和 Textus 1.4.6。

## 更新日志

- **0.3.0** - Push and Pull, and what waits to be pushed or pulled beside the branch (Textus 1.4.6).
- **0.2.0** - Blocks changed since the last commit are marked in the margin (Textus 1.4.4).
- **0.1.1** - The first-commit confirmation's button reads "Commit".
- **0.1.0** - First version.

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `git_changes`：The open folder's branch and changed files, each changed text file's lines against its last commit. Read it before writing a commit message.
- `git_history`：A file's Git commits, newest first, through renames: hash, date, author, subject.
- `git_file_at`：A file's text as one of its commits had it (hash from git_history).
<!-- /ai-tools -->

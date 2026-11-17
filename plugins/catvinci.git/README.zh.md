# Git

在桌面版上打开用 Git 管理的文件夹时：

- 侧栏标出上次提交后改过的文件：**M** 已修改，**A** 已添加，**U** 新文件、尚未加入 Git，**R** 已改名，**!** 有冲突。
- 在改过的文档里，含有上次提交之后新写的行（以保存的为准）的段落、标题或列表，右边页边有个标记，点一下提交（Textus 1.4.4）。
- 状态栏显示当前分支，点一下就能提交。
- **提交改动…**（插件菜单，或点分支）列出改过的文件，默认选中正在看的那个；写好说明后，由你自己的 Git 只提交这些文件，钩子和签名照常运行。在一个文件夹里第一次提交时会先问你。
- 装了版本历史 0.4 时，文档的提交显示在本地版本下面，一样能对比和恢复。
- Textus AI 能读改动、文件的提交历史和某次提交里的文件，比如帮你写提交说明。

不会推送、拉取或切换分支。需要装好 Git（Mac 上是命令行工具）和 Textus 1.4.3。

## 更新

- **0.2.0** - 上次提交后改过的块在页边标出（Textus 1.4.4）。
- **0.1.1** - 第一次提交的确认按钮改为"提交"。
- **0.1.0** - 第一版。

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `git_changes`：The open folder's branch and changed files, each changed text file's lines against its last commit. Read it before writing a commit message.
- `git_history`：A file's Git commits, newest first, through renames: hash, date, author, subject.
- `git_file_at`：A file's text as one of its commits had it (hash from git_history).
<!-- /ai-tools -->

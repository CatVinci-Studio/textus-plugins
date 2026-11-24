# Vim

在 Textus 编辑器里使用 Vim 的模式和按键。

- **插件 › 打开或关闭 Vim 按键** 切换开关。打开时，状态栏显示当前模式（NORMAL、INSERT、VISUAL、V-LINE），从它的菜单可以关闭 Vim。
- 普通、插入、可视、可视行四种模式，支持移动（**h j k l**、**w b e**、**0 ^ $**、**gg G**、**f t F T** 及 **;** 和 **,**、**Ctrl+D** 和 **Ctrl+U**）、操作符（**d c y**、**dd**、**x**、**p P**、**r**，以及 **iw**／**aw**）、计数、寄存器、**u** 和 **Ctrl+R** 撤销重做，以及 **.** 重复。
- 一“行”是一个段落、标题、列表项，或代码块里的一行：**j** 和 **k** 能走遍它们，**}** 和 **{** 按块跳。**zz**、**zt**、**zb** 把光标所在行移到窗口中间、顶部或底部。
- **~** 切换光标处字母的大小写；在可视模式下，**~**、**U** 和 **u** 分别把选中内容切换大小写、改成大写、改成小写。
- 按 **s** 加一个字母，再按标签，就能跳到屏幕上任何位置（flash），离光标近的位置先拿到标签。先按 **d**、**c** 或 **y** 再按 **s**，就是删除、修改或复制到那里。
- 按 **:** 打开命令面板，Vim 的命令排在最前：**:w** 保存，**:q** 关闭标签页，**:wq** 保存并关闭，**:12** 跳到第 12 行，**:u** 和 **:redo** 撤销和重做；Textus 的其他命令也能在这里搜到。
- 在 Mac 上，普通模式下会暂时切到英文输入，拼音等输入法不会拦住按键；回到插入模式，原来的输入法自动回来。

设置在 **设置 › 扩展 › 插件 › Vim** 里：

- **用 s 跳转（flash）**：默认打开。关掉后，**s** 恢复 Vim 原本的作用（删除一个字符并进入插入）。
- **退出插入模式的按键**：在插入模式下快速连按、作用等同 Escape 的两个字母，比如 `jk`。留空则只有 Escape 和 **Ctrl+[**。
- **按键映射**：像 vimrc 一样一行一条（`map`、`noremap`、`nnoremap`、`inoremap`、`vnoremap` 和 `let mapleader`），比如 `inoremap jj <Esc>` 或 `nnoremap <leader>w :w<CR>`。

Obsidian：在 Obsidian 库里，还会读取库里的 `.obsidian.vimrc`（Vimrc Support 插件用的文件），排在你自己的设置之后；文件改了会重新读取。请直接打开整个库，而不是库里的文件夹。

插件申请在编辑器里接管按键的权限（用来执行 Vim 按键）和读取文件的权限（只用来读 `.obsidian.vimrc`）。

## 更新日志

- **0.2.10** - Its page no longer says which devices it runs on: the store shows that. It hears keys by the API's current name, and the old one on an older Textus.
- **0.2.9** - Needs Textus 1.3.0-beta.8 or later, the first with everything it uses.
- **0.2.8** - Desktop only: a phone's on-screen keyboard types its letters into the text instead of running them as Vim keys.
- **0.2.7** - The status bar's mode opens a menu that turns Vim off; `.obsidian.vimrc` is read again when you come back to Textus; leaving visual mode with **:** always works.
- **0.2.6** - Shorter help and empty-state text.
- **0.2.5** - Its code is split into smaller files by what each part does; nothing changes in use.
- **0.2.4** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.3** - Reads an Obsidian vault's `.obsidian.vimrc`; mapping the same keys again replaces the earlier mapping.
- **0.2.2** - **zz**, **zt** and **zb** bring the caret's line to the middle, top or bottom of the window.
- **0.2.1** - Says where it runs: the desktop, iPhone and iPad.
- **0.2.0** - **:** opens the command palette with Vim's commands first; flash shows its labels after one letter; normal mode types Roman on a Mac.
- **0.1.0-0.1.1** - First versions: modes, motions, operators, counts, dot repeat, flash with **ds**, **cs** and **ys**, the command line (**:w**, **:q**, **:wq**, **:12**), vimrc key mappings and the case keys.

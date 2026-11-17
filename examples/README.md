# Examples

Small plugins that work, one for each kind, to start yours from:

| Folder | What it shows |
| --- | --- |
| [hello/](hello/) | A command under the Plugins menu and a sidebar list Textus draws |
| [page/](page/) | A sidebar page of its own, with Textus's controls, dragging and a date picker (API 1.7) |
| [code-block/](code-block/) | A fenced code block drawn by the plugin |
| [ai-tool/](ai-tool/) | A tool Textus AI calls, and a setting |
| [ai-model/](ai-model/) | Asking the user's writing model, and grey-text completion (API 1.8) |
| [export-format/](export-format/) | A format in File › Export, and a right-click menu item (API 1.8) |
| [syntax/](syntax/) | Inline syntax of its own, `||spoilers||` and readings over words (API 1.8, preview) |

Copy one with `node packages/create-textus-plugin/index.mjs <folder> --from <kind> --id <you>.<name>`, or by hand, then load the folder in **Settings › Extensions › Plugins › Load a plugin folder…**. Check it with `node packages/textus-plugin/cli.mjs check <folder>`.

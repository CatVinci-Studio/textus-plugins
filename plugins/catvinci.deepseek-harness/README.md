# DeepSeek Harness

Talk to DeepSeek Harness, DeepSeek's own agent, in Textus AI. It reads the open folder, writes and edits your notes, and asks before each change: Textus shows what it wants to do, and you allow it or not. What it changed is marked in the document, one undo away.

1. Install [Node.js](https://nodejs.org) 24.9 or later if this computer doesn't have it.
2. Give it your DeepSeek API key once: run `npx -y @deepseek-ai/dsh@0.2.2-rc.1 web` in a terminal and add the key on its Models page.
3. Click the DeepSeek Harness button at the top right of the window, beside Textus AI's.

Textus starts [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) with `dsh --profile acp`, its Agent Client Protocol server, run with `npx`. Your key and its usage are DeepSeek's; Textus keeps no key for it. DeepSeek Harness is a preview release, so its behaviour may change.

Textus starts it in its read-only sandbox: it reads and searches freely, and asks before it writes a file or runs a command that changes something.

DeepSeek Harness sends its session logs to DeepSeek by default; turn that off in `dsh web`, Settings › General. Textus turns its usage reports off.

It needs Textus 1.4.3 or later. It asks for one permission: to start this agent on this computer.

## Changes

- **0.1.3** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.2** - Asks before writing files or running commands that change things (before, it did both without asking). Usage reports off, and the setup names the exact version and Node.js 24.9. Needs Textus 1.4.3.
- **0.1.1** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.0** - First version: DeepSeek Harness in Textus AI.

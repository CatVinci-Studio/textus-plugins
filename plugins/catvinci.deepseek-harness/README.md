# DeepSeek Harness

Talk to DeepSeek Harness, DeepSeek's own agent, in Textus AI. It reads the open folder, writes and edits your notes, and asks before each change: Textus shows what it wants to do, and you allow it or not. What it changed is marked in the document, one undo away.

1. Install [Node.js](https://nodejs.org) if it isn't on this computer.
2. Give it your DeepSeek API key once: run `npx @deepseek-ai/dsh web` in a terminal and add the key in the page it opens (or set `DEEPSEEK_API_KEY`).
3. Click the DeepSeek Harness button at the top right of the window, beside Textus AI's.

Textus starts [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) with `dsh --profile acp`, its Agent Client Protocol server, run with `npx`. Your key and its usage are DeepSeek's; Textus keeps no key for it. DeepSeek Harness is a preview release, so its behaviour may change.

It works on the desktop and needs Textus 1.4 or later. It asks for one permission: to start this agent on this computer.

## Changes

- **0.1.0** - First version: DeepSeek Harness in Textus AI.

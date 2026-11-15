# Qwen Code

Talk to Qwen Code in Textus AI, with Alibaba's Qwen models. It reads the open folder, writes and edits your notes, and asks before each change: Textus shows what it wants to do, and you allow it or not. What it changed is marked in the document, one undo away. Its mode (ask first, accept edits, decide by itself, accept everything, plan), model and thinking are in the menu beside Textus AI's model menu.

1. Install [Node.js](https://nodejs.org) 22 or later if it isn't on this computer.
2. Once, in a terminal: run `npx @qwen-code/qwen-code`, then `/auth` to set an API key (Alibaba Cloud Model Studio, or any OpenAI-compatible service).
3. Click the Qwen Code button at the top right of the window, beside Textus AI's.

Textus starts [Qwen Code](https://github.com/QwenLM/qwen-code) with `qwen --acp`, its Agent Client Protocol server, run with `npx`. Your key and its usage are your provider's; Textus keeps no key for it.

It works on the desktop and needs Textus 1.4.2 or later; its mode and model menus need Textus 1.4.3. It asks for one permission: to start this agent on this computer.

## Changes

- **0.1.0** - First version: Qwen Code in Textus AI.

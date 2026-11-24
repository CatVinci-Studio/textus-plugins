# Qwen Code

Talk to Qwen Code in Textus AI, with Alibaba's Qwen models. It reads the open folder, writes and edits your notes, and asks before each change: Textus shows what it wants to do, and you allow it or not. What it changed is marked in the document, one undo away. Its mode (ask first, accept edits, decide by itself, accept everything, plan), model and thinking are in the menu beside Textus AI's model menu.

1. Install [Node.js](https://nodejs.org) 22 or later if it isn't on this computer.
2. Give it an API key once: put `OPENAI_API_KEY`, `OPENAI_BASE_URL` and `OPENAI_MODEL` in `~/.qwen/.env` (for OpenRouter, the base URL is `https://openrouter.ai/api/v1`), or run `npx @qwen-code/qwen-code` in a terminal and use `/auth` (Alibaba Cloud Model Studio, or any OpenAI-compatible service).
3. Click the Qwen Code button at the top right of the window, beside Textus AI's.

Textus starts [Qwen Code](https://github.com/QwenLM/qwen-code) with `qwen --acp`, its Agent Client Protocol server, run with `npx`. Your key and its usage are your provider's; Textus keeps no key for it.

It starts in ask first. Its "Always allow" choices for commands are saved by Qwen Code for good, in the project or for you.

It needs Textus 1.4.3 or later. It asks for one permission: to start this agent on this computer.

## Changes

- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: Qwen Code in Textus AI.

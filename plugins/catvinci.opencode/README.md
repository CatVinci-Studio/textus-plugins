# OpenCode

Talk to OpenCode in Textus AI, with whichever model you set it up with. It reads the open folder, writes and edits your notes, and asks before each change: Textus shows what it wants to do, and you allow it or not. What it changed is marked in the document, one undo away. To let it work without asking, pick Allow all in the menu beside the model (Textus 1.4.3 or later).

1. Install [Node.js](https://nodejs.org) if it isn't on this computer.
2. It works at once with OpenCode's free models. For your own provider (OpenRouter among them), sign in once in a terminal: `npx -y opencode-ai@1.19.5 auth login`.
3. Click the OpenCode button at the top right of the window, beside Textus AI's.

Textus starts [OpenCode](https://opencode.ai) with `opencode acp`, its Agent Client Protocol server, run with `npx`. Your accounts and their usage are OpenCode's own; Textus keeps no key for it.

It asks before edits, commands and web fetches; in plan mode it doesn't edit. Its sub-agents are off for now: OpenCode doesn't pass on their questions, so a turn would wait forever.

It works on the desktop and needs Textus 1.4.3 or later. It asks for one permission: to start this agent on this computer.

## Changes

- **0.1.3** - Asks before web fetches too, plan mode no longer edits, and sub-agents are off (their questions never arrived, so a turn hung). Needs Textus 1.4.3.
- **0.1.2** - Asks before each edit and command, as it says: OpenCode on its own allowed them unasked.
- **0.1.1** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.0** - First version: OpenCode in Textus AI.

# OpenCode

Talk to OpenCode in Textus AI, with whichever model you set it up with. It reads the open folder, writes and edits your notes, and asks before each change: Textus shows what it wants to do, and you allow it or not. What it changed is marked in the document, one undo away.

1. Install [Node.js](https://nodejs.org) if it isn't on this computer.
2. Sign OpenCode in to a model provider once: run `opencode auth login` in a terminal.
3. Click the OpenCode button at the top right of the window, beside Textus AI's.

Textus starts [OpenCode](https://opencode.ai) with `opencode acp`, its Agent Client Protocol server, run with `npx`. Your accounts and their usage are OpenCode's own; Textus keeps no key for it.

It works on the desktop and needs Textus 1.4 or later. It asks for one permission: to start this agent on this computer.

## Changes

- **0.1.1** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.0** - First version: OpenCode in Textus AI.

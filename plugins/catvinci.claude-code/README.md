# Claude Code

Talk to Claude Code in Textus AI. It reads the open folder, writes and edits your notes, and asks before each change: Textus shows what it wants to do, and you allow it or not. What it changed is marked in the document, one undo away.

1. Install [Node.js](https://nodejs.org) if it isn't on this computer.
2. Sign in to Claude Code once: run `claude` in a terminal and sign in.
3. Click the Claude Code button at the top right of the window, beside Textus AI's, or pick **Claude Code** in Textus AI's model menu.

Textus starts Anthropic's Claude Code through the Agent Client Protocol adapter `@agentclientprotocol/claude-agent-acp`, run with `npx`. Your account and its usage are Claude Code's own; Textus keeps no key for it.

It works on the desktop and needs Textus 1.3.13 or later. It asks for one permission: to start this agent on this computer.

## Changes

- **0.1.0** - First version: Claude Code in Textus AI.

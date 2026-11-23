# Claude Code

Talk to Claude Code in Textus AI. It reads the open folder, writes and edits your notes, and asks before each change: Textus shows what it wants to do, and you allow it or not. What it changed is marked in the document, one undo away.

1. Install [Node.js](https://nodejs.org) if it isn't on this computer.
2. Sign in to Claude Code once, in a terminal: `npx -y @agentclientprotocol/claude-agent-acp@0.107.0 --cli auth login --claudeai` (or run `claude` if it is installed).
3. Click the Claude Code button at the top right of the window, beside Textus AI's, or pick **Claude Code** in Textus AI's model menu.

Textus starts Anthropic's Claude Code through the Agent Client Protocol adapter `@agentclientprotocol/claude-agent-acp`, run with `npx`. Your account and its usage are Claude Code's own; Textus keeps no key for it.

It starts in Claude Code's **Manual** mode, which asks before each edit and command; pick another mode in the menu beside the model. To run it through OpenRouter, put `ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN` and an empty `ANTHROPIC_API_KEY` in the `env` block of `~/.claude/settings.json`: Textus opened from the Dock doesn't see variables set in a terminal.

It needs Textus 1.4.3 or later. It asks for one permission: to start this agent on this computer.

## Changes

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Starts in Manual mode, named by the plugin; its sign-in command needs no separate Claude Code install. Needs Textus 1.4.3, which also marks the changes Claude Code writes itself.
- **0.1.2** - Uses Claude Code's ACP adapter 0.107.0. Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.1** - While Claude Code answers, other plugins (such as the desk pet) know which AI is at work.
- **0.1.0** - First version: Claude Code in Textus AI.

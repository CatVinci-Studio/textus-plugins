# GitHub Copilot CLI

Talk to GitHub Copilot CLI in Textus AI, with the models of your Copilot plan. It reads the open folder, writes and edits your notes, and asks before each change: Textus shows what it wants to do, and you allow it or not. What it changed is marked in the document, one undo away. Its mode (agent, plan, autopilot), model and "allow all" switch are in the menu beside Textus AI's model menu; "allow all" starts off.

1. Install [Node.js](https://nodejs.org) if it isn't on this computer. You need a GitHub Copilot plan.
2. Once, in a terminal: `npx @github/copilot login`.
3. Click the GitHub Copilot CLI button at the top right of the window, beside Textus AI's.

Textus starts [GitHub Copilot CLI](https://github.com/github/copilot-cli) with `copilot --acp`, its Agent Client Protocol server, run with `npx`. Copilot CLI is GitHub's own software under its own licence; your account and its usage are GitHub's, and Textus keeps no token for it.

Autopilot keeps going on its own and uses more premium requests. Textus keeps the version it starts: Copilot doesn't update itself here.

It needs Textus 1.4.3 or later. It asks for one permission: to start this agent on this computer.

## Changes

- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: GitHub Copilot CLI in Textus AI.

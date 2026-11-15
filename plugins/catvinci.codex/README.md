# Codex

Talk to Codex in Textus AI. It reads the open folder, writes and edits your notes, and asks before each change: Textus shows what it wants to do, and you allow it or not. What it changed is marked in the document, one undo away.

1. Install [Node.js](https://nodejs.org) if it isn't on this computer.
2. The first time, a browser opens to sign in with ChatGPT; or sign in once in a terminal: `npx -y @agentclientprotocol/codex-acp@2.6.0 cli login`.
3. Click the Codex button at the top right of the window, beside Textus AI's, or pick **Codex** in Textus AI's model menu.

Textus starts OpenAI's Codex through the Agent Client Protocol adapter `@agentclientprotocol/codex-acp`, run with `npx`. Your account and its usage are Codex's own; Textus keeps no key for it.

It starts in **Read-only**, the mode that asks before every edit and command; pick another in the menu beside the model.

It works on the desktop and needs Textus 1.4.3 or later. It asks for one permission: to start this agent on this computer.

## Changes

- **0.1.3** - Signs in with ChatGPT in the browser (before, it tried an API key and stopped there), and starts in Read-only. Needs Textus 1.4.3, which also marks the changes Codex writes itself.
- **0.1.2** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.1** - While Codex answers, other plugins (such as the desk pet) know which AI is at work.
- **0.1.0** - First version: Codex in Textus AI.

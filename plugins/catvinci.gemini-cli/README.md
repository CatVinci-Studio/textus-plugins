# Gemini CLI

Talk to Gemini CLI in Textus AI, with Google's Gemini models. It reads the open folder, writes and edits your notes, and asks before each change: Textus shows what it wants to do, and you allow it or not. What it changed is marked in the document, one undo away. Its mode (ask first, accept edits, accept everything, plan) and model are in the menu beside Textus AI's model menu.

1. Install [Node.js](https://nodejs.org) if it isn't on this computer.
2. Click the Gemini CLI button at the top right of the window, beside Textus AI's. The first time, a browser opens to sign in with your Google account. To use an API key instead, set `GEMINI_API_KEY` before starting Textus.

Textus starts [Gemini CLI](https://github.com/google-gemini/gemini-cli) with `gemini --acp`, its Agent Client Protocol server, run with `npx`. Your account and its usage are Google's; Textus keeps no key for it.

It works on the desktop and needs Textus 1.4.2 or later; its mode and model menus need Textus 1.4.3. It asks for one permission: to start this agent on this computer.

## Changes

- **0.1.0** - First version: Gemini CLI in Textus AI.

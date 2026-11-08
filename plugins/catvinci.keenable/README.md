# Keenable Search

Let Textus AI search the web with [Keenable](https://keenable.ai).

- Textus AI uses it in a conversation when you ask for Keenable, or when its own web search isn't set up. It gets 5 results by default (up to 10), each with a title, an address, a short text and a date.
- It works without a key, through Keenable's public search. For Keenable's full search, open the command palette (**Ctrl+Shift+P**, **⌘⇧P** on a Mac), run **Keenable: Set API Key…** and paste your key. Run it again and leave the box empty to remove the key and go back to the public search. The key is kept in Textus's secret storage on this device.
- What you ask is sent to Keenable only when Textus AI uses this tool in a conversation.

The plugin asks for two permissions: AI tools, to give Textus AI the search tool below, and network access to `api.keenable.ai` only, to run the searches. It works on the desktop and on iPhone and iPad.

## Changes

- **0.1.0** - First version: web search for Textus AI through Keenable, with or without an API key.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `keenable_search`: Searches the web with Keenable and returns each result's title, URL, a short text and its date. Use it when the user asks for Keenable, or when Textus AI's own web search isn't set up.
<!-- /ai-tools -->

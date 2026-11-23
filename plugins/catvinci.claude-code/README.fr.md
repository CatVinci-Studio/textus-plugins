# Claude Code

Discutez avec Claude Code dans Textus AI. Il lit le dossier ouvert, écrit et modifie vos notes, et demande avant chaque changement : Textus montre ce qu’il veut faire, et vous l’autorisez ou non. Ce qu’il a changé est marqué dans le document, à une annulation près.

1. Installez [Node.js](https://nodejs.org) s’il n’est pas sur cet ordinateur.
2. Connectez-vous une fois à Claude Code, dans un terminal : `npx -y @agentclientprotocol/claude-agent-acp@0.107.0 --cli auth login --claudeai` (ou lancez `claude` s’il est installé).
3. Cliquez sur le bouton Claude Code en haut à droite de la fenêtre, à côté de celui de Textus AI, ou choisissez **Claude Code** dans le menu des modèles de Textus AI.

Textus lance le Claude Code d’Anthropic par l’adaptateur Agent Client Protocol `@agentclientprotocol/claude-agent-acp`, exécuté avec `npx`. Votre compte et son usage sont ceux de Claude Code ; Textus ne garde aucune clé pour lui.

Il démarre dans le mode **Manual** de Claude Code, qui demande avant chaque modification et chaque commande ; choisissez un autre mode dans le menu à côté du modèle. Pour passer par OpenRouter, mettez `ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN` et un `ANTHROPIC_API_KEY` vide dans le bloc `env` de `~/.claude/settings.json` : Textus ouvert depuis le Dock ne voit pas les variables définies dans un terminal.

Il demande Textus 1.4.3 ou plus récent. Il demande une seule permission : lancer cet agent sur cet ordinateur.

## Changements

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Starts in Manual mode, named by the plugin; its sign-in command needs no separate Claude Code install. Needs Textus 1.4.3, which also marks the changes Claude Code writes itself.
- **0.1.2** - Uses Claude Code's ACP adapter 0.107.0. Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.1** - While Claude Code answers, other plugins (such as the desk pet) know which AI is at work.
- **0.1.0** - First version: Claude Code in Textus AI.

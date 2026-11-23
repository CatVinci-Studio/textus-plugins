# Codex

Discutez avec Codex dans Textus AI. Il lit le dossier ouvert, écrit et modifie vos notes, et demande avant chaque changement : Textus montre ce qu’il veut faire, et vous l’autorisez ou non. Ce qu’il a changé est marqué dans le document, à une annulation près.

1. Installez [Node.js](https://nodejs.org) s’il n’est pas sur cet ordinateur.
2. La première fois, un navigateur s’ouvre pour vous connecter avec ChatGPT ; ou connectez-vous une fois dans un terminal : `npx -y @agentclientprotocol/codex-acp@2.6.0 cli login`.
3. Cliquez sur le bouton Codex en haut à droite de la fenêtre, à côté de celui de Textus AI, ou choisissez **Codex** dans le menu des modèles de Textus AI.

Textus lance le Codex d’OpenAI par l’adaptateur Agent Client Protocol `@agentclientprotocol/codex-acp`, exécuté avec `npx`. Votre compte et son usage sont ceux de Codex ; Textus ne garde aucune clé pour lui.

Il démarre en **Read-only**, le mode qui demande avant chaque modification et chaque commande ; choisissez-en un autre dans le menu à côté du modèle.

Il demande Textus 1.4.3 ou plus récent. Il demande une seule permission : lancer cet agent sur cet ordinateur.

## Changements

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Signs in with ChatGPT in the browser (before, it tried an API key and stopped there), and starts in Read-only. Needs Textus 1.4.3, which also marks the changes Codex writes itself.
- **0.1.2** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.1** - While Codex answers, other plugins (such as the desk pet) know which AI is at work.
- **0.1.0** - First version: Codex in Textus AI.

# Gemini CLI

Discutez avec Gemini CLI dans Textus AI, avec les modèles Gemini de Google. Il lit le dossier ouvert, écrit et modifie vos notes, et demande avant chaque changement : Textus montre ce qu’il veut faire, et vous l’autorisez ou non. Ce qu’il a changé est marqué dans le document, à une annulation près. Son mode (demander d’abord, accepter les modifications, tout accepter, plan) et son modèle sont dans le menu à côté du menu des modèles de Textus AI.

1. Installez [Node.js](https://nodejs.org) s’il n’est pas sur cet ordinateur.
2. Cliquez sur le bouton Gemini CLI en haut à droite de la fenêtre, à côté de celui de Textus AI. La première fois, un navigateur s’ouvre pour vous connecter avec votre compte Google. Pour une clé d’API Gemini ou Vertex AI, lancez une fois `npx @google/gemini-cli` dans un terminal et choisissez-la avec `/auth` (Textus ouvert depuis le Dock ne voit pas les variables définies dans un terminal).

Textus lance [Gemini CLI](https://github.com/google-gemini/gemini-cli) avec `gemini --acp`, son serveur Agent Client Protocol, exécuté avec `npx`. Votre compte et son usage relèvent de Google ; Textus ne garde aucune clé pour lui.

« Accepter les modifications » et « tout accepter » ne fonctionnent que dans les dossiers que vous avez déclarés de confiance dans Gemini CLI lui-même ; ailleurs, il reste sur « demander d’abord ».

Il demande Textus 1.4.3 ou plus récent. Il demande une seule permission : lancer cet agent sur cet ordinateur.

## Changements

- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: Gemini CLI in Textus AI.

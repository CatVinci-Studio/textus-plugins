# GitHub Copilot CLI

Discutez avec GitHub Copilot CLI dans Textus AI, avec les modèles de votre abonnement Copilot. Il lit le dossier ouvert, écrit et modifie vos notes, et demande avant chaque changement : Textus montre ce qu’il veut faire, et vous l’autorisez ou non. Ce qu’il a changé est marqué dans le document, à une annulation près. Son mode (agent, plan, autopilot), son modèle et l’interrupteur « allow all » sont dans le menu à côté du menu des modèles de Textus AI ; « allow all » est désactivé au départ.

1. Installez [Node.js](https://nodejs.org) s’il n’est pas sur cet ordinateur. Il vous faut un abonnement GitHub Copilot.
2. Une fois, dans un terminal : `npx @github/copilot login`.
3. Cliquez sur le bouton GitHub Copilot CLI en haut à droite de la fenêtre, à côté de celui de Textus AI.

Textus lance [GitHub Copilot CLI](https://github.com/github/copilot-cli) avec `copilot --acp`, son serveur Agent Client Protocol, exécuté avec `npx`. Copilot CLI est le logiciel de GitHub, sous sa propre licence ; votre compte et son usage relèvent de GitHub, et Textus ne garde aucun jeton pour lui.

Autopilot continue tout seul et consomme davantage de requêtes premium. Textus garde la version qu’il lance : ici, Copilot ne se met pas à jour lui-même.

Il demande Textus 1.4.3 ou plus récent. Il demande une seule permission : lancer cet agent sur cet ordinateur.

## Changements

- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: GitHub Copilot CLI in Textus AI.

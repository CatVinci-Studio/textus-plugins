# OpenCode

Discutez avec OpenCode dans Textus AI, avec le modèle que vous lui avez configuré. Il lit le dossier ouvert, écrit et modifie vos notes, et demande avant chaque changement : Textus montre ce qu’il veut faire, et vous l’autorisez ou non. Ce qu’il a changé est marqué dans le document, à une annulation près. Pour le laisser travailler sans demander, choisissez Allow all dans le menu à côté du modèle (Textus 1.4.3 ou plus récent).

1. Installez [Node.js](https://nodejs.org) s’il n’est pas sur cet ordinateur.
2. Il fonctionne tout de suite avec les modèles gratuits d’OpenCode. Pour votre propre fournisseur (OpenRouter, entre autres), connectez-vous une fois dans un terminal : `npx -y opencode-ai@1.19.5 auth login`.
3. Cliquez sur le bouton OpenCode en haut à droite de la fenêtre, à côté de celui de Textus AI.

Textus lance [OpenCode](https://opencode.ai) avec `opencode acp`, son serveur Agent Client Protocol, exécuté avec `npx`. Vos comptes et leur usage sont ceux d’OpenCode ; Textus ne garde aucune clé pour lui.

Il demande avant les modifications, les commandes et les récupérations de pages web ; en mode plan, il ne modifie rien. Ses sous-agents sont désactivés pour l’instant : OpenCode ne transmet pas leurs questions, et un tour attendrait sans fin.

Il demande Textus 1.4.3 ou plus récent. Il demande une seule permission : lancer cet agent sur cet ordinateur.

## Changements

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Asks before web fetches too, plan mode no longer edits, and sub-agents are off (their questions never arrived, so a turn hung). Needs Textus 1.4.3.
- **0.1.2** - Asks before each edit and command, as it says: OpenCode on its own allowed them unasked.
- **0.1.1** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.0** - First version: OpenCode in Textus AI.

# DeepSeek Harness

Discutez avec DeepSeek Harness, l’agent de DeepSeek, dans Textus AI. Il lit le dossier ouvert, écrit et modifie vos notes, et demande avant chaque changement : Textus montre ce qu’il veut faire, et vous l’autorisez ou non. Ce qu’il a changé est marqué dans le document, à une annulation près.

1. Installez [Node.js](https://nodejs.org) 24.9 ou plus récent si cet ordinateur ne l’a pas.
2. Donnez-lui une fois votre clé d’API DeepSeek : lancez `npx -y @deepseek-ai/dsh@0.2.2-rc.1 web` dans un terminal et ajoutez la clé sur sa page Models.
3. Cliquez sur le bouton DeepSeek Harness en haut à droite de la fenêtre, à côté de celui de Textus AI.

Textus lance [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) avec `dsh --profile acp`, son serveur Agent Client Protocol, exécuté avec `npx`. Votre clé et son usage relèvent de DeepSeek ; Textus ne garde aucune clé pour lui. DeepSeek Harness est une version préliminaire : son comportement peut changer.

Textus le lance dans son bac à sable en lecture seule : il lit et cherche librement, et demande avant d’écrire un fichier ou de lancer une commande qui change quelque chose.

Par défaut, DeepSeek Harness envoie ses journaux de session à DeepSeek ; désactivez-le dans `dsh web`, Settings › General. Textus désactive ses rapports d’usage.

Il demande Textus 1.4.3 ou plus récent. Il demande une seule permission : lancer cet agent sur cet ordinateur.

## Changements

- **0.1.3** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.2** - Asks before writing files or running commands that change things (before, it did both without asking). Usage reports off, and the setup names the exact version and Node.js 24.9. Needs Textus 1.4.3.
- **0.1.1** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.0** - First version: DeepSeek Harness in Textus AI.

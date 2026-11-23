# Qwen Code

Discutez avec Qwen Code dans Textus AI, avec les modèles Qwen d’Alibaba. Il lit le dossier ouvert, écrit et modifie vos notes, et demande avant chaque changement : Textus montre ce qu’il veut faire, et vous l’autorisez ou non. Ce qu’il a changé est marqué dans le document, à une annulation près. Son mode (demander d’abord, accepter les modifications, décider seul, tout accepter, plan), son modèle et sa réflexion sont dans le menu à côté du menu des modèles de Textus AI.

1. Installez [Node.js](https://nodejs.org) 22 ou plus récent s’il n’est pas sur cet ordinateur.
2. Donnez-lui une fois une clé d’API : mettez `OPENAI_API_KEY`, `OPENAI_BASE_URL` et `OPENAI_MODEL` dans `~/.qwen/.env` (pour OpenRouter, l’URL de base est `https://openrouter.ai/api/v1`), ou lancez `npx @qwen-code/qwen-code` dans un terminal et utilisez `/auth` (Alibaba Cloud Model Studio, ou tout service compatible OpenAI).
3. Cliquez sur le bouton Qwen Code en haut à droite de la fenêtre, à côté de celui de Textus AI.

Textus lance [Qwen Code](https://github.com/QwenLM/qwen-code) avec `qwen --acp`, son serveur Agent Client Protocol, exécuté avec `npx`. Votre clé et son usage relèvent de votre fournisseur ; Textus ne garde aucune clé pour lui.

Il démarre en « demander d’abord ». Ses choix « Always allow » pour les commandes sont enregistrés pour de bon par Qwen Code, dans le projet ou pour vous.

Il demande Textus 1.4.3 ou plus récent. Il demande une seule permission : lancer cet agent sur cet ordinateur.

## Changements

- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: Qwen Code in Textus AI.

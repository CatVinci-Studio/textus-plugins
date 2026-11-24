# Recherche Keenable

Permet à Textus AI de chercher sur le web avec [Keenable](https://keenable.ai).

- Textus AI s’en sert dans une conversation quand vous demandez Keenable, ou quand sa propre recherche web n’est pas configurée. Il reçoit 5 résultats par défaut (jusqu’à 10), chacun avec un titre, une adresse, un court texte et une date.
- Il fonctionne sans clé, par la recherche publique de Keenable. Pour la recherche complète de Keenable, cliquez sur **Définir la clé d’API…** sur sa page dans les Réglages de Textus (ou lancez **Keenable : définir la clé d’API…** depuis la palette de commandes) et collez votre clé. Recommencez en laissant le champ vide pour retirer la clé et revenir à la recherche publique. La clé est gardée dans le stockage secret de Textus sur cet appareil.
- Ce que vous demandez n’est envoyé à Keenable que lorsque Textus AI utilise cet outil dans une conversation.

Le plugin demande deux permissions : les outils d’IA, pour donner à Textus AI l’outil de recherche ci-dessous, et l’accès réseau à `api.keenable.ai` seulement, pour lancer les recherches.

## Changements

- **0.1.3** - Set the API key with a button on its page in Settings: on a phone, with no command palette, too. Its page is in every language Textus speaks.
- **0.1.2** - Removing the API key really removes it, so search goes back to the public search; an unreadable answer gets a plain message.
- **0.1.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.0** - First version: web search for Textus AI through Keenable, with or without an API key.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `keenable_search`: Cherche sur le web avec Keenable et renvoie pour chaque résultat le titre, l'URL, un court texte et la date. À utiliser quand l'utilisateur demande Keenable, ou quand la recherche web de Textus AI n'est pas configurée.
<!-- /ai-tools -->

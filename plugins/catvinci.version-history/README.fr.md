# Historique des versions

Chaque enregistrement d’un document, conservé.

- Chaque fois que vous enregistrez, le texte du document est conservé comme une version.
- L’onglet **Historique** de la barre latérale liste les versions du document au premier plan, la plus récente d’abord.
- Choisissez-en une pour voir ce qui a changé depuis ; **Restaurer cette version** la rétablit, ou **Ouvrir comme nouveau document** l’ouvre à côté.
- Les enregistrements rapprochés (l’enregistrement automatique toutes les quelques secondes) forment une seule version, une nouvelle au plus toutes les 15 minutes ; les 50 dernières sont gardées.
- Les versions sont regroupées par jour : Aujourd’hui, Hier, puis la date.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_versions`: Liste les versions enregistrées d'un document - celui au premier plan si aucun chemin n'est donné -, la plus récente d'abord, numérotées à partir de 1, chacune avec sa date d'enregistrement et sa taille.
- `diff_versions`: Montre, ligne par ligne, ce qui a changé entre deux versions d'un document, ou entre une version et le document tel qu'il est : + ajouté, - retiré, avec un peu de contexte.
<!-- /ai-tools -->

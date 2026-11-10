# Historique des versions

Garde chaque enregistrement d’un document comme une version, pour voir ce qui a changé et revenir à une ancienne.

- À chaque enregistrement, le texte du document est gardé comme version. Des enregistrements rapprochés (l’enregistrement automatique toutes les quelques secondes) comptent pour un, avec au plus une nouvelle version toutes les 15 minutes. Les 50 dernières versions de chaque document sont gardées.
- L’onglet **Historique** de la barre latérale liste les versions du document ouvert, la plus récente en haut, groupées par jour : Aujourd’hui, Hier, puis la date.
- Choisissez-en une pour voir, ligne par ligne, ce qui a changé depuis.
- **Restaurer cette version** propose l’ancien texte comme une modification du document, que vous acceptez ou refusez comme les autres. **Ouvrir comme nouveau document** l’ouvre à côté.
- Les versions sont gardées dans Textus, pas dans votre dossier. Les documents de plus de 2 Mo ne sont pas gardés, et quand le stockage est plein, les plus anciennes versions partent d’abord.

## Autorisations

- Lire les fichiers et le document : pour garder chaque version et la comparer au texte actuel.
- Proposer des modifications : pour ramener une ancienne version comme une modification à accepter ou refuser.
- Outils pour Textus AI : pour que Textus AI puisse lister les versions d’un document et les comparer.

## Changements

- **0.3.4** - Dans la barre latérale, le panneau n’affiche plus son propre titre, comme les autres onglets. Textes d'aide et d'état vide plus courts. Son panneau latéral et sa page suivent la mise en page de Textus 1.3.13.
- **0.3.3** - Ses barres, listes et contrôles sont désormais ceux de Textus, grandissent avec l’interface et suivent chaque thème ; nécessite Textus 1.3.12.
- **0.3.2** - Sa page dit maintenant en une phrase ce qu'il fait, ce qu'il permet et ce qui a changé à chaque version.
- **0.3.1** - Seul le code de chemins partagé avec d’autres plugins a changé ; rien ne change à l’usage.
- **0.3.0** - Textus AI peut lister les versions d’un document et les comparer (`list_versions`, `diff_versions`).
- **0.2.0** - Contrôles propres à Textus. Nécessite Textus 1.3.2.
- **0.1.0-0.1.3** - Premières versions : une version à chaque enregistrement, ce qui a changé depuis, restauration comme modification à accepter ou refuser, ouverture comme nouveau document, enregistrements rapprochés réunis, versions groupées par jour, les plus anciennes retirées quand le stockage est plein.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_versions`: Liste les versions enregistrées d'un document - celui au premier plan si aucun chemin n'est donné -, la plus récente d'abord, numérotées à partir de 1, chacune avec sa date d'enregistrement et sa taille.
- `diff_versions`: Montre, ligne par ligne, ce qui a changé entre deux versions d'un document, ou entre une version et le document tel qu'il est : + ajouté, - retiré, avec un peu de contexte.
<!-- /ai-tools -->

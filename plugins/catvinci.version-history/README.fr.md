# Historique des versions

Garde chaque enregistrement d’un document comme une version, pour voir ce qui a changé et revenir à une ancienne.

- À chaque enregistrement, le texte du document est gardé comme version. Des enregistrements rapprochés (l’enregistrement automatique toutes les quelques secondes) comptent pour un, avec au plus une nouvelle version toutes les 15 minutes. Tout le dernier jour est gardé, puis une par heure pendant une semaine, une par jour pendant trois mois, et une par semaine avant.
- L’onglet **Historique** de la barre latérale liste les versions du document ouvert, la plus récente en haut, groupées par jour : Aujourd’hui, Hier, puis la date.
- Choisissez-en une pour voir, ligne par ligne, ce qui a changé depuis.
- Comparez-la au document actuel ou à n’importe quelle autre version, les mots modifiés étant marqués. **Rétablir** à côté d’une modification ne reprend que celle-ci ; **Plus** nomme ou épingle une version, alors gardée pour de bon, ou l’ouvre comme nouveau document. Les modifications faites hors de Textus (une autre app, une synchronisation, git) sont gardées aussi : le texte d’avant et celui d’après.
- **Restaurer** propose l’ancien texte comme une modification du document, que vous acceptez ou refusez comme les autres. **Ouvrir comme nouveau document** l’ouvre à côté.
- Les versions sont gardées dans Textus, pas dans votre dossier. Les documents de plus de 2 Mo ne sont pas gardés, et quand le stockage est plein, les plus anciennes versions partent d’abord.

## Autorisations

- Lire les fichiers et le document : pour garder chaque version et la comparer au texte actuel.
- Proposer des modifications : pour ramener une ancienne version comme une modification à accepter ou refuser.
- Outils pour Textus AI : pour que Textus AI puisse lister les versions d’un document et les comparer.

## Changements

- **0.4.1** - Restaurer tient en un mot, pour que son bouton tienne dans une barre latérale étroite dans toutes les langues.
- **0.4.0** - Les versions s’espacent avec l’âge au lieu de ne garder que les 50 dernières ; chaque texte est stocké une fois ; les versions d’un document supprimé partent un mois plus tard. Comparez deux versions mot à mot, reprenez une seule modification, nommez et épinglez des versions ; les modifications faites hors de Textus sont gardées. Les versions de 0.3 sont reprises d’elles-mêmes. Nécessite Textus 1.4.3. Dans un dossier Git sur le bureau, les commits du document s’affichent sous ses versions.
- **0.3.8** - Le texte d'avant le premier enregistrement n'est plus perdu quand cet enregistrement arrive dès l'ouverture du document.
- **0.3.7** - Le texte d'un document avant son premier enregistrement est lui aussi gardé comme version, et les versions suivent le document quand il est renommé ou déplacé.
- **0.3.6** - L'enregistrement automatique pendant la saisie n'écrit que la version la plus récente, et non toutes les versions du document : les longs documents s'enregistrent avec bien moins de travail.
- **0.3.5** - Une version ouverte reste ouverte quand l’enregistrement automatique la met à jour, et Restaurer la retrouve toujours. Quand le stockage est plein, les anciennes versions des autres documents font de la place, et le panneau prévient si un enregistrement n’a pas pu être gardé. Les lignes s’utilisent au clavier ; les boutons passent à la ligne dans une barre latérale étroite.
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

# Notes rapides

Notez une idée sans quitter le document ; la note va dans le fichier boîte de réception de votre dossier ou dans la note du jour.

- **Ctrl+Alt+N** (**⌘⌥N** sur Mac), ou **Plugins › Nouvelle note rapide…**, demande une note et l’enregistre.
- **Nouvelle note rapide…** est aussi dans l’icône de la zone de notification ou de la barre des menus. Le plugin demande à Textus de continuer à tourner en arrière-plan : elle y reste même toutes fenêtres fermées.
- L’onglet **Notes rapides** de la barre latérale liste les notes, la plus récente en haut. Cliquez sur **Nouvelle** pour en écrire une là, ou modifiez une note directement dans la liste.
- Le menu d’actions de chaque note (son bouton « plus », ou clic droit) propose **Insérer** (au curseur dans le document), **Ouvrir** et **Supprimer**. Une note gardée dans un document s’y ouvre, à sa ligne.
- Supprimée par erreur ? **Annuler**, en bas, la ramène pendant quelques secondes. Une nouvelle note laissée vide disparaît d’elle-même.
- À partir de six notes, un champ de recherche apparaît en haut.

## Où les notes sont gardées

Les notes sont gardées dans un document du dossier ouvert, donc Obsidian et Cloud Sync les voient. Choisissez où dans **Enregistrer les notes dans**, dans les réglages du plugin :

- **Fichier boîte de réception** (par défaut) : `Inbox.md` à la racine du dossier, ou un autre document indiqué sous **Fichier boîte de réception**. Chaque note est ajoutée à la fin, comme élément de liste avec sa date et son heure, par exemple `- 2026-11-08 14:05 Appeler Anna`.
- **Note du jour** : sous un titre `## Notes rapides` (dans la langue de l’interface), ajouté s’il manque. Chaque note a son heure, par exemple `- 14:05 Appeler Anna`. Le dossier, le nom et le modèle de la note du jour suivent les réglages de notes quotidiennes du dossier, comme ceux d’Obsidian ; sans eux, c’est `Daily/YYYY-MM-DD.md`.

Modifiez le fichier et la barre latérale suit. Les notes des anciennes versions y sont déplacées une fois, de la plus ancienne à la plus récente. Sans dossier ouvert, les notes restent dans Textus.

Fonctionne sur ordinateur.

## Autorisations

- Lire et écrire des fichiers : pour le fichier boîte de réception ou la note du jour.
- Modifier le document : pour insérer une note au curseur.
- Outils pour Textus AI : pour que Textus AI puisse ajouter une note rapide.

## Changements

- **0.5.2** - Dans la barre latérale, le panneau n’affiche plus son propre titre, comme les autres onglets. Textes d'aide et d'état vide plus courts. Son panneau latéral et sa page suivent la mise en page de Textus 1.3.13.
- **0.5.1** - Ses barres, listes et contrôles sont désormais ceux de Textus, grandissent avec l’interface et suivent chaque thème ; nécessite Textus 1.3.12.
- **0.5.0** - Les dates et le modèle de la note du jour sont remplis par Textus lui-même, comme dans Calendrier et notes du jour et dans Modèles. Nécessite Textus 1.3.10.
- **0.4.0** - Les notes sont gardées dans un document du dossier : `Inbox.md` ou la note du jour. Celles des anciennes versions y sont déplacées une fois.
- **0.3.1** - Textus AI distingue les notes rapides du journal et des tâches.
- **0.3.0** - Textus AI peut ajouter une note rapide (`add_note`).
- **0.2.0** - Contrôles propres à Textus, et un menu d’actions pour chaque note.
- **0.1.0-0.1.4** - Premières versions : le raccourci et la zone de notification, la liste latérale, insérer, ouvrir, supprimer avec Annuler, recherche quand elles sont nombreuses, dates sur une ligne à part ; ordinateur seulement.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `add_note`: Ajoute une note rapide en haut de la liste des Notes rapides de la barre latérale, à insérer plus tard dans un document ou à ouvrir comme document. Le journal du jour, c’est append_to_daily_note ; une tâche, add_task.
<!-- /ai-tools -->

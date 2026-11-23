# Notes rapides

Notez une idée sans quitter le document ; la note va dans le fichier boîte de réception de votre dossier ou dans la note du jour.

- **Ctrl+Alt+N** (**⌘⌥N** sur Mac), ou **Plugins › Nouvelle note rapide…**, demande une note et l’enregistre.
- Sur ordinateur, **Nouvelle note rapide…** est aussi dans l’icône de la zone de notification ou de la barre des menus. Le plugin demande à Textus de continuer à tourner en arrière-plan : elle y reste même toutes fenêtres fermées.
- L’onglet **Notes rapides** de la barre latérale liste les notes, la plus récente en haut. Cliquez sur **Nouvelle** pour en écrire une là, ou modifiez une note directement dans la liste.
- Le menu d’actions de chaque note (son bouton « plus », ou clic droit) propose **Insérer** (au curseur dans le document), **Ouvrir** et **Supprimer**. Une note gardée dans un document s’y ouvre, à sa ligne.
- Supprimée par erreur ? **Annuler**, en bas, la ramène pendant quelques secondes. Une nouvelle note laissée vide disparaît d’elle-même.
- À partir de six notes, un champ de recherche apparaît en haut.

## Où les notes sont gardées

Les notes sont gardées dans un document du dossier ouvert, donc Obsidian et Cloud Sync les voient. Choisissez où dans **Enregistrer les notes dans**, dans les réglages du plugin :

- **Fichier boîte de réception** (par défaut) : `Inbox.md` à la racine du dossier, ou un autre document indiqué sous **Fichier boîte de réception**. Chaque note est ajoutée à la fin, comme élément de liste avec sa date et son heure, par exemple `- 2026-11-08 14:05 Appeler Anna`.
- **Note du jour** : sous un titre `## Notes rapides` (dans la langue de l’interface), ajouté s’il manque. Chaque note a son heure, par exemple `- 14:05 Appeler Anna`. Le dossier, le nom et le modèle de la note du jour suivent les réglages de notes quotidiennes du dossier, comme ceux d’Obsidian ; sans eux, c’est `Daily/YYYY-MM-DD.md`.

Modifiez le fichier et la barre latérale suit. Les notes des anciennes versions y sont déplacées une fois, de la plus ancienne à la plus récente. Sans dossier ouvert, les notes restent dans Textus.

Fonctionne sur ordinateur, iPhone, iPad et Android. Sur un téléphone, **Nouvelle note rapide…** est dans **Plugins**, au menu de la ligne de titre, et les actions d’une note sont sous son bouton « plus ». Il n’y a pas de zone de notification, donc il ne demande pas à Textus de tourner en arrière-plan.

## Autorisations

- Lire et écrire des fichiers : pour le fichier boîte de réception ou la note du jour.
- Modifier le document : pour insérer une note au curseur.
- Outils pour Textus AI : pour que Textus AI puisse ajouter une note rapide.

## Changements

- **0.6.0** - On iPhone, iPad and Android too: **New Quick Note…** under Plugins and the sidebar tab, with New and each note's more button easy to tap. Only the desktop asks to keep Textus running in the background. Needs Textus 1.4.7.
- **0.5.5** - Its buttons' names and tooltips come from Textus, as on its other pages.
- **0.5.4** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.5.3** - New while searching clears the search, so the new note shows; right-clicking a note's text also offers undo, cut, copy and paste; a search with no match says so.
- **0.5.2** - In the sidebar the panel draws no title of its own, as the sidebar's other tabs. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout. An empty list says what Quick Notes is for and offers New; a note's box grows with its text.
- **0.5.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.5.0** - Dates and the daily note's template are filled by Textus itself, the same way as in Calendar & Daily Notes and Templates. Needs Textus 1.3.10.
- **0.4.0** - Notes are kept in a document of the folder: `Inbox.md` or today's daily note. Notes from older versions move in once.
- **0.3.1** - Textus AI tells quick notes apart from the daily journal and to-dos.
- **0.3.0** - Textus AI can add a quick note (`add_note`).
- **0.2.0** - Textus's own controls, and an actions menu for each note.
- **0.1.0-0.1.4** - First versions: the shortcut and the tray, the sidebar list, insert, open, delete with Undo, search once there are many, dates on a line of their own; desktop only.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `add_note`: Ajoute une note rapide en haut de la liste des Notes rapides de la barre latérale, à insérer plus tard dans un document ou à ouvrir comme document. Le journal du jour, c’est append_to_daily_note ; une tâche, add_task.
<!-- /ai-tools -->

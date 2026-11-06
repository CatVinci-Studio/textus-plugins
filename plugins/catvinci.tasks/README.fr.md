# Tâches

Toutes les tâches de votre dossier, dans une seule liste.

- Écrivez une tâche n’importe où sous la forme `- [ ] quelque chose à faire`.
- L’onglet **Tâches** de la barre latérale liste les tâches de tous les documents du dossier ouvert.
- Cochez-en une là, ou cliquez dessus pour aller à sa place dans son document.
- L’affichage des tâches terminées se règle dans les réglages de l’extension.
- Donnez une date à une tâche (`📅 2026-11-01` ou `due:2026-11-01`) et elle s’affiche sous forme de pastille ; les tâches en retard ou dues dans la semaine sont listées en premier, sous **Bientôt dues**.
- Le champ en haut filtre la liste par mots, par nom du document ou par titre.
- Les cartes d’un tableau Kanban (`nom.kanban.md`) restent au tableau et ne sont pas listées.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_tasks`: Liste les tâches Markdown (- [ ] ...) des documents du dossier ouvert - seulement celles à faire, sauf demande contraire -, chacune avec son texte, son échéance, le chemin du document et la ligne. Filtre par état, document, tag, échéance et mots. Sans les cartes Kanban (read_board) ni les rappels à heure fixe (list_reminders).
- `add_task`: Ajoute une tâche (- [ ] ...) à un document du dossier ouvert : à la fin, ou à la fin de la section sous un titre, avec une échéance si elle est donnée. Crée le document s'il n'existe pas. Renvoie où elle se trouve. Pour ce qui doit notifier à une heure, utilisez add_reminder ; une carte de tableau, c’est add_card, une ligne de base add_row, une ligne du journal du jour append_to_daily_note.
- `complete_task`: Coche une tâche (- [x]) - ou, avec done à false, la rouvre - d'après le chemin de son document et sa ligne, tels que list_tasks les donne.
<!-- /ai-tools -->

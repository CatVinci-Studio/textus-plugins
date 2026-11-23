# Tâches

Rassemble toutes les tâches de votre dossier dans une liste, pour les cocher sur place et les interroger comme avec Obsidian Tasks.

- Écrivez une tâche n’importe où sous la forme `- [ ] chose à faire`.
- L’onglet **Tâches** de la barre latérale liste les tâches de tous les documents du dossier ouvert, par document et sous le titre où chacune se trouve.
- Cochez-en une sur place, ou cliquez dessus pour y aller dans son document.
- Donnez une date à une tâche (`📅 2026-11-01`, `due:2026-11-01` ou `[due:: 2026-11-01]`) et elle s’affiche en badge. Les tâches en retard ou dues dans la semaine passent en tête, sous **Bientôt dues**.
- Le champ du haut filtre la liste par mots, par nom de document ou par titre.
- Les tâches terminées sont masquées, sauf si vous activez **Afficher les tâches terminées** dans **Réglages › Extensions › Modules › Tâches**.
- Les cartes d’un tableau Kanban (un document avec `kanban-plugin` dans ses propriétés, ou `nom.kanban.md`) appartiennent au tableau et ne figurent ni dans la liste latérale ni dans les requêtes de tâches.

## Tâches écrites dans Obsidian

Les tâches écrites avec le plugin Tasks d’Obsidian fonctionnent de la même façon ici :

- `[/]` est en cours, donc encore ouverte ; `[-]` est annulée, donc terminée.
- Les champs en fin de tâche (📅 échéance, ⏳ prévue, 🛫 début, ➕ création, ✅ faite, ❌ annulée, une priorité 🔺 ⏫ 🔼 🔽 ⏬ et 🔁 une répétition) restent dans le fichier et n’apparaissent pas dans la liste.
- Cocher une tâche écrit ✅ et le jour ; la décocher retire la date de fin ou d’annulation.
- Cocher une tâche qui se répète ajoute la suivante sur la ligne au-dessus, ses dates avancées. Les répétitions comme `🔁 every day`, `every 2 weeks`, `every weekday`, `every weekend`, `every Monday`, `every month on the 15th`, `every month on the last`, `every year` et `… when done` sont comprises.

## Requêtes de tâches

Un bloc de code `tasks` liste les tâches demandées, une règle par ligne, comme dans Obsidian :

````markdown
```tasks
not done
due before next week
path includes Projects
sort by due
```
````

- **Statut** : `done`, `not done` et `status.type is` (`todo`, `in_progress`, `done` ou `cancelled`).
- **Dates** : `due`, `scheduled`, `starts`, `done`, `created`, `cancelled` ou `happens` avec `before`, `after`, `on`, `in`, `on or before` ou `on or after` et une date : 2026-11-01, today, tomorrow, yesterday, ou this, next ou last avec week, month ou year. Aussi `no due date` et `has due date` (et de même pour les autres dates).
- **Texte** : `path`, `folder`, `filename`, `description` ou `heading` avec `includes` ou `does not include` ; `tag includes`, `tag does not include`, `has tags` et `no tags`.
- **Autres** : `priority is` (aussi `above`, `below`, `not`), `is recurring` et `is not recurring`.
- **Ordre** : `sort by` et `group by` (status, due, scheduled, start, done, created, priority, path, folder, filename, heading ou description, avec `reverse` au besoin) et `limit`. Sans `sort by`, les tâches suivent l’ordre d’Obsidian Tasks : statut, échéance, priorité, chemin.

Les lignes sur l’apparence (`hide …`, `show …`) sont ignorées ; toute autre ligne non comprise est citée sous le total. Un [[lien]] dans une tâche ouvre sa note. Cochez une tâche dans le bloc pour la cocher dans son fichier ; cliquez dessus pour y aller.

## Permissions

Le plugin lit les documents du dossier pour trouver leurs tâches, et n’écrit dans un document que pour cocher ou ajouter une tâche. Il donne aussi à Textus AI les outils ci-dessous.

## Changements

- **0.5.0** - A task query no longer lists a Kanban board's cards, as the sidebar and Textus AI already didn't. Grouped by document, its rows don't repeat the document's name, and a [[link]] in a task opens its note. Its page receives Textus's messages by the API's current name.
- **0.4.7** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.4.6** - The tasks block keeps a gap inside its frame, as other blocks do.
- **0.4.5** - The AI's new task under a heading never lands inside a code block, and **Move finished tasks to the end of their list** works in Windows (CRLF) notes.
- **0.4.4** - A task query in a document draws at the interface's text size, so a wider column shows more of it rather than larger text (Textus 1.4.1).
- **0.4.3** - Ticking a task with an HTML comment in it now works, and a refused tick tells you why. `group by status` sorts in the right order, task blocks fit narrow panes, due dates look like the sidebar's, and typing stays lighter.
- **0.4.2** - Shorter help and empty-state text.
- **0.4.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12. A new setting, **Move finished tasks to the end of their list**: a task ticked in a document or in the list goes after the open ones (it asks once to read and edit the document in front).
- **0.4.0** - Uses the dates built into Textus 1.3.10, which it now needs.
- **0.3.1** - Ships the updated shared date code; nothing else changed.
- **0.3.0** - Obsidian Tasks: `[/]` and `[-]`, the task fields, done dates, repeating tasks and `tasks` query blocks; boards marked with `kanban-plugin` are left out of the list.
- **0.2.1** - Cards on a Kanban board (`name.kanban.md`) are no longer listed.
- **0.2.0** - Textus AI can list, add and tick off tasks.
- **0.1.3** - The list follows the interface language when it changes.
- **0.1.2** - Due dates in local time; counts in each language's plural forms.
- **0.1.0-0.1.1** - First versions: every task in the folder in a sidebar list, ticked off or opened from there, with a filter, due dates and Due soon.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_tasks`: Liste les tâches Markdown (- [ ] ...) des documents du dossier ouvert - seulement celles à faire, sauf demande contraire -, chacune avec son texte, son échéance, le chemin du document et la ligne. Filtre par état, document, tag, échéance et mots. Sans les cartes Kanban (read_board) ni les rappels à heure fixe (list_reminders).
- `add_task`: Ajoute une tâche (- [ ] ...) à un document du dossier ouvert : à la fin, ou à la fin de la section sous un titre, avec une échéance si elle est donnée. Crée le document s'il n'existe pas. Renvoie où elle se trouve. Pour ce qui doit notifier à une heure, utilisez add_reminder ; une carte de tableau, c’est add_card, une ligne de base add_row, une ligne du journal du jour append_to_daily_note.
- `complete_task`: Coche une tâche (- [x]) - ou, avec done à false, la rouvre - d'après le chemin de son document et sa ligne, tels que list_tasks les donne. Écrit la date de fin (✅ AAAA-MM-JJ) comme Obsidian Tasks et, pour une tâche récurrente (🔁 every …), ajoute la suivante sur la ligne au-dessus.
<!-- /ai-tools -->

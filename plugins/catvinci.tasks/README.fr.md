# Tâches

Rassemble toutes les tâches de votre dossier dans une liste, pour les cocher sur place et les interroger comme avec Obsidian Tasks.

- Écrivez une tâche n’importe où sous la forme `- [ ] chose à faire`.
- L’onglet **Tâches** de la barre latérale liste les tâches de tous les documents du dossier ouvert, par document et sous le titre où chacune se trouve.
- Cochez-en une sur place, ou cliquez dessus pour y aller dans son document.
- Donnez une date à une tâche (`📅 2026-11-01`, `due:2026-11-01` ou `[due:: 2026-11-01]`) et elle s’affiche en badge. Les tâches en retard ou dues dans la semaine passent en tête, sous **Bientôt dues**.
- Le champ du haut filtre la liste par mots, par nom de document ou par titre.
- Les tâches terminées sont masquées, sauf si vous activez **Afficher les tâches terminées** dans **Réglages › Extensions › Modules › Tâches**.
- Les cartes d’un tableau Kanban (un document avec `kanban-plugin` dans ses propriétés, ou `nom.kanban.md`) appartiennent au tableau et ne figurent pas dans la liste latérale.

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

Les lignes sur l’apparence (`hide …`, `show …`) sont ignorées ; toute autre ligne non comprise est citée sous le total. Le bloc liste aussi les cartes des tableaux. Cochez une tâche dans le bloc pour la cocher dans son fichier ; cliquez dessus pour y aller.

## Permissions

Le plugin lit les documents du dossier pour trouver leurs tâches, et n’écrit dans un document que pour cocher ou ajouter une tâche. Il donne aussi à Textus AI les outils ci-dessous. Il fonctionne sur ordinateur, iPhone et iPad.

## Changements

- **0.4.3** - Les tâches contenant un commentaire HTML se cochent désormais, et une coche refusée en donne la raison. `group by status` trie dans le bon ordre, les blocs de tâches tiennent dans les panneaux étroits, les échéances ressemblent à celles de la barre latérale et la frappe reste plus légère.
- **0.4.2** - Textes d'aide et d'état vide plus courts.
- **0.4.1** - Ses barres, listes et contrôles sont désormais ceux de Textus, grandissent avec l’interface et suivent chaque thème ; nécessite Textus 1.3.12. Nouveau réglage **Placer les tâches terminées en fin de liste** : une tâche cochée passe après les tâches ouvertes (demande une fois de lire et modifier le document).
- **0.4.0** - Utilise les dates intégrées à Textus 1.3.10, désormais nécessaire.
- **0.3.1** - Contient le code de dates partagé mis à jour ; rien d’autre ne change.
- **0.3.0** - Obsidian Tasks : `[/]` et `[-]`, les champs de tâche, les dates de fin, les tâches répétées et les blocs de requête `tasks` ; les tableaux marqués `kanban-plugin` sont exclus de la liste.
- **0.2.1** - Les cartes d’un tableau Kanban (`nom.kanban.md`) ne sont plus listées.
- **0.2.0** - Textus AI peut lister, ajouter et cocher des tâches.
- **0.1.3** - La liste suit la langue de l’interface quand elle change.
- **0.1.2** - Échéances en heure locale ; totaux avec les formes du pluriel de chaque langue.
- **0.1.0-0.1.1** - Premières versions : toutes les tâches du dossier dans une liste latérale, à cocher ou à ouvrir, avec filtre, échéances et Bientôt dues.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_tasks`: Liste les tâches Markdown (- [ ] ...) des documents du dossier ouvert - seulement celles à faire, sauf demande contraire -, chacune avec son texte, son échéance, le chemin du document et la ligne. Filtre par état, document, tag, échéance et mots. Sans les cartes Kanban (read_board) ni les rappels à heure fixe (list_reminders).
- `add_task`: Ajoute une tâche (- [ ] ...) à un document du dossier ouvert : à la fin, ou à la fin de la section sous un titre, avec une échéance si elle est donnée. Crée le document s'il n'existe pas. Renvoie où elle se trouve. Pour ce qui doit notifier à une heure, utilisez add_reminder ; une carte de tableau, c’est add_card, une ligne de base add_row, une ligne du journal du jour append_to_daily_note.
- `complete_task`: Coche une tâche (- [x]) - ou, avec done à false, la rouvre - d'après le chemin de son document et sa ligne, tels que list_tasks les donne. Écrit la date de fin (✅ AAAA-MM-JJ) comme Obsidian Tasks et, pour une tâche récurrente (🔁 every …), ajoute la suivante sur la ligne au-dessus.
<!-- /ai-tools -->

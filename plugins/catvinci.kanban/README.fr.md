# Tableau de tâches

Organisez le travail en cartes et en listes sur un tableau enregistré comme un simple fichier Markdown.

- **Plugins › Nouveau tableau de tâches…** demande un nom et crée _nom_.md dans le dossier ouvert, avec `kanban-plugin: board` dans son front matter et trois listes : À faire, En cours et Terminé. Si un tableau de ce nom existe déjà, c’est lui qui s’ouvre.
- Tout fichier .md dont le front matter contient `kanban-plugin` s’ouvre comme tableau. C’est ainsi que le plugin Kanban d’Obsidian enregistre ses tableaux : chaque app ouvre ceux de l’autre. Les anciens tableaux nommés _nom_.kanban.md s’ouvrent toujours comme tableaux.
- Chaque liste est un titre du fichier et chaque carte une tâche en dessous : le tableau reste lisible partout.

## Sur le tableau

- **Ajouter une carte** en bas d’une liste. Cliquez sur le texte d’une carte pour le modifier, cochez sa case quand elle est faite, et utilisez son bouton × pour la supprimer.
- **Ajouter une liste** crée une nouvelle liste. Cliquez sur le titre d’une liste pour la renommer ; une liste vide peut être supprimée.
- Faites glisser les cartes dans une liste ou vers une autre, et une liste par son en-tête pour changer l’ordre. Les autres s’écartent pendant le glissement.
- Écrivez un [[lien]] dans une carte et cliquez dessus pour ouvrir cette note.
- **Modifier en Markdown** ouvre le fichier en texte. Le tableau suit les changements faits là ou ailleurs.
- Ce que le Kanban d’Obsidian garde dans le fichier en plus des listes, comme ses réglages et la marque de sa liste terminée, reste tel quel.

```markdown
---
kanban-plugin: board
---

## À faire

- [ ] Écrire le plan

## Terminé

- [x] Choisir un titre
```

## Autorisations

- Lire et écrire des fichiers : pour ouvrir les tableaux et les enregistrer.
- Outils pour Textus AI : pour que Textus AI puisse trouver et lire les tableaux, ajouter des cartes et les déplacer.

## Changements

- **0.4.3** - Sa page dit maintenant en une phrase ce qu'il fait, ce qu'il permet et ce qui a changé à chaque version.
- **0.4.2** - Cartes et listes suivent le pointeur quand on les fait glisser, les autres s’écartant. Nécessite Textus 1.3.10.
- **0.4.1** - Garde la marque que le Kanban d’Obsidian met sur une liste terminée.
- **0.4.0** - Renommé Tableau de tâches (avant : Kanban). Les nouveaux tableaux sont de simples fichiers .md avec `kanban-plugin` dans leur front matter, comme les écrit Obsidian ; les tableaux .kanban.md s’ouvrent toujours.
- **0.3.1** - Textus AI distingue les tableaux des tâches écrites dans les documents.
- **0.3.0** - Textus AI peut lister et lire les tableaux, ajouter des cartes et les déplacer.
- **0.2.0** - Contrôles et menus propres à Textus.
- **0.1.0-0.1.3** - Premières versions : tableaux en Markdown, cartes glissées d’une liste à l’autre, listes déplacées par leur en-tête, [[liens]] qui ouvrent les notes, Modifier en Markdown, changements faits ailleurs affichés aussitôt, réglages d’Obsidian conservés.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_boards`: Liste les tableaux Kanban (fichiers kanban-plugin .md) du dossier ouvert, chacun avec ses listes et le nombre de cartes de chacune.
- `read_board`: Lit un tableau Kanban : ses listes dans l'ordre, chacune avec le texte de ses cartes et si elles sont faites. Les tâches écrites dans des documents ordinaires, c’est list_tasks.
- `add_card`: Ajoute une carte à la fin d'une liste d'un tableau Kanban. Seulement pour un tableau (kanban-plugin .md) ; une tâche dans un document, c’est add_task.
- `move_card`: Déplace une carte d'un tableau Kanban vers une autre liste, ou à une autre place dans la sienne.
<!-- /ai-tools -->

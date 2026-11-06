# Kanban

Des tableaux de cartes en listes, enregistrés dans un simple fichier Markdown.

- **Extensions › Nouveau tableau kanban…** en crée un, nommé _nom_.kanban.md.
- Chaque liste est un titre du fichier et chaque carte une tâche en dessous, si bien que le tableau reste lisible partout.
- Ajoutez une carte en bas d’une liste ; faites glisser les cartes d’une liste à l’autre, et les listes pour les réordonner. Une carte cochée est terminée.
- Écrivez un [[lien]] dans une carte et cliquez dessus pour ouvrir cette note.
- **Modifier en Markdown** ouvre le fichier en texte ; le tableau suit vos modifications.

```markdown
## À faire

- [ ] Écrire le plan

## Terminé

- [x] Choisir un titre
```

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_boards`: Liste les tableaux Kanban (fichiers name.kanban.md) du dossier ouvert, chacun avec ses listes et le nombre de cartes de chacune.
- `read_board`: Lit un tableau Kanban : ses listes dans l'ordre, chacune avec le texte de ses cartes et si elles sont faites. Les tâches écrites dans des documents ordinaires, c’est list_tasks.
- `add_card`: Ajoute une carte à la fin d'une liste d'un tableau Kanban. Seulement pour un tableau (name.kanban.md) ; une tâche dans un document, c’est add_task.
- `move_card`: Déplace une carte d'un tableau Kanban vers une autre liste, ou à une autre place dans la sienne.
<!-- /ai-tools -->

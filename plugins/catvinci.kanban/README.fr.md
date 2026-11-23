# Tableau de tâches

Organisez le travail en cartes et en listes sur un tableau enregistré comme un simple fichier Markdown.

- **Plugins › Nouveau tableau de tâches…** demande un nom et crée _nom_.md dans le dossier ouvert, avec `kanban-plugin: board` dans son front matter et trois listes : À faire, En cours et Terminé. Si un tableau de ce nom existe déjà, c’est lui qui s’ouvre.
- Tout fichier .md dont le front matter contient `kanban-plugin` s’ouvre comme tableau. C’est ainsi que le plugin Kanban d’Obsidian enregistre ses tableaux : chaque app ouvre ceux de l’autre. Les anciens tableaux nommés _nom_.kanban.md s’ouvrent toujours comme tableaux.
- Chaque liste est un titre du fichier et chaque carte une tâche en dessous : le tableau reste lisible partout.

## Sur le tableau

- **Ajouter une carte** en bas d’une liste. Cliquez sur le texte d’une carte pour le modifier et cochez sa case quand elle est faite. Son bouton ⋯ (ou un clic droit) la déplace vers une autre liste ou la supprime ; Annuler dans la notification qui suit la rétablit.
- **Ajouter une liste** crée une nouvelle liste, prête à être nommée. Cliquez sur le titre d’une liste pour la renommer ; une liste vide peut être supprimée depuis son menu ⋯.
- Sur un téléphone, chaque liste occupe l’écran : balayez pour passer à la suivante.
- Faites glisser les cartes dans une liste ou vers une autre, et une liste par son en-tête pour changer l’ordre. Les autres s’écartent pendant le glissement. Sur un écran tactile, maintenez une carte un instant, puis faites-la glisser ; au bord de l’écran d’un téléphone, le tableau passe à la liste suivante. Maintenue puis relâchée sans bouger, une carte ouvre son menu.
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

- **0.4.14** - On a phone or tablet, hold a card a moment to drag it within a list or to another; at the screen's edge on a phone the board turns to the next list, and the page no longer scrolls under the card. Held and let go without moving, a card opens its menu. Dragged near the board's edge, the board scrolls, and a card let go below a short list goes into that list.
- **0.4.13** - A card's ⋯ menu (or a right-click) moves it to another list or deletes it, with Undo, instead of an × that deleted at once - always showing on a touch screen. A new list starts with its name being written. On a phone a list fills the screen and a swipe settles on the next; in a narrow tab, Edit as Markdown goes into the ⋯ menu.
- **0.4.12** - Cards and lists make way at the pace of the rest of Textus.
- **0.4.11** - A list dragged by its head lifts and slides along the board as Textus's own tabs do; Esc puts it back.
- **0.4.10** - A card's checkbox sits on the middle of its first line at any text size.
- **0.4.9** - Right-clicking a card or list name while you edit it (to paste) no longer ends the edit, and an input method's Enter on iPhone and iPad picks its words instead of saving. The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.4.8** - A board with Windows (CRLF) line endings keeps them, and a board changed while you edit (saved as Markdown in Textus, or by a plugin) shows that change instead of writing over it, and says so. The store description now opens with what the plugin does.
- **0.4.7** - A blank line inside a card no longer splits it, and Escape no longer leaves an empty card. The AI leaves ordinary notes alone, and the board fits narrow panels.
- **0.4.6** - The board fades at its edges where lists run past the window.
- **0.4.5** - A dragged card or list stays right under the pointer and lifts like everything dragged in Textus. Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.4** - Dragging a card or a list no longer selects text on the way.
- **0.4.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.2** - Cards and lists follow the pointer as you drag, the others making way. Needs Textus 1.3.10.
- **0.4.1** - Keeps the mark Obsidian's Kanban puts on a done list.
- **0.4.0** - Renamed Task Board (was Kanban). New boards are plain .md files with `kanban-plugin` in their front matter, as Obsidian writes them; .kanban.md boards still open.
- **0.3.1** - Textus AI tells boards apart from tasks written in documents.
- **0.3.0** - Textus AI can list and read boards, add cards and move them.
- **0.2.0** - Textus's own controls and menus.
- **0.1.0-0.1.3** - First versions: boards as Markdown, cards dragged between lists, lists moved by their head, [[links]] that open notes, Edit as Markdown, changes made elsewhere shown at once, Obsidian's settings kept.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_boards`: Liste les tableaux Kanban (fichiers kanban-plugin .md) du dossier ouvert, chacun avec ses listes et le nombre de cartes de chacune.
- `read_board`: Lit un tableau Kanban : ses listes dans l'ordre, chacune avec le texte de ses cartes et si elles sont faites. Les tâches écrites dans des documents ordinaires, c’est list_tasks.
- `add_card`: Ajoute une carte à la fin d'une liste d'un tableau Kanban. Seulement pour un tableau (kanban-plugin .md) ; une tâche dans un document, c’est add_task.
- `move_card`: Déplace une carte d'un tableau Kanban vers une autre liste, ou à une autre place dans la sienne.
<!-- /ai-tools -->

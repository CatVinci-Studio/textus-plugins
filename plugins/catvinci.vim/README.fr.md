# Vim

Utilisez les modes et les touches de Vim dans l’éditeur de Textus.

- **Extensions › Activer ou désactiver les touches Vim** les allume ou les éteint. Tant qu’elles sont actives, la barre d’état affiche le mode (NORMAL, INSERT, VISUAL, V-LINE) ; son menu coupe Vim.
- Modes normal, insertion, visuel et visuel ligne, avec les mouvements (**h j k l**, **w b e**, **0 ^ $**, **gg G**, **f t F T** avec **;** et **,**, **Ctrl+D** et **Ctrl+U**), les opérateurs (**d c y**, **dd**, **x**, **p P**, **r**, et **iw**/**aw**), les compteurs, un registre, **u** et **Ctrl+R** pour annuler et rétablir, et **.** pour répéter.
- Une ligne est un paragraphe, un titre, un élément de liste ou une ligne d’un bloc de code : **j** et **k** les parcourent tous, **}** et **{** bloc par bloc. **zz**, **zt** et **zb** placent la ligne du curseur au milieu, en haut ou en bas de la fenêtre.
- **~** inverse la casse sous le curseur ; en mode visuel, **~**, **U** et **u** inversent, mettent en majuscules ou en minuscules la sélection.
- **s** et une lettre, puis une étiquette, sautent n’importe où à l’écran (flash) ; les endroits les plus proches reçoivent les premières étiquettes. **d**, **c** ou **y** avant **s** supprime, modifie ou copie jusque-là.
- **:** ouvre la palette de commandes avec celles de Vim en tête : **:w** enregistre, **:q** ferme l’onglet, **:wq** fait les deux, **:12** va à la ligne 12, **:u** et **:redo** annulent et rétablissent, et toutes les commandes de Textus s’y trouvent aussi.
- Sur Mac, le mode normal tape avec un clavier latin, pour qu’une méthode de saisie comme le pinyin n’intercepte pas les touches ; la vôtre revient en mode insertion.

Réglages, dans **Réglages › Extensions › Modules › Vim** :

- **Sauter avec s (flash)** : activé par défaut. Désactivé, **s** retrouve son rôle dans Vim (supprimer un caractère et insérer).
- **Quitter le mode insertion avec** : deux lettres tapées vite en mode insertion qui valent Échap, comme `jk`. Vide : seulement Échap et **Ctrl+[**.
- **Correspondances de touches** : des lignes comme dans un vimrc (`map`, `noremap`, `nnoremap`, `inoremap`, `vnoremap` et `let mapleader`), par exemple `inoremap jj <Esc>` ou `nnoremap <leader>w :w<CR>`.

Obsidian : dans un coffre Obsidian, son `.obsidian.vimrc` (celui du plugin Vimrc Support) est lu aussi, après vos propres lignes, et relu quand il change. Ouvrez le coffre lui-même, pas un dossier à l’intérieur.

Le plugin demande à recevoir les touches dans l’éditeur (pour exécuter celles de Vim) et à lire les fichiers (seulement pour lire `.obsidian.vimrc`). Il fonctionne sur ordinateur.

## Changements

- **0.2.10** - Its page no longer says which devices it runs on: the store shows that.
- **0.2.9** - Needs Textus 1.3.0-beta.8 or later, the first with everything it uses.
- **0.2.8** - Desktop only: a phone's on-screen keyboard types its letters into the text instead of running them as Vim keys.
- **0.2.7** - The status bar's mode opens a menu that turns Vim off; `.obsidian.vimrc` is read again when you come back to Textus; leaving visual mode with **:** always works.
- **0.2.6** - Shorter help and empty-state text.
- **0.2.5** - Its code is split into smaller files by what each part does; nothing changes in use.
- **0.2.4** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.3** - Reads an Obsidian vault's `.obsidian.vimrc`; mapping the same keys again replaces the earlier mapping.
- **0.2.2** - **zz**, **zt** and **zb** bring the caret's line to the middle, top or bottom of the window.
- **0.2.1** - Says where it runs: the desktop, iPhone and iPad.
- **0.2.0** - **:** opens the command palette with Vim's commands first; flash shows its labels after one letter; normal mode types Roman on a Mac.
- **0.1.0-0.1.1** - First versions: modes, motions, operators, counts, dot repeat, flash with **ds**, **cs** and **ys**, the command line (**:w**, **:q**, **:wq**, **:12**), vimrc key mappings and the case keys.

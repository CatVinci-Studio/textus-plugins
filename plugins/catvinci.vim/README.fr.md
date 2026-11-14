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

- **0.2.8** - Sur ordinateur seulement : le clavier à l’écran d’un téléphone tape les lettres dans le texte au lieu de les exécuter comme des touches Vim.
- **0.2.7** - Le mode dans la barre d’état ouvre un menu qui coupe Vim ; `.obsidian.vimrc` est relu quand vous revenez dans Textus ; quitter le mode visuel avec **:** marche toujours.
- **0.2.6** - Textes d'aide et d'état vide plus courts.
- **0.2.5** - Son code est réparti en fichiers plus petits selon le rôle de chaque partie ; rien ne change à l'usage.
- **0.2.4** - Sa page dit maintenant en une phrase ce qu'il fait, ce qu'il permet et ce qui a changé à chaque version.
- **0.2.3** - Lit le `.obsidian.vimrc` d’un coffre Obsidian ; associer de nouveau les mêmes touches remplace l’association précédente.
- **0.2.2** - **zz**, **zt** et **zb** placent la ligne du curseur au milieu, en haut ou en bas de la fenêtre.
- **0.2.1** - Indique où il fonctionne : ordinateur, iPhone et iPad.
- **0.2.0** - **:** ouvre la palette de commandes avec celles de Vim en tête ; flash affiche ses étiquettes dès une lettre ; le mode normal tape en latin sur Mac.
- **0.1.0-0.1.1** - Premières versions : modes, mouvements, opérateurs, compteurs, répétition par point, flash avec **ds**, **cs** et **ys**, la ligne de commande (**:w**, **:q**, **:wq**, **:12**), correspondances de touches comme dans un vimrc et touches de casse.

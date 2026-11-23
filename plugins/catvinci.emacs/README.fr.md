# Emacs

Permet de se déplacer, poser la marque, couper (kill) et coller (yank) dans l'éditeur avec les touches d'Emacs.

Les touches marchent dès l'installation. **Extensions › Activer ou désactiver les touches Emacs** les allume et les éteint, tout comme un clic sur **Emacs** dans la barre d'état, qui affiche aussi **Marque** tant que la marque est posée et **C-x-** tant que C-x attend sa deuxième touche. Seules les touches ci-dessous sont prises ; la saisie reste celle de l'éditeur. Dans un document Markdown, une « ligne » est un paragraphe, un titre, un élément de liste ou une ligne d'un bloc de code.

- **Déplacements** : **C-f C-b C-n C-p**, **C-a C-e**, **M-f M-b**, **M-< M->**, **M-{ M-}** par paragraphe, **C-v M-v** par vingt lignes.
- **Marque et région** : **C-SPC** pose la marque, et les déplacements suivants (flèches comprises) étendent la région ; **C-g** l'enlève ; **C-x h** sélectionne tout le document.
- **Kill ring** : **C-k** coupe jusqu'à la fin de la ligne (en fin de ligne, il la joint à la suivante), **C-w** coupe la région, **M-w** la copie, **M-d** et **M-DEL** coupent un mot en avant ou en arrière. Des coupes à la suite se rejoignent en une seule. **C-y** colle la coupe la plus récente, et **M-y** juste après la remplace par de plus anciennes. **C-d** efface un caractère sans toucher au kill ring.
- **Casse** : **M-u**, **M-l** et **M-c** mettent le mot suivant en majuscules, en minuscules ou avec une majuscule initiale.
- **Annuler et enregistrer** : **C-/**, **C-_** ou **C-x u** annulent ; **C-x C-s** enregistre.

Sur Mac, les raccourcis de Textus sont sur ⌘, donc toutes les touches Ctrl sont à Emacs. Sous Windows et Linux, les touches Ctrl sont à Textus et au système (copier, coller, couper, tout sélectionner, gras, rechercher) : seules les touches M-, C-SPC et C-g sont à Emacs tant que vous n'activez pas **Prendre aussi les touches Ctrl de l’app** dans les réglages de l'extension.

Fonctionne sur ordinateur et sur iPhone. Demande une seule permission, les touches de l'éditeur, pour prendre ces touches dans l'éditeur.

## Changements

- **0.1.7** - Its page says that on a tablet it needs a keyboard, instead of which devices it runs on.
- **0.1.6** - C-x C-s and C-x C-g work again on Windows and Linux. The status bar shows Emacs only while it really has the keys.
- **0.1.5** - Shorter help and empty-state text.
- **0.1.4** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.3** - Says where it runs: desktop and iPhone.
- **0.1.2** - C-x no longer sticks; C-d and C-y leave the clipboard and the region alone.
- **0.1.0-0.1.1** - First versions: moves, the mark and region, a kill ring with C-y and M-y, M-u M-l M-c, undo and C-x keys; store page and icon.

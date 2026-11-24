# Complétion LaTeX

Propose des commandes LaTeX pendant que vous tapez une formule.

- Dans une formule (entre `$ … $` ou dans un bloc mathématique), tapez une barre oblique inverse et le début d'une commande, comme `\fr` ou `\alp`. Une barre oblique inverse seule affiche les plus courantes.
- La liste montre les commandes qui correspondent, chacune avec ce qu'elle dessine : plus de 200, de `\frac` à `\begin{pmatrix}`. Celles qui commencent par ce que vous avez tapé viennent d'abord, puis celles qui le contiennent, sans tenir compte de la casse.
- Des lettres dans l'ordre trouvent aussi une commande : `\rarr` donne `\rightarrow`, `\lra` donne `\leftrightarrow`.
- **Entrée** ou **Tab** écrit celle choisie, le curseur entre ses accolades ; **Échap** ferme la liste. `\left(`, `\left[` et `\left\{` arrivent avec leur `\right`.

Elle demande Textus 1.3.0 ou plus récent. Elle demande une seule permission, lire l'éditeur, pour voir ce que vous tapez dans la formule.

## Changements

- **0.1.6** - Its page no longer says which devices it runs on: the store shows that.
- **0.1.5** - The store description now opens with what the plugin does.
- **0.1.4** - A command typed out whole comes first, so Enter keeps it (\in stays \in); a command without braces is written with a space after it; with Textus 1.3.13 the list closes once a command is written.
- **0.1.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.2** - Says where it runs: desktop and iPhone.
- **0.1.0-0.1.1** - First versions: over 200 commands with what each draws, letters in order, braces and caret in place, growing bracket pairs; store page and icon.

# Complétion LaTeX

Propose des commandes LaTeX pendant que vous tapez une formule.

- Dans une formule (entre `$ … $` ou dans un bloc mathématique), tapez une barre oblique inverse et le début d'une commande, comme `\fr` ou `\alp`. Une barre oblique inverse seule affiche les plus courantes.
- La liste montre les commandes qui correspondent, chacune avec ce qu'elle dessine : plus de 200, de `\frac` à `\begin{pmatrix}`. Celles qui commencent par ce que vous avez tapé viennent d'abord, puis celles qui le contiennent, sans tenir compte de la casse.
- Des lettres dans l'ordre trouvent aussi une commande : `\rarr` donne `\rightarrow`, `\lra` donne `\leftrightarrow`.
- **Entrée** ou **Tab** écrit celle choisie, le curseur entre ses accolades ; **Échap** ferme la liste. `\left(`, `\left[` et `\left\{` arrivent avec leur `\right`.

Elle fonctionne sur ordinateur et sur iPhone et demande Textus 1.3.0 ou plus récent. Elle demande une seule permission, lire l'éditeur, pour voir ce que vous tapez dans la formule.

## Changements

- **0.1.5** - La description de la boutique commence désormais par ce que fait le plugin.
- **0.1.4** - Une commande tapée en entier passe en tête, donc Entrée la garde (\in reste \in) ; une commande sans accolades est écrite suivie d’une espace ; avec Textus 1.3.13, la liste se ferme une fois la commande écrite.
- **0.1.3** - Sa page dit maintenant en une phrase ce qu'il fait, ce qu'il permet et ce qui a changé à chaque version.
- **0.1.2** - Indique où elle fonctionne : ordinateur et iPhone.
- **0.1.0-0.1.1** - Premières versions : plus de 200 commandes avec ce que chacune dessine, recherche par lettres dans l'ordre, accolades et curseur en place, paires de délimiteurs extensibles ; page dans la boutique et icône.

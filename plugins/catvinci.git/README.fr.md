# Git

Pour un dossier suivi par Git :

- Les fichiers modifiés depuis le dernier commit sont marqués dans la barre latérale : **M** modifié, **A** ajouté, **U** nouveau et pas encore dans Git, **R** renommé, **!** en conflit.
- Dans un document modifié, chaque paragraphe, titre ou liste dont des lignes n’étaient pas dans le dernier commit (tel qu’enregistré) a une marque dans la marge de droite ; un clic dessus committe (Textus 1.4.4).
- La barre d’état montre la branche, avec ↑ les commits à pousser et ↓ ceux à tirer ; un clic dessus committe.
- **Committer les modifications…** (menu Extensions, ou la branche) liste les fichiers modifiés, celui au premier plan coché ; vous écrivez le message, et votre propre Git committe ces fichiers seulement - ses hooks et sa signature s’exécutent comme d’habitude. Le premier commit dans un dossier demande d’abord.
- **Pousser** et **Tirer** (menu Extensions) envoient la branche vers sa branche distante et récupèrent les commits distants, avec votre propre Git et les identifiants qu’il a enregistrés - connectez-vous une fois avec Git dans un terminal s’il le demande. Une branche qui n’a pas encore de branche distante est poussée vers `origin`. Un pull qui créerait un conflit est annulé, rien n’est changé, et vous êtes prévenu (Textus 1.4.6).
- Avec Historique des versions 0.4, les commits d’un document apparaissent sous ses versions, comparés et restaurés de la même façon.
- Textus AI peut lire les modifications, les commits d’un fichier et un fichier tel qu’un commit l’avait - par exemple pour rédiger votre message de commit.

Rien ne change de branche. Il faut Git installé (sur Mac, les Command Line Tools) et Textus 1.4.6.

## Changements

- **0.3.2** - Its icon is Git's own logo.
- **0.3.1** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it. Its description no longer ends in "Desktop.", and its tools for Textus AI are described in every language.
- **0.3.0** - Push and Pull, and what waits to be pushed or pulled beside the branch (Textus 1.4.6).
- **0.2.0** - Blocks changed since the last commit are marked in the margin (Textus 1.4.4).
- **0.1.1** - The first-commit confirmation's button reads "Commit".
- **0.1.0** - First version.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `git_changes`: La branche du dossier ouvert et les fichiers modifiés, avec pour chaque fichier texte modifié ses lignes par rapport à son dernier commit. À lire avant d’écrire un message de commit.
- `git_history`: Les commits Git d’un fichier, du plus récent au plus ancien, à travers les renommages : hash, date, auteur, sujet.
- `git_file_at`: Le texte d’un fichier tel qu’un de ses commits l’avait (hash donné par git_history).
<!-- /ai-tools -->

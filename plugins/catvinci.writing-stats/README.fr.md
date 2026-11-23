# Statistiques d'écriture

Affiche le nombre de mots, le temps de lecture et un objectif d’écriture quotidien dans la barre latérale.

Ouvrez l’onglet **Statistiques d’écriture** de la barre latérale :

- **Ce document** : mots, caractères et temps de lecture.
- **Sélection** : mots et caractères de ce que vous avez sélectionné.
- **Aujourd’hui** : les mots ajoutés aujourd’hui, dans tous les documents, face à un objectif quotidien, et le nombre de jours d’affilée où vous l’avez atteint. Fixez l’objectif dans les réglages du plugin, sous **Objectif quotidien** : 500 sauf si vous le changez, 0 pour aucun.
- **Tout le dossier** : dépliez-le pour compter les mots, les caractères et les documents de tout le dossier ouvert.

Le chinois, le japonais et le coréen sont comptés par caractère, les autres écritures par mot. Les marques propres au Markdown - `#`, `*`, les adresses des liens, le front matter - ne sont pas comptées. Le temps de lecture suppose 230 mots ou 400 caractères CJK par minute.

Il demande Textus 1.4.3 ou plus récent. Il demande à lire l’éditeur et les fichiers du dossier ouvert, pour les compter, et donne à Textus AI l’outil ci-dessous.

## Changements

- **0.2.8** - Its page is in every language Textus speaks. It names the Textus it needs, 1.4.3.
- **0.2.7** - Code kept for Textus versions it no longer runs on is gone.
- **0.2.6** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.2.5** - Words and characters are counted as the status bar counts them (from Textus 1.4.3), and a Windows file's front matter is left out of the count.
- **0.2.4** - The store description now opens with what the plugin does.
- **0.2.3** - Today now counts only the words you type yourself, not changes from sync or AI, and stays quick in large folders. A negative daily goal is no longer shown as met.
- **0.2.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.1** - Updated shared path code.
- **0.2.0** - Textus AI can count the words of a document or a folder.
- **0.1.1** - Says where it runs: desktop and iPhone.
- **0.1.0** - First version: the document, the selection, today against a goal, the streak and the whole folder.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `count_words`: Compte les mots, les caractères et les minutes de lecture d'un document, de tous les documents d'un dossier ou du document au premier plan ; un caractère chinois, japonais ou coréen compte pour un mot, les marques Markdown ne comptent pas.
<!-- /ai-tools -->

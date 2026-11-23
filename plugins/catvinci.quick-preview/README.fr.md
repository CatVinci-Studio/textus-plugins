# Aperçu rapide

Lisez où mène un lien sans l’ouvrir : laissez le pointeur sur un lien vers un autre document et une carte affiche son texte.

- Laissez le pointeur sur un lien vers un autre document, un lien Markdown ou un [[lien wiki]].
- Une carte à côté affiche le début du document, sans ses propriétés. Pour un lien vers un titre (`#Titre`), elle affiche cette section, et pour un lien vers un bloc (`#^id`), ce bloc.
- La carte affiche jusqu’à environ 1 500 caractères, coupés à la fin d’un paragraphe. **Ouvrir** va au document ; **Épingler** garde la carte ouverte pendant que vous écrivez.
- Seuls les documents du dossier ouvert sont prévisualisés.

Le plugin demande à lire l’éditeur (pour savoir quel lien vous pointez) et à lire les fichiers (pour afficher le document lié). Il ne modifie jamais un fichier. Il fonctionne sur ordinateur, iPhone et iPad.

## Changements

- **0.2.3** - The store description now opens with what the plugin does.
- **0.2.2** - A link to a nested heading (`[[Note#A#B]]`) shows that heading's section, as a click opens it. Needs Textus 1.4.0.
- **0.2.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.0** - A link to a block (`#^id`) shows that block. Needs Textus 1.3.9.
- **0.1.3** - Says where it runs: the desktop, iPhone and iPad.
- **0.1.2** - The card's length is fixed instead of a setting.
- **0.1.0-0.1.1** - First versions: a card for links to documents, with the document's opening or the section the link names, and Open and Pin.

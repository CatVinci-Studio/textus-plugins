# Aperçu rapide

Lisez où mène un lien sans l’ouvrir : laissez le pointeur sur un lien vers un autre document et une carte affiche son texte.

- Laissez le pointeur sur un lien vers un autre document, un lien Markdown ou un [[lien wiki]].
- Une carte à côté affiche le début du document, sans ses propriétés. Pour un lien vers un titre (`#Titre`), elle affiche cette section, et pour un lien vers un bloc (`#^id`), ce bloc.
- La carte affiche jusqu’à environ 1 500 caractères, coupés à la fin d’un paragraphe. **Ouvrir** va au document ; **Épingler** garde la carte ouverte pendant que vous écrivez.
- Seuls les documents du dossier ouvert sont prévisualisés.

Le plugin demande à lire l’éditeur (pour savoir quel lien vous pointez) et à lire les fichiers (pour afficher le document lié). Il ne modifie jamais un fichier. Il fonctionne sur ordinateur, iPhone et iPad.

## Changements

- **0.2.2** - Un lien vers un titre imbriqué (`[[Note#A#B]]`) montre la section de ce titre, celle qu'ouvre un clic. Nécessite Textus 1.4.0.
- **0.2.1** - Sa page dit maintenant en une phrase ce qu'il fait, ce qu'il permet et ce qui a changé à chaque version.
- **0.2.0** - Un lien vers un bloc (`#^id`) affiche ce bloc. Nécessite Textus 1.3.9.
- **0.1.3** - Indique où il fonctionne : ordinateur, iPhone et iPad.
- **0.1.2** - La longueur de la carte est fixe, plus d’un réglage.
- **0.1.0-0.1.1** - Premières versions : une carte pour les liens vers des documents, avec le début du document ou la section nommée par le lien, et Ouvrir et Épingler.

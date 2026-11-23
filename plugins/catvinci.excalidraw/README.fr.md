# Excalidraw

Dessinez des schémas à main levée avec [Excalidraw](https://excalidraw.com) dans un onglet de Textus.

Ouvrez un fichier `.excalidraw` depuis la barre latérale, ou choisissez **Nouveau dessin** dans le menu Extensions : le dessin remplit un onglet avec les outils d’Excalidraw : formes, flèches, texte, images et bibliothèque. Ce que vous dessinez est enregistré dans le fichier au fur et à mesure.

- Les dessins faits avec le plugin Excalidraw d’Obsidian (`.excalidraw.md`) s’ouvrent et s’enregistrent aussi. La note garde son front matter et ses autres sections, son dessin reste compressé s’il l’était, et la liste des mots du dessin est réécrite pour qu’une recherche les trouve toujours. Les images liées par la note s’affichent.
- La page suit la langue de Textus et son mode clair ou sombre.
- Si le fichier est modifié ailleurs pendant qu’il est ouvert, l’onglet montre le nouveau dessin ; un enregistrement n’écrit jamais par-dessus.
- Les polices manuscrites d’Excalidraw sont fournies avec le plugin, sauf la chinoise : le texte chinois et japonais utilise la police de votre système.

Le plugin demande à lire et écrire des fichiers : il lit le dessin et les images qu’il lie, et n’écrit que le dessin que vous modifiez.

## Changements

- **0.1.2** - Its page is in every language Textus speaks.
- **0.1.1** - Its package lists the libraries it carries, with their licenses.
- **0.1.0** - first version: `.excalidraw` and Obsidian Excalidraw drawings edited in a tab with Excalidraw.

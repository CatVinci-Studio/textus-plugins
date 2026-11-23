# Visionneuse d’images

Ouvre les images et les fichiers SVG dans un onglet, pour zoomer, les faire pivoter et lire la source d’un SVG.

## Voir une image

- Ouvrez un fichier PNG, JPEG, GIF, WebP, AVIF, BMP, ICO ou SVG depuis la barre latérale, ou faites-le glisser dans la fenêtre. Il s’ouvre dans son propre onglet, ajusté à celui-ci.
- La barre indique les dimensions de l’image en pixels et la taille du fichier.
- Zoomez avec les boutons **−** et **+** ou **Ctrl+molette** (**⌘+molette** sur Mac). Cliquez sur le pourcentage pour passer de l’image ajustée à sa taille réelle, et inversement.
- Une fois zoomée, faites glisser l’image pour la parcourir. Un double-clic passe de l’image ajustée à sa taille réelle, à l’endroit cliqué, et inversement.
- Le bouton **Faire pivoter** la tourne d’un quart de tour à chaque fois. Seul l’affichage change ; le fichier reste tel quel.
- Touches : **+** et **-** zooment, **0** affiche la taille réelle, **F** ajuste, **R** fait pivoter.
- Pour un SVG, **Source** affiche son code à lire ou copier, et **Image** revient en arrière. Le SVG est affiché comme une image : ses scripts ne s’exécutent jamais.
- Un fichier introuvable ou qui n’est pas une image le signale, au lieu d’un onglet vide.

## Autorisations

Elle n’en demande aucune. Elle lit seulement le fichier que vous ouvrez.

## Changements

- **0.2.6** - Its page no longer says which devices it runs on: the store shows that. Its page receives Textus's messages by the API's current name.
- **0.2.5** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.2.4** - A turned and zoomed picture now scrolls to every edge, and a sideways picture fits the window. Zoom and turn are kept when the panel moves, a fourth turn no longer spins back, and the bar fits a narrow panel.
- **0.2.3** - A trackpad pinch zooms smoothly, in step with the gesture; with Textus 1.3.13 a pinch on a Mac zooms the picture, not the document behind it. Its bar keeps Textus's one order: what it shows, then find and zoom.
- **0.2.2** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.2.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.0** - Textus's own buttons and tab bar; labels follow the interface language when it changes
- **0.1.3** - colors from Textus 1.3's themes
- **0.1.2** - the percentage switches between fit and actual size
- **0.1.0-0.1.1** - first versions: zoom, fit, drag, rotate, keys, an SVG's source, and a message for a file that can't be opened

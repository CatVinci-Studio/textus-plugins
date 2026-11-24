# Marp

Présente un document en diapositives, écrites à la manière de [Marp](https://marp.app).

## Créer des diapositives

- Une nouvelle diapositive commence à chaque `---`.
- **Extensions › Présenter en diapositives** affiche le diaporama dans un onglet à côté du document, qui suit votre écriture. ← → (ou ↑ ↓, Page Up et Page Down) et Espace passent d’une diapositive à l’autre ; **Plein écran** (ou F) lance la présentation. Pendant la présentation, un toucher ou un clic sur le tiers gauche de la diapositive revient en arrière et partout ailleurs avance, tout comme un balayage ; touchez la diapositive ou bougez le pointeur pour **Quitter**, ou appuyez sur Échap.
- Les directives de Marp choisissent le thème et la mise en page, par exemple en haut :

```markdown
---
theme: gaia
paginate: true
---
```

- Les images s’affichent dans le diaporama, y compris le `![[photo.png]]` d’Obsidian ; `![[photo.png|300]]` fixe la largeur (`300x200` les deux dimensions).

## Enregistrer un diaporama

**Extensions › Exporter les diapositives en HTML** (ou **Enregistrer le HTML** dans le diaporama) enregistre `name.slides.html` à côté du document : un seul fichier qui se présente dans n’importe quel navigateur, avec les mêmes touches. Les images sont liées depuis le dossier du document : gardez le fichier à côté d’elles. Le document doit d’abord être enregistré.

Construit sur [Marp Core](https://github.com/marp-team/marp-core) (MIT), qui apporte ses thèmes (default, gaia, uncover), les maths et la coloration du code - et qui fait peser ce plugin environ 4 Mo.

## Autorisations

- **Lire le document** : pour dessiner ses diapositives pendant que vous écrivez.
- **Lire et écrire des fichiers** : pour trouver les images qu’il affiche, et enregistrer le diaporama HTML à côté du document.
- **Outils pour Textus AI** : pour que Textus AI puisse enregistrer le diaporama pour vous.

## Changements

- **0.3.14** - Its icon is Marp's own logo.
- **0.3.13** - The deck no longer stays blank when no document is in front - in Source Mode or Source and Preview, or presented from the plugin's page: it shows the document open in another tab, as last saved, or says to click one. Slides scale to their frame on a Mac, iPhone and iPad, in the tab and in a saved deck opened in Safari.
- **0.3.12** - Presenting on a phone or tablet: tap or swipe to move between slides, and Exit to stop - no keyboard needed. A click moves on in full screen too, as in a saved deck. In a narrow tab, Save HTML goes into the ⋯ menu instead of pushing Full Screen onto a second row. Its page is in every language Textus speaks.
- **0.3.11** - Its package lists the libraries it carries, with their licenses.
- **0.3.10** - Code kept for Textus versions it no longer runs on is gone. From Textus 1.4.4 the deck is also in File › Export, as Slides (HTML).
- **0.3.9** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.3.8** - Present as Slides draws the deck on a phone, where its tab comes to the front alone.
- **0.3.7** - Formulas use KaTeX's own fonts from Textus 1.4.2 on, in the tab and in a saved HTML file; earlier versions keep the system's fonts.
- **0.3.6** - A deck needs nothing from the web: emoji show as text instead of pictures from a CDN, formulas use the system's fonts, and the Gaia theme no longer loads a web font, in the tab and in a saved HTML file.
- **0.3.5** - Writing a deck with many pictures is lighter: the slides are made again only when the text changed, and pictures it no longer shows are let go.
- **0.3.4** - Full Screen works in the tab (presenting in place where the window can't go full screen); the deck renders only while its tab is open; shortcuts leave Cmd/Ctrl/Alt keys alone.
- **0.3.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - pictures in the deck, including Obsidian's `![[picture]]` embeds with a width
- **0.3.0** - a tool for Textus AI, `export_slides`
- **0.2.0** - named Marp in every language; Textus's own buttons and colors; labels follow the interface language
- **0.1.0-0.1.1** - first versions: a live deck beside the document, full screen, and a self-presenting HTML file

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `export_slides`: Enregistre le document au premier plan comme une présentation Marp - une diapositive par ligne --- - dans un fichier HTML à côté (name.slides.html) qui se présente dans n'importe quel navigateur. Renvoie son chemin et son nombre de diapositives.
<!-- /ai-tools -->

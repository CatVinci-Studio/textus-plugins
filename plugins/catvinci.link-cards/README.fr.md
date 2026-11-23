# Cartes de lien

Affiche un lien en carte avec le titre, la description et l’image de sa page, ou lit une vidéo Bilibili sur place.

## Créer une carte

- Tapez `/` et choisissez **Insérer une carte de lien…**, puis collez un lien. Ou sélectionnez un lien dans le texte, faites un clic droit et choisissez **Insérer une carte de lien…** pour le transformer en carte.
- La carte montre le titre, la description, l’image et le nom du site de la page. Cliquez dessus pour ouvrir la page dans votre navigateur.
- Un lien Bilibili lit plutôt sa vidéo dans la carte. Un lien YouTube s’affiche en carte avec l’image de la vidéo et s’ouvre dans votre navigateur.
- Si la page ne peut pas être lue (hors ligne, ou ce n’est pas une page web), la carte contient seulement l’adresse.

## Ce qui est enregistré

La carte est un bloc `card` qui contient ce que disait la page : elle s’affiche sans réseau et se lit comme du texte dans n’importe quelle app Markdown :

````markdown
```card
url: https://textus.md
title: Textus
description: A Markdown editor with AI that writes with you.
image: https://textus.md/og.png
```
````

- **Récupérer à nouveau**, dans le menu du clic droit d’une carte, reprend le titre et l’image les plus récents de la page.
- Les cartes venues d’Obsidian s’affichent aussi : les blocs `cardlink` d’Auto Card Link et les blocs `embed` de Link Embed sont dessinés en cartes, et laissés tels qu’ils sont écrits.

## Autorisations

- **Réseau, toute adresse** : pour lire les pages dont vous faites des cartes. Il ne récupère que ces liens.
- **Lire et modifier le document** : pour lire le lien sélectionné et insérer la carte.
- **Outils pour Textus AI** : pour que Textus AI puisse faire une carte pour un lien.

## Changements

- **0.5.1** - Its page is in every language Textus speaks. Needs Textus 1.4.4 itself, not a test version of it. Its page receives Textus's messages by the API's current name.
- **0.5.0** - Right-click a selected web address for Turn into a Link Card; the item no longer shows for other selections. Needs Textus 1.4.4.
- **0.4.3** - Pictures and site icons show again; titles with an apostrophe are kept whole; **Fetch again** moved into the card's right-click menu; YouTube links show as cards with the video's still.
- **0.4.2** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.0** - Obsidian's `cardlink` (Auto Card Link) and `embed` (Link Embed) blocks are drawn as cards
- **0.3.1** - the README's example links to textus.md
- **0.3.0** - a tool for Textus AI, `fetch_link_card`
- **0.2.0** - Textus's own buttons and colors (Textus 1.3.2)
- **0.1.0-0.1.1** - first versions: link cards kept in a `card` block, video players, **Fetch again**

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `fetch_link_card`: Récupère le titre, la description, l'image et le nom du site d'une page web, et les renvoie avec un bloc ```card qui montre le lien en carte - à insérer là où l'utilisateur le veut.
<!-- /ai-tools -->

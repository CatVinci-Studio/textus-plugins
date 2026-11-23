# Images Openverse

Permet à Textus AI de trouver sur [Openverse](https://openverse.org) des images sous licence libre pour vos documents.

## Comment s’en servir

- Demandez à Textus AI une vraie photo ou un vrai dessin de quelque chose, par exemple « une image d’un phare au crépuscule ». Il cherche sur Openverse (Flickr, des musées et plus encore) et place l’image avec sa ligne de crédit en dessous.
- Chaque crédit nomme l’auteur, la licence et la source, avec un lien vers la page d’où vient l’image.
- Seules les images CC BY, CC BY-SA, CC0 et du domaine public sont utilisées. Openverse reprend ce que dit chaque source : chaque licence est donc vérifiée de nouveau avant qu’une image soit proposée.
- Les recherches en anglais trouvent le plus de résultats.
- Le plugin n’a ni menu ni réglages à lui : il ajoute un outil à Textus AI.

## Autorisations

- **Réseau, api.openverse.org seulement** : pour chercher sur Openverse. Ni compte ni clé ne sont nécessaires ; Openverse limite le nombre de recherches qu’une adresse peut faire par jour.
- **Outils pour Textus AI** : pour que Textus AI puisse chercher des images.

## Changements

- **0.1.3** - Its page is in every language Textus speaks. It no longer gives a number for Openverse's daily limit, which can change.
- **0.1.2** - The store description now opens with what the plugin does.
- **0.1.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.0** - first version: openly licensed pictures from Openverse for Textus AI, each with its credit line

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `find_open_pictures`: Trouve sur Openverse des images sous licence libre (CC BY, CC BY-SA, CC0, domaine public) pour une description, chacune avec son URL et la ligne de crédit que demande sa licence, à placer sous l'image. À utiliser quand l'utilisateur veut une vraie photo ou un vrai dessin plutôt qu'une image générée.
<!-- /ai-tools -->

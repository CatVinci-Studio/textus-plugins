# Signets

Mettez un signet sur un passage et revenez-y depuis la barre latérale, dans n’importe quel document.

Sélectionnez quelques mots et choisissez **Signet sur la sélection** : clic droit sur la sélection, ou **Plugins › Signet sur la sélection**. Enregistrez d’abord le document, car le signet renvoie à son fichier.

L’onglet **Signets** de la barre latérale les liste par document. Cliquez sur l’un d’eux pour ouvrir le document à ces mots. Pour en supprimer un, faites un clic droit et choisissez **Supprimer le signet**. Un document renommé ou déplacé garde ses signets.

## Coffres Obsidian

Quand le dossier ouvert est un coffre Obsidian (il contient un dossier `.obsidian`) :

- Les signets d’Obsidian, dans `.obsidian/bookmarks.json`, apparaissent aussi dans l’onglet, sous **Signets d’Obsidian**, avec leurs groupes. Ceux des notes, des titres et des blocs sont listés ; recherches, dossiers et autres ne le sont pas.

## Autorisations

- Lire le document : pour lire la sélection.
- Lire des fichiers : pour le `bookmarks.json` d’Obsidian.
- Outils pour Textus AI : pour que Textus AI puisse lister vos signets.

## Changements

- **0.4.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.4.4** - Obsidian's bookmarks are listed as before but no longer written: Textus 1.4 keeps plugins out of `.obsidian`. Needs Textus 1.4.0.
- **0.4.3** - Rows are grouped by the document's path in the folder, one group per document; long passages end at a word with "…"; a failed block-id edit in a vault keeps the bookmark.
- **0.4.2** - Shorter help and empty-state text.
- **0.4.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.0** - In an Obsidian vault, new bookmarks are written to Obsidian's `bookmarks.json` too, and removed and renamed there.
- **0.3.0** - Lists the vault's own Obsidian bookmarks of notes, headings and blocks.
- **0.2.1** - Paths handled by code shared with other plugins; nothing changes in use.
- **0.2.0** - Textus AI can list your bookmarks (`list_bookmarks`).
- **0.1.0-0.1.2** - First versions: bookmark a selection, the sidebar list by document, bookmarks that follow renames; store page and icon; runs on desktop and iOS.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_bookmarks`: Liste les signets de l'utilisateur : les mots marqués dans chaque document, avec le chemin du document dans le dossier ouvert.
<!-- /ai-tools -->

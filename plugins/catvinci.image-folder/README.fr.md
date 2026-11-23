# Images avec le document

Range les images de chaque document dans un dossier à côté de lui, à son nom, comme le font Typora et VS Code : les images de `Note.md` vont dans `Note.assets/`.

Rien à activer ni à régler : elle fonctionne seule une fois installée.

- Collez ou déposez une image dans un document enregistré. Textus enregistre d'abord l'image, puis cette extension la déplace dans le dossier du document et change le lien en `Note.assets/image.png`. Un nom déjà pris reçoit un numéro ; rien n'est écrasé. Si le lien ne peut pas être changé, l'image revient à sa place.
- Renommez un document dans son dossier, et son dossier d'images est renommé avec lui, liens compris - sauf si un autre document pointe aussi vers ce dossier ; dans ce cas, les deux restent tels quels.
- Les images déjà présentes dans vos documents restent où elles sont.
- Dans un coffre Obsidian qui définit un dossier de pièces jointes, et dans un graphe Logseq, les images restent là où cette application les met.

Elle prend en charge les images PNG, JPEG, GIF, WebP, AVIF, BMP, SVG, ICO, HEIC et TIFF. Elle fonctionne sur ordinateur et demande Textus 1.3.0 ou plus récent. Elle demande à lire et écrire des fichiers, pour déplacer les images et renommer leurs dossiers, et à lire et modifier le document affiché, pour changer le lien vers une image déplacée.

## Changements

- **0.1.8** - Its page no longer says which devices it runs on: the store shows that. It names the Textus it needs, 1.4.0.
- **0.1.7** - The store description now opens with what the plugin does.
- **0.1.6** - Adding many pictures at once (a sync, a folder copied in) no longer reads the open document over and over.
- **0.1.5** - In an Obsidian vault, pictures stay where the vault's attachment setting puts them again: the setting is read through Textus.
- **0.1.4** - Leaves pictures where a document's Typora image folder setting puts them, and no longer moves a folder while some links to it may still be unchecked.
- **0.1.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.2** - Leaves pictures where an Obsidian vault's attachment folder setting or a Logseq graph puts them.
- **0.1.1** - A shorter name: Images Follow Document.
- **0.1.0** - First version: pasted and dropped pictures move into `Note.assets/`, and the folder follows a renamed document.

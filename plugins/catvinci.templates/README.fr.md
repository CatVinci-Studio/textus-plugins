# Modèles

Crée de nouveaux documents et insère des extraits à partir de vos propres modèles, avec la date, l'heure et le titre déjà remplis.

Les modèles sont des fichiers Markdown du dossier **Templates** du dossier ouvert (dans un coffre Obsidian, celui que nomment ses réglages de modèles) : ils vont donc partout où vont vos notes. S'il n'y en a encore aucun, un modèle **Compte rendu de réunion** est créé pour commencer.

- **Extensions › Nouveau depuis un modèle…** crée un document à la racine du dossier ouvert à partir d'un de vos modèles. Il demande le nom et refuse un nom déjà pris.
- **Extensions › Insérer un modèle…**, ou **Insérer un modèle…** dans le menu barre oblique, place un modèle au curseur.
- **Extensions › Enregistrer comme modèle…** garde le document affiché comme modèle. Un nom déjà pris reçoit un numéro ; rien n'est écrasé.

## Ce qui est rempli

- `{{date}}`, `{{time}}` et `{{title}}` sont remplis à l'utilisation ; `{{date:YYYY-MM-DD}}` et `{{time:HH:mm}}` acceptent un format, comme dans Obsidian.
- Dans un coffre Obsidian, `{{date}}` et `{{time}}` prennent les formats de date et d'heure de ses réglages de modèles.
- Les balises courantes de Templater sont remplies aussi : `<% tp.date.now("YYYY-MM-DD") %>` (avec un décalage en jours, comme `-1`, ou `"P1W"`), `tp.date.today`, `tomorrow` et `yesterday`, `<% tp.file.title %>`, `tp.file.creation_date()` et `tp.file.folder()` ; `<% tp.file.cursor() %>` y place le curseur.
- Les scripts et les autres balises ne sont jamais exécutés : ils restent tels quels, et une notification les nomme.

Fonctionne sur ordinateur et sur iPhone et demande Textus 1.3.10 ou plus récent. Il demande à lire et écrire des fichiers du dossier ouvert, pour les modèles et les nouveaux documents ; à lire et modifier le document affiché, pour insérer un modèle ou l'enregistrer comme modèle ; et donne à Textus AI les deux outils ci-dessous.

## Changements

- **0.5.6** - Its page no longer says which devices it runs on: the store shows that. It names the Textus it needs, 1.4.3.
- **0.5.5** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller. Needs Textus 1.4.3.
- **0.5.4** - A taken name gets the next free one as the file is written, never a clash (Textus 1.4.3).
- **0.5.3** - The store description now opens with what the plugin does.
- **0.5.2** - Templates in a hidden or lowercase templates folder, and in its subfolders, now show up. After Insert, the caret lands right after the template.
- **0.5.1** - **New from Template…** from a file's or folder's right-click menu makes the document in that folder.
- **0.5.0** - Templates are filled in by Textus itself, the same way as daily notes; needs Textus 1.3.10.
- **0.4.1** - Templates are listed in natural order: 2 before 10.
- **0.4.0** - Templater's common `tp.date` and `tp.file` tags, and an Obsidian vault's Templates date and time formats; tags that aren't run are named in a notice.
- **0.3.0** - Templates are Markdown files in the Templates folder (a vault's own templates folder in Obsidian), moved there once from where older versions kept them; `{{date:FORMAT}}` and `{{time:FORMAT}}`.
- **0.2.0** - Textus AI can list your templates and make a document from one.
- **0.1.3** - Says where it runs: desktop and iPhone.
- **0.1.2** - New from Template refuses a name that is already taken.
- **0.1.0-0.1.1** - First versions: new documents, inserted snippets and saved templates, with `{{date}}`, `{{time}}` and `{{title}}`; store page and icon.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_templates`: Liste les modèles de document de l'utilisateur, chacun avec son nom et son Markdown, où {{date}}, {{time}}, {{title}} et les balises tp.date et tp.file de Templater sont remplis à l'usage.
- `create_from_template`: Crée un nouveau document dans le dossier ouvert à partir d'un modèle de l'utilisateur, avec {{date}}, {{time}}, {{title}} et les balises tp.date et tp.file de Templater remplis. Renvoie son chemin et, dans notRun, les balises laissées telles quelles.
<!-- /ai-tools -->

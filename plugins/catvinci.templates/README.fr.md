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

- **0.5.3** - La description de la boutique commence désormais par ce que fait le plugin.
- **0.5.2** - Les modèles d'un dossier de modèles caché ou en minuscules, et de ses sous-dossiers, apparaissent désormais. Après l'insertion, le curseur se place juste après le modèle.
- **0.5.1** - **Nouveau depuis un modèle…** depuis le menu contextuel d'un fichier ou d'un dossier crée le document dans ce dossier.
- **0.5.0** - Les modèles sont remplis par Textus lui-même, comme les notes du jour ; demande Textus 1.3.10.
- **0.4.1** - Les modèles sont listés dans l'ordre naturel : 2 avant 10.
- **0.4.0** - Les balises courantes `tp.date` et `tp.file` de Templater, et les formats de date et d'heure des modèles d'un coffre Obsidian ; une notification nomme les balises non exécutées.
- **0.3.0** - Les modèles sont des fichiers Markdown du dossier Templates (dans Obsidian, le dossier de modèles du coffre), déplacés là une fois depuis l'endroit où les anciennes versions les gardaient ; `{{date:FORMAT}}` et `{{time:FORMAT}}`.
- **0.2.0** - Textus AI peut lister vos modèles et créer un document à partir de l'un d'eux.
- **0.1.3** - Indique où il fonctionne : ordinateur et iPhone.
- **0.1.2** - Nouveau depuis un modèle refuse un nom déjà pris.
- **0.1.0-0.1.1** - Premières versions : nouveaux documents, extraits insérés et modèles enregistrés, avec `{{date}}`, `{{time}}` et `{{title}}` ; page dans la boutique et icône.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_templates`: Liste les modèles de document de l'utilisateur, chacun avec son nom et son Markdown, où {{date}}, {{time}}, {{title}} et les balises tp.date et tp.file de Templater sont remplis à l'usage.
- `create_from_template`: Crée un nouveau document dans le dossier ouvert à partir d'un modèle de l'utilisateur, avec {{date}}, {{time}}, {{title}} et les balises tp.date et tp.file de Templater remplis. Renvoie son chemin et, dans notRun, les balises laissées telles quelles.
<!-- /ai-tools -->

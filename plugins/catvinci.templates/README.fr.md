# Modèles

De nouveaux documents et extraits à partir de vos modèles, avec la date, l’heure et le titre remplis.

- Les modèles sont des fichiers Markdown dans le dossier **Templates** du dossier ouvert (dans un coffre Obsidian, le dossier indiqué par ses réglages de modèles) : ils suivent vos notes. Ceux d’une version antérieure y sont déplacés une fois ; un nom déjà pris reçoit un numéro, rien n’est écrasé. `{{date:YYYY-MM-DD}}` et `{{time:HH:mm}}` acceptent un format, comme dans Obsidian.
- **Nouveau depuis un modèle…** crée un document dans le dossier ouvert ; **Insérer un modèle…** (ou `/` dans le texte) l’insère au curseur.
- **Enregistrer comme modèle…** garde le document ouvert comme modèle.
- Dans un modèle, `{{date}}`, `{{time}}` et `{{title}}` sont remplis à l’usage. Un modèle Compte rendu de réunion est là pour commencer.
- Dans un coffre Obsidian, `{{date}}` et `{{time}}` prennent les formats de date et d’heure de ses réglages de modèles. Les balises courantes de Templater sont remplies aussi : `<% tp.date.now("YYYY-MM-DD") %>` (avec un décalage en jours, comme `-1`, ou `"P1W"`), `tp.date.today`, `tomorrow` et `yesterday`, `<% tp.file.title %>`, `tp.file.creation_date()` et `tp.file.folder()` ; `<% tp.file.cursor() %>` y place le curseur. Les scripts et les autres balises ne sont jamais exécutés : ils restent tels quels, et un avis les nomme.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_templates`: Liste les modèles de document de l'utilisateur, chacun avec son nom et son Markdown, où {{date}}, {{time}}, {{title}} et les balises tp.date et tp.file de Templater sont remplis à l'usage.
- `create_from_template`: Crée un nouveau document dans le dossier ouvert à partir d'un modèle de l'utilisateur, avec {{date}}, {{time}}, {{title}} et les balises tp.date et tp.file de Templater remplis. Renvoie son chemin et, dans notRun, les balises laissées telles quelles.
<!-- /ai-tools -->

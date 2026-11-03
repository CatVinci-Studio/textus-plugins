# Modèles

De nouveaux documents et extraits à partir de vos modèles, avec la date, l’heure et le titre remplis.

- **Nouveau depuis un modèle…** crée un document dans le dossier ouvert ; **Insérer un modèle…** (ou `/` dans le texte) l’insère au curseur.
- **Enregistrer comme modèle…** garde le document ouvert comme modèle.
- Dans un modèle, `{{date}}`, `{{time}}` et `{{title}}` sont remplis à l’usage. Un modèle Compte rendu de réunion est là pour commencer.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `list_templates`: Liste les modèles de document de l'utilisateur, chacun avec son nom et son Markdown, où {{date}}, {{time}} et {{title}} sont remplis à l'usage.
- `create_from_template`: Crée un nouveau document dans le dossier ouvert à partir d'un modèle de l'utilisateur, avec {{date}}, {{time}} et {{title}} remplis. Renvoie son chemin.
<!-- /ai-tools -->

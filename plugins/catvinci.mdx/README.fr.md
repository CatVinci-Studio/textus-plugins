# MDX

Pour les documents MDX - le Markdown avec composants qu’utilisent Docusaurus, Nextra
et d’autres outils de sites. Textus ouvre les fichiers `.mdx` de lui-même et garde
leurs imports, leurs `{expressions}` et leurs composants exactement tels qu’écrits ; ce
plugin ajoute :

- **Problèmes soulignés.** Le compilateur de MDX vérifie le document pendant que vous
  écrivez, et le premier problème trouvé est souligné là où il se trouve, avec
  sa ligne et ce qui ne va pas.
- **Aperçu MDX.** Le document dessiné à côté : onglets, encadrés
  (`<Callout>`, `<Admonition>`, `:::tip`) et `<details>` dans le style de Textus,
  tout autre composant en carte avec son nom et ses attributs. Rien du
  code du document ne s’exécute.
- **Enregistrer en Markdown / Enregistrer en MDX.** Une copie à côté du document : les encadrés
  deviennent des alertes GitHub, les onglets des parties avec titre, et un composant vide
  reste en commentaire ; dans l’autre sens, les accolades et `<` sont échappés, et
  les commentaires et `<br>` écrits comme MDX les veut.

Vous les trouvez dans le menu Extensions, ou d’un clic droit dans un document `.mdx`.

## Autorisations

- **Lire le document** : pour le vérifier et le dessiner pendant que vous écrivez.
- **Lire et écrire des fichiers** : pour vérifier un fichier .mdx que Textus AI nomme, et enregistrer la copie convertie à côté du document.
- **Outils pour Textus AI** : pour que Textus AI puisse vérifier le MDX qu’il écrit.

## Changements

- **0.1.3** - Its page is in every language Textus speaks. Its page receives Textus's messages by the API's current name.
- **0.1.2** - Its package lists the libraries it carries, with their licenses.
- **0.1.1** - Preview MDX on a phone, where the preview shows alone, draws the document it was opened from instead of an empty page.
- **0.1.0** - First version: problems underlined by MDX's compiler, Preview MDX, Save as Markdown and Save as MDX, and check_mdx for Textus AI.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `check_mdx`: Vérifie du MDX avec le compilateur officiel de MDX et donne le premier problème avec sa ligne et sa colonne. À utiliser après avoir écrit ou modifié un document .mdx, avant de dire qu’il fonctionne.
<!-- /ai-tools -->

# Calendrier et notes du jour

Garde une note pour chaque jour dans un dossier du dossier ouvert, avec un calendrier dans la barre latérale pour retrouver n'importe laquelle.

- Appuyez sur **Ctrl+Alt+J** (**⌘⌥J** sur Mac) ou choisissez **Extensions › Ouvrir la note du jour**. La note d'aujourd'hui s'ouvre ; la première fois, elle est créée.
- **Extensions › Ouvrir la veille** et **Extensions › Ouvrir le lendemain** passent de la note du jour affichée à sa voisine.
- L'onglet **Calendrier** de la barre latérale affiche un mois et marque les jours qui ont une note. Cliquez sur un jour pour ouvrir sa note, ou sur **Aujourd’hui** pour ouvrir celle du jour. La semaine commence comme dans votre région.
- Une note qui existe déjà n'est jamais écrasée.

## Réglages

- **Dossier des notes du jour** : un dossier dans le dossier ouvert, `Daily` par défaut.
- **La note d'un nouveau jour** : le texte par lequel commence une nouvelle note, `# {{date}}` par défaut. Il accepte `{{date}}`, `{{weekday}}`, `{{yesterday}}` et `{{tomorrow}}` (pour des liens comme `[[{{yesterday}}]]`), `{{time}}`, `{{title}}`, `{{date:FORMAT}}` et `{{date+1d}}` ; `\n` commence une nouvelle ligne. Ce peut aussi être le nom d'un modèle du dossier Templates, comme `Daily`.
- **Notes hebdomadaires** et **Notes mensuelles** : désactivées par défaut. Une fois activées, **Extensions › Ouvrir la note de cette semaine** et **Ouvrir la note de ce mois** les ouvrent, tout comme les numéros de semaine et le nom du mois dans le calendrier. Chacune a son dossier (`Weekly`, `Monthly`), son format de nom (`gggg-[W]ww` donne `2026-W45`, `YYYY-MM` donne `2026-11`) et son modèle. Un modèle hebdomadaire accepte `{{monday:YYYY-MM-DD}}` … `{{sunday}}` pour les jours de la semaine.

## Coffres Obsidian

Dans un coffre Obsidian, ce sont ses propres réglages de notes du jour qui décident : dossier, format du nom (comme `YYYY/MM/YYYY-MM-DD` ou `MMMM Do, YYYY`) et modèle. Textus ne les modifie jamais. Un coffre sans ces réglages garde ses notes à sa racine, comme Obsidian. `{{date}}`, `{{yesterday}}` et `{{tomorrow}}` sont écrits dans le format de nom des notes. Dans un coffre doté de l'extension Periodic Notes, ses réglages hebdomadaires et mensuels décident.

## Permissions

L'extension lit et écrit des fichiers du dossier ouvert pour trouver et créer les notes, et lit quel document est affiché pour connaître la veille et le lendemain. Elle donne aussi à Textus AI les deux outils ci-dessous. Elle fonctionne sur ordinateur et sur iPhone et demande Textus 1.3.10 ou plus récent.

## Changements

- **0.7.2** - Textes d'aide et d'état vide plus courts.
- **0.7.1** - Ses barres, listes et contrôles sont désormais ceux de Textus, grandissent avec l’interface et suivent chaque thème ; nécessite Textus 1.3.12.
- **0.7.0** - Les dates et les modèles sont remplis par Textus lui-même, comme dans l'extension Modèles ; demande Textus 1.3.10.
- **0.6.0** - Notes hebdomadaires et mensuelles, avec leurs réglages, les numéros de semaine et le nom du mois dans le calendrier, et les réglages Periodic Notes d'un coffre.
- **0.5.0** - Un coffre sans réglages de notes du jour les garde à sa racine ; `{{date}}`, `{{yesterday}}` et `{{tomorrow}}` suivent le format de nom, `MMMM Do, YYYY` compris.
- **0.4.0** - Suit les réglages de notes du jour d'un coffre Obsidian ; le texte de départ peut nommer un modèle du dossier Templates ; `{{date:FORMAT}}` et `{{title}}`.
- **0.3.0** - Textus AI peut lire la note d'un jour et y ajouter du texte.
- **0.2.0** - Le calendrier utilise les commandes de Textus et suit la langue de l'interface quand elle change ; demande Textus 1.3.2.
- **0.1.3** - Couleurs et typographie de Textus 1.3.
- **0.1.2** - La semaine commence comme dans votre région ; la note d'un jour n'est jamais écrasée.
- **0.1.0-0.1.1** - Premières versions : la note du jour par un raccourci, le calendrier, la veille et le lendemain, `{{weekday}}`, `{{yesterday}}`, `{{tomorrow}}` et `{{time}}` dans le modèle.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `read_daily_note`: Lit la note quotidienne d'un jour - celle d'aujourd'hui si aucune date n'est donnée - dans le dossier des notes quotidiennes : son chemin, si elle existe, et son texte.
- `append_to_daily_note`: Ajoute du Markdown à la fin de la note quotidienne d'un jour - celle d'aujourd'hui si aucune date n'est donnée -, en la créant d'abord depuis son modèle si elle n'existe pas. Une note à garder pour plus tard dans la barre latérale, c’est add_note ; une tâche datée, add_task.
<!-- /ai-tools -->

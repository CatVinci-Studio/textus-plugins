# Calendrier et notes du jour

Garde une note pour chaque jour dans un dossier du dossier ouvert, avec un calendrier dans la barre latérale pour retrouver n'importe laquelle.

- Appuyez sur **Ctrl+Alt+J** (**⌘⌥J** sur Mac) ou choisissez **Extensions › Ouvrir la note du jour**. La note d'aujourd'hui s'ouvre ; la première fois, elle est créée.
- **Extensions › Ouvrir la veille** et **Extensions › Ouvrir le lendemain** passent de la note du jour affichée à sa voisine.
- L'onglet **Calendrier** de la barre latérale affiche un mois et marque les jours qui ont une note. Cliquez sur un jour pour ouvrir sa note, ou sur **Aujourd’hui** pour ouvrir celle du jour. La semaine commence comme dans la langue de Textus, comme le comptent les numéros de semaine.
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

- **0.7.9** - Its page no longer says which devices it runs on: the store shows that. It names the Textus it needs, 1.4.3.
- **0.7.8** - Where the bar is too narrow for even the short month name (a phone's sidebar), the month goes on a row of its own above the buttons instead of losing its year. The calendar writes dates with Textus's own, so the package is smaller.
- **0.7.7** - Weeks start as Textus's language has them, not the device's region, so they agree with the week numbers.
- **0.7.6** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.7.5** - The Calendar's month title starts at the left and ends in an ellipsis in a narrow sidebar, instead of being cut at both ends.
- **0.7.4** - In a narrow panel, such as on a phone, the calendar shows the month's short name instead of cutting the long one off.
- **0.7.3** - Impossible dates such as February 30 are refused, the calendar stays a comfortable width in wide panels and redraws when folder settings change, and weekly and monthly settings show only when those notes are on.
- **0.7.2** - Shorter help and empty-state text.
- **0.7.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.7.0** - Dates and templates are filled in by Textus itself, the same way as in the Templates plugin; needs Textus 1.3.10.
- **0.6.0** - Weekly and monthly notes, with their own settings, the calendar's week numbers and month name, and a vault's Periodic Notes settings.
- **0.5.0** - A vault without daily notes settings keeps its notes at its top; `{{date}}`, `{{yesterday}}` and `{{tomorrow}}` follow the notes' name format, `MMMM Do, YYYY` included.
- **0.4.0** - Follows an Obsidian vault's daily notes settings; the starting text can name a template in the Templates folder; `{{date:FORMAT}}` and `{{title}}`.
- **0.3.0** - Textus AI can read a day's note and add to it.
- **0.2.0** - The calendar uses Textus's own controls and follows the interface language when it changes; needs Textus 1.3.2.
- **0.1.3** - Textus 1.3's colors and type.
- **0.1.2** - Weeks start as your region has them; a day's note is never written over.
- **0.1.0-0.1.1** - First versions: today's note with a shortcut, the calendar, the day before and after, `{{weekday}}`, `{{yesterday}}`, `{{tomorrow}}` and `{{time}}` in the template.

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `read_daily_note`: Lit la note quotidienne d'un jour - celle d'aujourd'hui si aucune date n'est donnée - dans le dossier des notes quotidiennes : son chemin, si elle existe, et son texte.
- `append_to_daily_note`: Ajoute du Markdown à la fin de la note quotidienne d'un jour - celle d'aujourd'hui si aucune date n'est donnée -, en la créant d'abord depuis son modèle si elle n'existe pas. Une note à garder pour plus tard dans la barre latérale, c’est add_note ; une tâche datée, add_task.
<!-- /ai-tools -->

# Insertion rapide

Tapez `/` pour les titres, listes, tableaux et autres blocs, `:` pour un emoji et `@` pour une date.

## Le menu /

Tapez `/` en début de ligne ou après une espace, et choisissez ce que vous voulez y mettre - les blocs de Textus, les mêmes que ceux du menu Format :

- **Texte, Titre 1–3**, et **listes à puces, numérotées et de tâches**
- **Citation, Encadré, Bloc de code, Formule, Tableau, Séparateur**

En choisir un transforme la ligne où vous êtes. D’autres plugins ajoutent leurs propres blocs au menu (une base de données, une carte de lien, un rappel, un modèle).

Continuez à taper pour réduire la liste : `/table`, `/tab` - dans n’importe quelle langue, et les noms chinois aussi en pinyin (`/biaoge`).

## Emoji

Tapez `:` et un mot pour un emoji : `:tada` donne 🎉, `:+1` 👍, `:笑` 😄.

## Dates

Tapez `@` et un jour, et choisissez la date qu’il désigne :

- English: `@today`, `@tomorrow`, `@yesterday`, `@friday`, `@next friday`, `@in 3 days`, `@next week`
- 中文: `@今天`、`@明天`、`@后天`、`@周五`、`@下周五`、`@星期三`、`@3天后`、`@下周` (ou `@後天`、`@下週五`、`@禮拜三`、`@3天後`)
- 日本語: `@今日`、`@明日`、`@明後日`、`@金曜日`、`@来週金曜日`、`@3日後`

Les semaines commencent le lundi, et un jour de la semaine seul désigne le prochain.

La date s’écrit `2026-11-06`. Réglez **Insérer comme** sur **Un lien vers la note du jour** dans les réglages du plugin pour écrire plutôt un lien vers la note du jour de cette date, comme le dossier écrit ses liens : un lien standard comme `[2026-11-06](Daily/2026-11-06.md)`, ou, dans un coffre Obsidian ou un dossier dont les notes utilisent des liens wiki, `[[2026-11-06]]` avec le nom et le dossier que donnent ses réglages de notes du jour, comme `[[November 6th, 2026]]` ou `[[Journal/2026/11/2026-11-06]]`. Dans un dossier sans ces réglages, les notes du jour sont cherchées dans `Daily/`.

La liste s’ouvre après une espace, en début de ligne ou après un crochet - pas dans une adresse comme `me@example.com` ni dans une citation comme `[@key]`. Après `(`, le `@` reste : `(@tomorrow` devient un rappel, `(@2026-11-06`.

Tout ce qu’il insère est du Markdown simple.

## Autorisations

- **Lire et modifier le document** : pour insérer les blocs, les emoji et les dates.
- **Lire des fichiers** : pour lire les réglages de notes du jour d’un coffre, pour les liens vers un jour.
- **Outils pour Textus AI** : pour que Textus AI puisse transformer un jour dit en mots en sa date.

## Changements

- **0.5.1** - Its page is in every language Textus speaks. Needs Textus 1.4.4 itself, not a test version of it.
- **0.5.0** - The `/` menu lists Textus's own blocks, the Format menu's, so it always matches the app; Turn into… is gone from it, since picking a block turns the line you're on (the block handle's ⋮⋮ also has Turn Into). Needs Textus 1.4.4
- **0.4.3** - Dates in Traditional Chinese like 後天, 3天後 and 下週五 now work. A bare @ lists your app language's dates first, and day links are right relative to the note.
- **0.4.2** - Shares Two-way Links' fix for working out how a note links.
- **0.4.1** - a day's link is a standard link, [2026-11-08](Journal/2026-11-08.md), unless the folder or the note already uses [[wiki links]]
- **0.4.0** - day links are written the way the folder writes links, on Textus 1.3.10's dates; needs Textus 1.3.10
- **0.3.1** - carries the updated shared date code
- **0.3.0** - Natural Dates merged in: `@` dates in English, Chinese and Japanese, links to daily notes, and the `parse_date` tool for Textus AI
- **0.2.0** - **Today's date** leaves the `/` menu for `@today`
- **0.1.0-0.1.1** - first versions: the `/` menu, **Turn into…**, emoji after `:`

<!-- ai-tools -->
## Outils pour Textus AI

Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :

- `parse_date`: Transforme un jour dit en mots - anglais, chinois ou japonais, comme les connaît la complétion @ de l'extension (tomorrow, next wednesday, in 3 days, 下周五, 明後日) - en sa date, YYYY-MM-DD, comptée depuis aujourd'hui. Les semaines commencent le lundi ; un jour de la semaine seul est le prochain.
<!-- /ai-tools -->

# Schnelleinfügen

Tippen Sie `/` für Überschriften, Listen, Tabellen und andere Blöcke, `:` für ein Emoji und `@` für ein Datum.

## Das /-Menü

Tippen Sie `/` am Zeilenanfang oder nach einem Leerzeichen und wählen Sie, was dort hin soll – die Blöcke von Textus selbst, dieselben wie im Menü Format:

- **Text, Überschrift 1–3** und **Aufzählung, nummerierte Liste und Aufgabenliste**
- **Zitat, Hinweis, Codeblock, Formel, Tabelle, Trennlinie**

Eine Wahl macht die Zeile, in der Sie stehen, zu diesem Block. Andere Plugins fügen dem Menü ihre eigenen Blöcke hinzu (eine Datenbank, eine Link-Karte, eine Erinnerung, eine Vorlage).

Tippen Sie weiter, um die Liste einzugrenzen: `/table`, `/tab` – in jeder Sprache, chinesische Namen auch per Pinyin (`/biaoge`).

## Emoji

Tippen Sie `:` und ein Wort für ein Emoji: `:tada` ergibt 🎉, `:+1` 👍, `:笑` 😄.

## Daten

Tippen Sie `@` und einen Tag, und wählen Sie das Datum, das er meint:

- English: `@today`, `@tomorrow`, `@yesterday`, `@friday`, `@next friday`, `@in 3 days`, `@next week`
- 中文: `@今天`、`@明天`、`@后天`、`@周五`、`@下周五`、`@星期三`、`@3天后`、`@下周` (oder `@後天`、`@下週五`、`@禮拜三`、`@3天後`)
- 日本語: `@今日`、`@明日`、`@明後日`、`@金曜日`、`@来週金曜日`、`@3日後`

Wochen beginnen am Montag, und ein Wochentag allein ist der nächste.

Das Datum wird als `2026-11-06` geschrieben. Stellen Sie in den Einstellungen des Plugins **Einfügen als** auf **Link zur Tagesnotiz**, um stattdessen einen Link zur Tagesnotiz dieses Tages zu schreiben, so wie der Ordner Links schreibt: einen Standardlink wie `[2026-11-06](Daily/2026-11-06.md)` oder, in einem Obsidian-Vault oder einem Ordner, dessen Notizen Wikilinks nutzen, `[[2026-11-06]]` mit dem Namen und Ordner, die seine Tagesnotiz-Einstellungen vorgeben, etwa `[[November 6th, 2026]]` oder `[[Journal/2026/11/2026-11-06]]`. In einem Ordner ohne solche Einstellungen werden Tagesnotizen in `Daily/` gesucht.

Die Liste öffnet sich nach einem Leerzeichen, am Zeilenanfang oder nach einer Klammer – nicht in einer Adresse wie `me@example.com` oder einem Zitat wie `[@key]`. Nach `(` bleibt das `@` stehen, so wird `(@tomorrow` zu einer Erinnerung, `(@2026-11-06`.

Alles, was es einfügt, ist einfaches Markdown.

## Berechtigungen

- **Dokument lesen und bearbeiten**: um Blöcke, Emoji und Daten einzufügen.
- **Dateien lesen**: um die Tagesnotiz-Einstellungen eines Vaults für Links zu Tagen zu lesen.
- **Werkzeuge für Textus AI**: damit Textus AI einen Tag in Worten in sein Datum umwandeln kann.

## Änderungen

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
## Werkzeuge für Textus AI

Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:

- `parse_date`: Macht aus einem Tag in Worten - Englisch, Chinesisch oder Japanisch, wie die @-Vervollständigung des Plugins sie kennt (tomorrow, next wednesday, in 3 days, 下周五, 明後日) - sein Datum, YYYY-MM-DD, von heute an gezählt. Wochen beginnen montags; ein Wochentag allein ist der nächste.
<!-- /ai-tools -->

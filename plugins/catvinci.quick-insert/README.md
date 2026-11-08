# Quick Insert

Type `/` for headings, lists, tables and other blocks, `:` for an emoji and `@` for a date.

## The / menu

Type `/` at the start of a line or after a space, and pick what to put there:

- **Heading 1–3, Text**, and **bulleted, numbered and to-do lists**
- **Quote, Code block, Formula, Table, Divider** and a **Callout** (`> [!NOTE]`)

Keep typing to narrow the list: `/table`, `/tab` - in any language, and Chinese names by pinyin too (`/biaoge`).

**Turn into…** (in the `/` menu and the command palette) changes the paragraph you're in into a heading, a list, a quote or code, and back into text.

## Emoji

Type `:` and a word for an emoji: `:tada` gives 🎉, `:+1` 👍, `:笑` 😄.

## Dates

Type `@` and a day, and pick the date it names:

- English: `@today`, `@tomorrow`, `@yesterday`, `@friday`, `@next friday`, `@in 3 days`, `@next week`
- 中文: `@今天`、`@明天`、`@后天`、`@周五`、`@下周五`、`@星期三`、`@3天后`、`@下周`
- 日本語: `@今日`、`@明日`、`@明後日`、`@金曜日`、`@来週金曜日`、`@3日後`

Weeks start on Monday, and a weekday alone is the next one.

The date is written as `2026-11-06`. Set **Insert as** in the plugin's settings to **A link to the day's note** to write a link to that day's daily note instead, the way the folder writes links: `[[2026-11-06]]`, or in an Obsidian vault the name and folder its daily notes settings give, such as `[[November 6th, 2026]]` or `[[Journal/2026/11/2026-11-06]]`. In a folder without such settings, daily notes are looked for in `Daily/`.

The list opens after a space, at the start of a line or after a bracket - not in an address like `me@example.com` or a citation like `[@key]`. After `(` the `@` stays, so `(@tomorrow` becomes a reminder, `(@2026-11-06`.

Everything it inserts is plain Markdown.

## Permissions

- **Read and edit the document**: to insert blocks, emoji and dates.
- **Read files**: to read a vault's daily notes settings for day links.
- **Tools for Textus AI**: so Textus AI can turn a day in words into its date.

It runs on the desktop and on iOS.

## Changes

- **0.4.0** - day links are written the way the folder writes links, on Textus 1.3.10's dates; needs Textus 1.3.10
- **0.3.1** - carries the updated shared date code
- **0.3.0** - Natural Dates merged in: `@` dates in English, Chinese and Japanese, links to daily notes, and the `parse_date` tool for Textus AI
- **0.2.0** - **Today's date** leaves the `/` menu for `@today`
- **0.1.0-0.1.1** - first versions: the `/` menu, **Turn into…**, emoji after `:`

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `parse_date`: Turns a day in words - English, Chinese or Japanese, as the plugin's @ completion knows them (tomorrow, next wednesday, in 3 days, 下周五, 明後日) - into its date, YYYY-MM-DD, counted from today. Weeks start on Monday; a weekday alone is the next one.
<!-- /ai-tools -->

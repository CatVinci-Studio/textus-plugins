# Quick Insert

Type `/` at the start of a line or after a space, and pick what to put there:

- **Headings 1–3, Text**, and **bulleted, numbered and to-do lists**
- **Quote, Code block, Formula, Table, Divider** and a **Callout** (`> [!NOTE]`)

Keep typing to narrow the list: `/table`, `/tab` - in any language, and Chinese names by pinyin too (`/biaoge`).

**Turn into…** (in the `/` menu and the command palette) changes the paragraph you're in into a heading, a list, a quote or code, and back.

Type `:` and a word for an emoji: `:tada` gives 🎉, `:+1` 👍, `:笑` 😄.

## Dates

Type `@` and a day, and pick the date it names:

- English: `@today`, `@tomorrow`, `@friday`, `@next friday`, `@in 3 days`, `@next week`
- 中文: `@今天`、`@明天`、`@后天`、`@周五`、`@下周五`、`@星期三`、`@3天后`、`@下周`
- 日本語: `@今日`、`@明日`、`@金曜日`、`@来週金曜日`、`@3日後`

It is written as a date, `2026-11-06`, or - set **Insert as** to a link - as a link to that day's note: `[[2026-11-06]]`, or in an Obsidian vault the name its daily notes settings give, such as `[[November 6th, 2026]]` or `[[Journal/2026/11/2026-11-06]]`.

The list opens after a space, at the start of a line or after a bracket - not in an address like `me@example.com` or a citation like `[@key]`. After `(` the `@` stays, so `(@tomorrow` becomes a reminder, `(@2026-11-06`.

Everything it inserts is plain Markdown.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `parse_date`: Turns a day in words - English, Chinese or Japanese, as the plugin's @ completion knows them (tomorrow, next wednesday, in 3 days, 下周五, 明後日) - into its date, YYYY-MM-DD, counted from today. Weeks start on Monday; a weekday alone is the next one.
<!-- /ai-tools -->

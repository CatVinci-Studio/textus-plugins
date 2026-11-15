# Quarto documents

Opens Quarto's `.qmd` files in Textus's own editor instead of as read-only
text. What Quarto adds to Markdown stays exactly as written when you save:

- `::: {.callout-note}` divs and the lines after them,
- `{{< include intro.qmd >}}` shortcodes,
- `{#fig-map}` and `{.class}` attributes.

They show as source; the rest of the document is edited as usual.

## How

`contributes.documentTypes` in `textus-plugin.json`:

```json
{ "extensions": ["qmd"], "keep": { "blockStarts": [":::", "{{<"], "braces": true } }
```

`keep` is data, not code: paragraphs starting with one of `blockStarts`
are kept whole, `braces` keeps every `{…}`, and `jsx` (not used here) keeps
JSX tags. Turn the plugin off and `.qmd` files open read-only again, so
nothing is ever saved without these rules.

The code adds one tool for Textus AI, `quarto_project`, which reads the
project's `_quarto.yml`.

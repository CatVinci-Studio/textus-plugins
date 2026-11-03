# Marp

Present a document as slides, written the [Marp](https://marp.app) way.

- A new slide starts at each `---`.
- **Plugins › Present as Slides** shows the deck in a tab beside the document, following your writing. ← → and Space move between slides, **Full Screen** (or F) presents.
- **Plugins › Export Slides as HTML** (or **Save HTML** in the deck) saves `name.slides.html` beside the document: one file that presents itself in any browser.
- Marp's directives choose the theme and layout, for example at the top:

```markdown
---
theme: gaia
paginate: true
---
```

Built on [Marp Core](https://github.com/marp-team/marp-core) (MIT), which brings its themes (default, gaia, uncover), math and code highlighting - and makes this plugin about 4 MB.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `export_slides`: Saves the document in front as a Marp slide deck - slides apart at each --- line - in one HTML file beside it (name.slides.html) that presents itself in any browser. Returns its path and how many slides it has.
<!-- /ai-tools -->

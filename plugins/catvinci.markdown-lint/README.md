# Markdown Lint

Underlines Markdown that breaks common style rules, and fixes what it can in one go.

- Words that break a rule are underlined; rest the pointer on one to see which rule and why.
- **Fix Markdown** (right-click, or the Plugins menu) fixes what can be fixed, as one undo step.
- #tags, reference definitions ([d]: url), links to headings and %% comments are not flagged or changed.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `lint_markdown`: Checks Markdown - given, or the document in front - with markdownlint's rules, as the editor underlines them: each issue's line, rule, description and whether it can be fixed; with fix, also the fixed text. Changes nothing itself.
<!-- /ai-tools -->

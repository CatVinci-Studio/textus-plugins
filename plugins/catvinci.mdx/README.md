# MDX

For MDX documents - the Markdown with components that Docusaurus, Nextra
and other site tools use. Textus opens `.mdx` files by itself and keeps
their imports, `{expressions}` and components exactly as written; this
plugin adds:

- **Problems underlined.** MDX's own compiler checks the document as you
  write, and the first problem it finds is underlined where it is, with
  its line and what is wrong.
- **Preview MDX.** The document drawn beside it: tabs, callouts
  (`<Callout>`, `<Admonition>`, `:::tip`) and `<details>` in Textus's look,
  any other component as a card with its name and attributes. Nothing of
  the document's code runs.
- **Save as Markdown / Save as MDX.** A copy beside the document: callouts
  become GitHub alerts, tabs headed parts, and a component with nothing
  inside stays as a comment; the other way, braces and `<` are escaped and
  comments and `<br>` written as MDX wants them.

Find these in the Plugins menu, or right-click in an `.mdx` document.

## Permissions

- **Read the document**: to check and draw it as you write.
- **Read and write files**: to check an .mdx file Textus AI names, and to save the converted copy beside the document.
- **Tools for Textus AI**: so Textus AI can check MDX it writes.

It runs on the desktop and on iOS.

## Changes

- **0.1.0** - First version: problems underlined by MDX's compiler, Preview MDX, Save as Markdown and Save as MDX, and check_mdx for Textus AI.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `check_mdx`: Checks MDX with MDX's own compiler and gives the first problem with its line and column. Use it after writing or changing an .mdx document, before saying it works.
<!-- /ai-tools -->

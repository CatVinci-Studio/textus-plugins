# Tags

Lists every `#tag` in the open folder in the sidebar, with how many notes use it.

- The **Tags** tab lists the tags, the most used first. Nested tags (`#project/alpha`) form a tree, as in Obsidian, and a tag's count includes the notes of the tags under it. Type in the filter field to narrow the list.
- Open a tag to see its notes, and click one to open it.
- Right-click a tag and choose **Rename…** to rename it in every note, with the tags nested in it (`#project/alpha` becomes `#new/alpha`). Tags match in any letter case. Rename it to a tag you already have, and the two become one. A tag is letters, digits, `_`, `-` and `/`, and not only digits.
- Tags in front matter (`tags: [a, b]`, or a list under `tags:`) are renamed too. Code, inline code, link addresses and longer tags that start the same (`#drafts` when you rename `#draft`) are left alone.

## Permissions

- Read files: to find the tags in the folder.
- Write files: to rename a tag in the notes that have it.
- Tools for Textus AI: so Textus AI can list your tags and the notes with a tag.

## Changes

- **0.3.4** - Renaming leaves `[[#Heading]]` links alone, and a ``` line inside a `~~~` block no longer ends the code.
- **0.3.3** - Tags match in any letter case, as their counts do; renaming a tag moves its nested tags too and no longer touches link addresses or front-matter tags like `project-x`; tags like `a/` or `a//b` are refused.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - Tags used equally often are listed in natural name order ("Week2" before "Week10").
- **0.3.0** - Nested tags form a tree, each counting the notes of the tags under it; Textus AI finds a tag's nested tags too.
- **0.2.0** - Textus AI can list your tags and the notes with a tag (`list_tags`, `notes_with_tag`).
- **0.1.0-0.1.1** - First versions: tags with their counts, a tag's notes, renaming and merging in every note; runs on desktop and iOS.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `list_tags`: Lists every #tag in the open folder's documents with how many documents use it, the most used first.
- `notes_with_tag`: Lists the documents in the open folder that have a #tag, each with its title, path and tags.
<!-- /ai-tools -->

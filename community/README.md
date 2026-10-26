# Plugins from other repositories

One file per plugin, named after its id: `jane.word-count.json`.

```json
{
  "id": "jane.word-count",
  "repo": "jane/textus-word-count",
  "version": "0.2.0"
}
```

- `repo` is the GitHub repository the plugin lives in. Its release for the
  tag `v<version>` must have `<id>-<version>.zip` - the release workflow
  Textus's **Export for Publishing** puts in the repository makes it.
- `version` is the version to list. A new version is a pull request that
  changes this line.
- `libs` (optional) names bundled library files and where they come from,
  `{ "lib/chart.min.js": "chart.js 4.4.1 (npm)" }`, so the review doesn't
  ask about their minified code.
- `sha256` is added by a maintainer before merging, from the review's
  comment: it pins the zip that was reviewed.

See [LISTING.md](../LISTING.md) for what gets listed and what the review
checks.

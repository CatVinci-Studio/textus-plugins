# Contributing to Textus Plugins

Thanks for helping. New features for Textus usually belong here rather than
in the app: if it can be a plugin, make it one. Write to us in English or
Chinese.

## Four ways in

| You want to | Do this | Checked by | Merged |
| --- | --- | --- | --- |
| Fix or improve an official plugin | A pull request to `plugins/<id>/`: raise its `version`, add a line to its README's changes | `test.yml`: `npm run check`, the version check, the build | after a maintainer's review; `release.yml` publishes it |
| List your own plugin | **Export for Publishing…** in Textus, tag a release in your repository, then a pull request adding `community/<id>.json` ([LISTING.md](LISTING.md)) | `review.yml`: the package, its source byte for byte, permissions, the code | first listing: after a maintainer tries it in Textus. Later versions: just push a tag; `updates.yml` lists ones that add no permission on its own |
| Add a skill | A pull request adding `skills/<name>.md` ([LISTING.md](LISTING.md#skills)) | `npm run check` | after a maintainer tries it, usually within a week |
| Share a theme | One comment on the gallery issue in [textus-themes](https://github.com/CatVinci-Studio/textus-themes#share-a-theme) | the theme rules | by the themes repository's flow |

Which plugins become official: about writing, used by most people, and
something we're willing to maintain for years. Everything else is just as
welcome as a community plugin.

## Before you push

```sh
npm ci
npm run check
```

Start a new plugin from [`template/`](template/), and read the
[plugin guide](https://github.com/CatVinci-Studio/Textus/blob/main/docs/dev/plugins/guide.md).
Try it in Textus with **Settings › Extensions › Plugins › Load a plugin
folder…**, and show what it looks like in the pull request.

## Claiming an issue

Issues labelled
[good first issue](https://github.com/CatVinci-Studio/textus-plugins/issues?q=is%3Aopen+label%3A%22good+first+issue%22+no%3Aassignee),
[help wanted](https://github.com/CatVinci-Studio/textus-plugins/issues?q=is%3Aopen+label%3A%22help+wanted%22+no%3Aassignee)
or [plugin idea](https://github.com/CatVinci-Studio/textus-plugins/issues?q=is%3Aopen+label%3A%22plugin+idea%22+no%3Aassignee)
are open to anyone. Comment `/take` to claim one (one at a time), open a
draft pull request within 7 days, and after 14 quiet days it is released.
`/untake` lets it go. Small fixes need no claim.

We reply to pull requests within 3 days; nudge us if we haven't. Ask on
[Discord](https://textus.md/discord) or in the QQ and WeChat groups.

# Listing in the Textus market

**Settings › Extensions › Get more** in Textus lists three kinds of things, each from its own repository: plugins and skills from this one, themes from [textus-themes](https://github.com/CatVinci-Studio/textus-themes). This page says what gets listed and how.

[中文说明](#中文说明)

## What every listing must be

- **Useful to people who write.** Something a writer, a student, a researcher or a team would reach for - not a demo, not a duplicate of something already listed or built in.
- **Honest about what it does.** Its name and description say plainly what it does; it does nothing else.
- **Open.** An OSI-approved license (MIT unless you name another), and only what you have the right to share - fonts and libraries included.
- **Quiet.** Nothing in the background the user didn't ask for: no tracking, no analytics, no ads, no updates or downloads of its own.
- **Kind.** Nothing offensive, nothing that copies someone else's work without credit.

## Plugins

A plugin is a folder in [`plugins/`](plugins/) with a `textus-plugin.json` manifest ([Writing plugins](https://github.com/CatVinci-Studio/Textus/blob/main/docs/dev/writing-plugins.md)).

- **Permissions it needs, and no more.** Each permission in the manifest is asked for before the plugin runs; one that the plugin's purpose doesn't explain is a reason not to list it. `network:` names the hosts it talks to - `network:*` only for a plugin whose purpose is the open web (a web view).
- **Works offline,** apart from what plainly needs the network (Zotero's local API, a web page), and says so when it can't reach something.
- **English and Chinese.** Its `l10n` has at least `en` and `zh`; Textus falls back to English for the other languages.
- **Tested.** Its flows run in Textus's e2e tests or yours, and `npm run check` passes.
- **Versioned.** A change ships as a new `version`; a published version never changes.

## Skills

A skill is one Markdown file in [`skills/`](skills/), named after the skill (`press-release.md`), with front matter like the built-in skills' ([AGENTS.md › Skills](https://github.com/CatVinci-Studio/Textus/blob/main/AGENTS.md)): `name` (the file's name), `description` (what it does and when to use it - Textus AI reads it to decide), and `metadata` with `textus-version`, `textus-invocation`, `textus-category` and `textus-modes` - the panel modes it works in, one or more of `write`, `review` and `create` - and, for each UI language, `textus-label-<code>` and `textus-hint-<code>` (its name and one line on what it does) and `textus-aliases-<code>` (other words typed after `/`).

- **A procedure, not a one-off.** A kind of task people do again and again, with the steps that make it come out right.
- **Never invents.** A skill that writes from the user's material says what to do when the material is missing a detail (leave a placeholder, ask) - never to make it up.
- **No built-in twin.** Not a second translate, proofread or summarize - improve the built-in one instead (a pull request to Textus).

## Themes

Themes are shared in [textus-themes](https://github.com/CatVinci-Studio/textus-themes#share-a-theme) - one comment on its gallery issue, no pull request. Its rules (one self-contained stylesheet, no remote resources, no script hooks) apply as they stand.

## How to list yours

1. Open a pull request here that adds your plugin's folder or your skill's file - with a line in the README's table for a plugin.
2. CI checks it (`npm run check`); a maintainer reviews it, usually within a week, trying it in Textus.
3. Once merged, the release workflow publishes it, and it is in **Get more** for everyone. Only what CatVinci Studio makes is marked **Official**.

A listing that stops meeting these rules - broken by a Textus update and not fixed, or found doing more than it says - is taken down, and its author told why.

---

## 中文说明

Textus 的 **设置 › 扩展 › 获取更多** 里有三类东西：插件和技能来自本仓库，主题来自 [textus-themes](https://github.com/CatVinci-Studio/textus-themes)。这里说明什么能上架、怎么上架。

### 所有上架内容都要

- **对写作的人有用**：写作者、学生、研究者或团队会用到的东西；不是演示，也不和已上架或内置的重复。
- **说清楚做什么**：名称和简介直白地说明用途，不做别的事。
- **开放**：OSI 认可的许可证（不写就是 MIT），只分享你有权分享的内容，包括字体和库。
- **安静**：不在后台做用户没要求的事——不跟踪、不统计、不放广告，也不自己更新或下载东西。
- **友善**：不冒犯人，不未经注明地照搬别人的作品。

### 插件

插件是 [`plugins/`](plugins/) 下的一个文件夹，带 `textus-plugin.json` 清单（见 [Writing plugins](https://github.com/CatVinci-Studio/Textus/blob/main/docs/dev/writing-plugins.md)）。

- **只要需要的权限**：清单里的每个权限都会在运行前问用户；用途解释不了的权限就是不上架的理由。`network:` 写明要访问的主机，只有以开放网页为用途的插件（网页视图）才能用 `network:*`。
- **能离线用**：除了明显要联网的功能（Zotero 本地接口、网页），连不上时要告诉用户。
- **中英文**：`l10n` 至少有 `en` 和 `zh`，其他语言 Textus 会用英文。
- **有测试**：流程在 Textus 的 e2e 测试或你自己的测试里跑过，`npm run check` 通过。
- **有版本**：改动发新的 `version`，已发布的版本不再改。

### 技能

技能是 [`skills/`](skills/) 下的一个 Markdown 文件，以技能名命名（`press-release.md`），前置信息和内置技能一样：`name`（与文件名相同）、`description`（做什么、什么时候用——Textus AI 据此决定何时使用），`metadata` 里有 `textus-version`、`textus-invocation`、`textus-category` 和 `textus-modes`（适用的模式：`write`、`review`、`create` 中的一个或几个），以及每种界面语言的 `textus-label-<code>`、`textus-hint-<code>`（名字和一句说明）和 `textus-aliases-<code>`（`/` 后还能输入的别名）。

- **是一套做法，不是一次性要求**：大家反复会做的一类事，以及把它做好的步骤。
- **不编造**：根据用户材料写东西的技能，要说明材料缺细节时怎么办（留占位、去问），绝不让 AI 编。
- **不和内置技能重复**：不要再做一个翻译、校对或摘要——想改进就给 Textus 提 PR 改内置的。

### 主题

主题在 [textus-themes](https://github.com/CatVinci-Studio/textus-themes#中文说明) 分享：在画廊 issue 下发一条评论即可，不用 PR。那里的规则（一个独立样式表、不加载远程资源、不用脚本钩子）照常适用。

### 怎么上架

1. 在本仓库开一个 PR，加入你的插件文件夹或技能文件；插件还要在 README 的表格里加一行。
2. CI 会检查（`npm run check`），维护者会在 Textus 里试用并审核，通常一周内。
3. 合并后发布流程会自动发布，所有人都能在 **获取更多** 里看到。只有 CatVinci Studio 自己做的才会标 **官方**。

不再符合这些规则的内容——Textus 更新后坏了没修，或被发现做了说明以外的事——会被下架，并告诉作者原因。

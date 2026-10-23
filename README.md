# Textus Plugins

The plugins for [Textus](https://textus.catvinci.com), the Markdown editor. None of them comes with Textus: you install the ones you want from **Settings › Plugins › Get plugins**, and Textus downloads them from this repository.

[中文说明](#中文说明)

## The plugins

| Plugin | What it does |
| --- | --- |
| Calendar & Daily Notes | A calendar in the sidebar and a note for each day, kept in a folder of the open folder. |
| Graph View | Your notes and the links between them as a graph - [[wiki links]] and links to other documents - for the whole folder, or around the document in front. |
| Image Viewer | Open pictures and SVG files in a tab: zoom, fit, and an SVG's source. |
| Kanban | Boards of cards in lists, kept as a Markdown file (name.kanban.md) - a list per heading, a card per task. |
| PDF Viewer | Open PDFs in a tab beside your notes: pages, zoom, and text to select and copy. |
| Quick Preview | Rest the pointer on a link to another document - a Markdown link or a [[wikilink]] - to read its opening, or the section it names, in a card beside it. |
| Quick Notes | Jot something down without leaving the document: notes in the sidebar, to insert later or open as a document. |
| Split Panes | Two documents at once: side by side, or one above the other. Drag the line between them to share the space; a click in one brings it to the front. |
| Tasks | Every task (- [ ]) in the open folder's documents, in one list: tick one off there, or go to it. |
| Version History | Each save of a document kept as a version: see what changed since, and bring an old one back. |
| Web View | Open web pages in a tab beside your notes. |
| Word Reader | Read Word documents as they look in Word, in a tab. Edit as Markdown turns one into a document of yours. |
| Zotero | Cite from your Zotero library while you write, and rest the pointer on a citation to see what it cites. Needs Zotero 7 running, with Settings › Advanced › Allow other applications on this computer to communicate with Zotero on. |

Quick Notes can also start a note from the tray or menu bar with every window closed, once **Keep running in the background** is on - it offers to turn it on.

Each one asks for the permissions it needs before it runs, and you can take any of them back in its page in Settings › Plugins.

## How Textus gets them

Each plugin's folder in [`plugins/`](plugins/) is packaged by `npm run build` into a zip, with the libraries [`libs.json`](libs.json) lists. The [release workflow](.github/workflows/release.yml) publishes each new version as a release of its own (`catvinci.graph-v1.0.0`) and the catalog, `index.json`, on the `catalog` release, with the skill files in [`skills/`](skills/) beside it. Textus reads that catalog, and checks each package against the SHA-256 it lists before it installs it.

## Writing a plugin

A plugin is a folder with a `textus-plugin.json` and its code, run in a sandbox. The guide is [Writing plugins](https://github.com/CatVinci-Studio/Textus/blob/main/docs/dev/writing-plugins.md) in the Textus repository; the plugins here are complete examples. To try yours, use **Settings › Plugins › Load a plugin folder…**; to give it to someone, zip the folder and they install it with **Install from file…**.

To list yours in the market beside the official ones - a plugin, or a skill in [`skills/`](skills/) - see [Listing in the Textus market](LISTING.md).

## Developing these plugins

```sh
npm ci
npm run check   # reads every manifest, runs the tests
npm run build   # dist/: the zips and index.json
```

The Textus app's tests and its development server use a checkout of this repository placed beside the app (`textus-plugins/`), or the one `TEXTUS_PLUGINS_DIR` names.

## License

MIT - see [LICENSE](LICENSE). The libraries copied into the packages keep their own licenses: PDF.js (Apache-2.0), JSZip (MIT) and docx-preview (Apache-2.0).

---

## 中文说明

[Textus](https://textus.catvinci.com) 的插件。Textus 不内置任何插件：在**设置 › 插件 › 获取插件**里选择想要的，Textus 才从这个仓库下载安装。

每个插件运行前都会先请求它需要的权限，之后可以在设置 › 插件里它自己的页面里收回。

写插件请看 Textus 仓库里的 [Writing plugins](https://github.com/CatVinci-Studio/Textus/blob/main/docs/dev/writing-plugins.md)，这里的插件都是完整的例子。自己的插件可以用**设置 › 插件 › 载入插件文件夹…**试用，打成 zip 后别人用**从文件安装…**安装。想把你的插件或技能上架到市场，请看 [上架说明](LISTING.md#中文说明)。

// Zotero: a citation from the user's Zotero library, inserted where the
// caret is. The library is searched through the local API of Zotero 7 and
// later on this computer (http://localhost:23119/api/), which Zotero serves
// once "Allow other applications on this computer to communicate with
// Zotero" is on - nothing leaves the computer.
/* global folderConventions, folderPaths, fillTemplate */
/** What activate was given: the plugin's storage and own files. */
let ctx;

const API = "http://localhost:23119/api/users/0/items/top";

const t = textus.l10n.t;

function authors(item) {
  const people = (item.data.creators || []).filter(
    (c) => c.creatorType === "author" || !c.creatorType,
  );
  const name = (c) => c.lastName || c.name || "";
  if (!people.length) return "";
  if (people.length === 1) return name(people[0]);
  if (people.length === 2) return t("two", name(people[0]), name(people[1]));
  return name(people[0]) + " et al.";
}

function year(item) {
  const match = /\d{4}/.exec(
    item.data.date || (item.meta && item.meta.parsedDate) || "",
  );
  return match ? match[0] : "n.d.";
}

/** The citation as Settings › Zotero says to write it. */
function citation(item, style) {
  const who = authors(item) || item.data.title || item.key;
  if (style === "link")
    return (
      "[" +
      who +
      " (" +
      year(item) +
      ")](zotero://select/library/items/" +
      item.key +
      ")"
    );
  if (style === "text") return "(" + who + ", " + year(item) + ")";
  const key = citationKey(item);
  if (!key) return "(" + who + ", " + year(item) + ")";
  return style === "wiki" ? "[[@" + key + "]]" : "[@" + key + "]";
}

async function search(query, mode) {
  const url =
    API +
    "?q=" +
    encodeURIComponent(query) +
    "&qmode=" +
    (mode || "titleCreatorYear") +
    "&limit=30&format=json";
  return get(url);
}

async function get(url) {
  let response;
  try {
    response = await textus.net.fetch(url, {
      // Zotero 10 drops a request that might be a web page's unless it
      // says it is allowed.
      headers: { "Zotero-API-Version": "3", "Zotero-Allowed-Request": "1" },
    });
  } catch (cause) {
    throw new Error(t("unreachable"), { cause: cause });
  }
  if (!response.ok) throw new Error("Zotero: " + response.status);
  return response.json();
}

/** An item's citation key: Better BibTeX's field, or "Citation Key:" in
 *  its Extra. */
function citationKey(item) {
  return (
    item.data.citationKey ||
    (/Citation Key:\s*(\S+)/.exec(item.data.extra || "") || [])[1] ||
    null
  );
}

/** The item a citation or a zotero:// link names, or null. */
async function itemFor(target) {
  if (target.type === "citation") {
    const items = await search(target.key, "everything");
    return items.find((item) => citationKey(item) === target.key) || null;
  }
  const key =
    target.type === "link" &&
    (/^zotero:\/\/select\/library\/items\/([A-Z0-9]+)/i.exec(target.url) ||
      [])[1];
  if (!key) return null;
  return get(API.replace(/\/top$/, "/") + key + "?format=json");
}

/** An item as its card shows it: who and when, where it appeared, and
 *  the opening of its abstract. */
function card(item) {
  const d = item.data;
  const where = d.publicationTitle || d.bookTitle || d.publisher || "";
  const lines = [
    [authors(item), year(item)].filter(Boolean).join(" · "),
    where ? "*" + where.replace(/\*/g, "") + "*" : "",
  ].filter(Boolean);
  let abstract = (d.abstractNote || "").trim();
  if (abstract.length > 600) abstract = abstract.slice(0, 600) + "…";
  return {
    title: d.title || item.key,
    markdown: lines.join("  \n") + (abstract ? "\n\n" + abstract : ""),
  };
}

/** The items cited lately, newest first: {key, title, byline}. */
const RECENT = "recent";

async function insert(item, style) {
  // Picked by the user: the citation goes in at the caret, one undo away.
  await textus.editor.insertText(citation(item, style));
  const recent = (await ctx.storage.global.get(RECENT)) || [];
  const entry = {
    key: item.key,
    title: item.data.title || item.key,
    byline: [authors(item), year(item)].filter(Boolean).join(" · "),
  };
  await ctx.storage.global.set(
    RECENT,
    [entry, ...recent.filter((r) => r.key !== item.key)].slice(0, 10),
  );
}

async function itemByKey(key) {
  return get(API.replace(/\/top$/, "/") + key + "?format=json");
}

/** The citations and zotero:// links in `text`, each once; not in code,
 *  where @media and @param are no one's. */
function citedIn(text) {
  const out = [];
  const seen = new Set();
  text = text
    .replace(/^ {0,3}(`{3,}|~{3,})[^]*?^ {0,3}\1[^\n]*$/gm, "")
    .replace(/`[^`\n]*`/g, "");
  // Pandoc's [@key], [see @key, p. 3; @other] and bare @key - not an
  // e-mail address's @.
  for (const m of text.matchAll(/(?:^|[\s[;-])@([\w:.#$%&\-+?<>~/]+)/g)) {
    const key = m[1].replace(/[.,;:]+$/, "");
    if (!seen.has("c" + key)) {
      seen.add("c" + key);
      out.push({ type: "citation", key: key });
    }
  }
  for (const m of text.matchAll(/zotero:\/\/select\/library\/items\/[A-Z0-9]+/gi)) {
    if (!seen.has(m[0])) {
      seen.add(m[0]);
      out.push({ type: "link", url: m[0] });
    }
  }
  return out;
}

/** One entry of the references list: who (year). *Title*. Where. */
function reference(item) {
  const d = item.data;
  const people = (d.creators || [])
    .filter((c) => c.creatorType === "author" || !c.creatorType)
    .map((c) => [c.lastName, c.firstName].filter(Boolean).join(", ") || c.name)
    .filter(Boolean);
  const who = people.length > 3 ? people[0] + " et al." : people.join("; ");
  const where = d.publicationTitle || d.bookTitle || d.publisher || "";
  return (
    "- " +
    [who && who + " (" + year(item) + ")", "*" + (d.title || item.key) + "*", where]
      .filter(Boolean)
      .join(". ") +
    "."
  );
}

/** A Zotero note's HTML as plain Markdown. */
function noteMarkdown(html) {
  const entities = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", nbsp: " " };
  return String(html || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|blockquote|ul|ol)>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (all, name) => entities[name])
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** An item's notes and its attachments' annotations; none when Zotero
 *  doesn't give them. */
async function childrenOf(item) {
  const children = (key) =>
    get(API.replace(/\/top$/, "/") + key + "/children?format=json").catch(() => []);
  const kids = await children(item.key);
  const files = kids.filter((k) => k.data.itemType === "attachment");
  const marks = (await Promise.all(files.map((f) => children(f.key)))).flat();
  return kids.concat(marks);
}

/** What a literature note's template is filled with, under the names
 *  Obsidian's Citations plugin uses too. */
function noteValues(item, children) {
  const d = item.data;
  const people = (d.creators || [])
    .filter((c) => c.creatorType === "author" || !c.creatorType)
    .map((c) => [c.firstName, c.lastName].filter(Boolean).join(" ") || c.name)
    .filter(Boolean);
  const key = citationKey(item) || item.key;
  const highlights = children
    .filter((c) => c.data.itemType === "annotation")
    .map((c) => {
      const a = c.data;
      const page = a.annotationPageLabel ? " (p. " + a.annotationPageLabel + ")" : "";
      const text = (a.annotationText || "").trim();
      const comment = (a.annotationComment || "").trim();
      if (!text) return comment ? "- " + comment + page : "";
      return "- " + text + page + (comment ? "\n  - " + comment : "");
    })
    .filter(Boolean);
  const notes = children
    .filter((c) => c.data.itemType === "note")
    .map((c) => noteMarkdown(c.data.note))
    .filter(Boolean);
  const where = d.publicationTitle || d.bookTitle || "";
  return {
    citekey: key,
    title: d.title || key,
    authors: people,
    authorString: people.join(", "),
    byline: [people.join(", "), year(item) === "n.d." ? "" : year(item)].filter(Boolean).join(" · "),
    year: year(item) === "n.d." ? "" : year(item),
    published: d.date || "",
    abstract: (d.abstractNote || "").trim(),
    publication: where,
    containerTitle: where,
    publisher: d.publisher || "",
    itemType: d.itemType || "",
    DOI: d.DOI || "",
    doi: d.DOI || "",
    URL: d.url || "",
    url: d.url || "",
    zoteroSelectURI: "zotero://select/library/items/" + item.key,
    highlights: highlights.join("\n"),
    notes: notes.join("\n\n"),
  };
}

/** The note made when no template is set: front matter, then the
 *  abstract, the highlights and the notes under their headings. */
function defaultTemplate() {
  return [
    "---",
    "title: {{title}}",
    "authors: {{authors}}",
    "year: {{year}}",
    "citekey: {{citekey}}",
    "doi: {{DOI}}",
    "url: {{URL}}",
    "zotero: {{zoteroSelectURI}}",
    "---",
    "",
    "# {{title}}",
    "",
    "{{byline}}",
    "",
    "## " + t("abstract"),
    "",
    "{{abstract}}",
    "",
    "## " + t("highlights"),
    "",
    "{{highlights}}",
    "",
    "## " + t("notes"),
    "",
    "{{notes}}",
    "",
  ].join("\n");
}

/** A front matter value: a list as a flow list, text quoted. */
function yamlValue(value) {
  if (Array.isArray(value)) return value.length ? JSON.stringify(value) : "";
  const s = String(value === null || value === undefined ? "" : value);
  return s === "" || /^\d+$/.test(s) ? s : JSON.stringify(s);
}

/** A literature note: `template` filled with `values`, a front matter
 *  line that is one {{key}} written as YAML. The default template drops
 *  what the item has none of. */
function noteText(template, values, language) {
  const fill = (text) => fillTemplate(text, values, { language: language });
  const front = /^---\r?\n[^]*?\r?\n---\r?\n/.exec(template);
  let head = front
    ? fill(
        front[0].replace(
          /^([ \t]*[\w-]+:[ \t]*)\{\{\s*([\w.-]+)\s*\}\}[ \t]*$/gm,
          (all, lead, key) => (key in values ? lead + yamlValue(values[key]) : all),
        ),
      )
    : "";
  let body = fill(template.slice(front ? front[0].length : 0));
  if (template !== defaultTemplate()) return head + body;
  head = head.replace(/^[\w-]+:[ \t]*\n/gm, "");
  body = body
    .replace(/\n## [^\n]+\s*(?=\n## |$)/g, "")
    .replace(/\n{3,}/g, "\n\n");
  return head + body.replace(/\s*$/, "\n");
}

/** Where literature notes go and what they are made from: the vault's
 *  Zotero Integration or Citations settings when it has them, else the
 *  plugin's. The template is a file in the folder, or its text. */
async function noteSettings(root) {
  const own = {
    folder: String((await textus.settings.get("notesFolder")) ?? "References"),
    file: String((await textus.settings.get("noteTemplate")) || ""),
  };
  // Read only; a Textus without files.conventions reads none.
  const vault = (file) =>
    folderConventions.obsidianSettings(root, "plugins/" + file + "/data.json").catch(() => ({}));
  const integration = await vault("obsidian-zotero-desktop-connector");
  const format = (integration.exportFormats || [])[0] || {};
  const citations = await vault("obsidian-citation-plugin");
  const output = String(format.outputPathTemplate || "");
  const vaultFolder = output.includes("/")
    ? output.replace(/\/[^/]*$/, "")
    : citations.literatureNoteFolder;
  const folder = typeof vaultFolder === "string" && !vaultFolder.includes("{") ? vaultFolder : own.folder;
  return {
    folder: folder.replace(/\\/g, "/").replace(/^[./]+|\/+$/g, ""),
    file: own.file || format.templatePath || "",
    text: citations.literatureNoteContentTemplate || "",
  };
}

/** The template a note is made from; the default when the one set can't
 *  be read, or is written for a template language this doesn't run. */
async function templateFor(root, where) {
  let text = where.text;
  if (where.file) {
    const rel = where.file.replace(/^[./]+/, "").replace(/(\.md)?$/i, ".md");
    text = await textus.files.readText(folderPaths.abs(root, rel)).catch(() => "");
  }
  return text && !/\{%|\{\{[#/]/.test(text) ? text : defaultTemplate();
}

/** Where the literature note of `item` is: @citekey.md, as [[@citekey]]
 *  links, in the notes' folder. */
function notePath(root, where, item) {
  const name = "@" + (citationKey(item) || item.key).replace(/[\\/:*?"<>|]/g, "-") + ".md";
  return folderPaths.abs(root, (where.folder ? where.folder + "/" : "") + name);
}

/** The literature note of `item`, @citekey.md: opened when there is one,
 *  else made from the template first. */
async function openNote(root, item) {
  const where = await noteSettings(root);
  const path = notePath(root, where, item);
  if (!(await textus.files.stat(path).catch(() => null))) {
    const values = noteValues(item, await childrenOf(item).catch(() => []));
    const text = noteText(await templateFor(root, where), values, textus.env.language);
    if (where.folder) await textus.files.createFolder(folderPaths.abs(root, where.folder)).catch(() => {});
    await textus.files.create(path, text);
  }
  await textus.layout.open(path);
}

/** Textus AI's tool: the library's items for `query`, each with the
 *  citation the user's style writes for it. */
async function searchLibrary(input) {
  const query = String(input.query || "").trim();
  if (!query) return { error: "Say what to look for." };
  const style = await textus.settings.get("style");
  let items;
  try {
    items = await search(query, "everything");
  } catch (err) {
    return { error: err.message };
  }
  const limit = Math.min(30, Math.max(1, Number(input.limit) || 10));
  return {
    items: items.slice(0, limit).map((item) => ({
      key: item.key,
      title: item.data.title || "",
      authors: authors(item),
      year: year(item),
      type: item.data.itemType,
      publication: item.data.publicationTitle || item.data.bookTitle || item.data.publisher || "",
      citation_key: citationKey(item),
      citation: citation(item, style),
    })),
  };
}

/** The item the user picks: from the selection's words, else a recent
 *  item or a search; null when they pick none. */
async function chooseItem() {
  const selection = await textus.editor.getSelection();
  let query = selection && selection.text && selection.text.trim();
  if (!query) {
    const recent = (await ctx.storage.global.get(RECENT)) || [];
    if (recent.length) {
      const picked = await textus.ui.pick(
        [
          { label: t("searchMore"), value: "" },
          ...recent.map((r) => ({
            label: r.title,
            description: r.byline,
            value: r.key,
          })),
        ],
        { placeholder: t("choose") },
      );
      if (picked === null || picked === undefined) return null;
      if (picked) {
        const item = await itemByKey(picked).catch(() => null);
        if (item) return item;
      }
    }
    query = await textus.ui.input({ prompt: t("search"), value: "" });
    if (!query || !query.trim()) return null;
  }
  let items;
  try {
    items = await search(query.trim());
  } catch (err) {
    await textus.ui.message(err.message, { tone: "warning" });
    return null;
  }
  if (!items.length) {
    await textus.ui.message(t("nothing"));
    return null;
  }
  const picked = await textus.ui.pick(
    items.map((item) => ({
      label: item.data.title || item.key,
      description: [authors(item), year(item)].filter(Boolean).join(" · "),
      value: item.key,
    })),
    { placeholder: t("choose") },
  );
  return items.find((i) => i.key === picked) || null;
}

exports.activate = function (context) {
  ctx = context;
  textus.ai.registerTool("search_library", searchLibrary);
  // Resting on a citation shows what it cites (Textus 1.3 and later).
  textus.editor.registerHover({
      provideHover: async function (target) {
        if (target.type !== "citation" && target.type !== "link") return null;
        try {
          const item = await itemFor(target);
          return item ? card(item) : null;
        } catch {
          // Zotero isn't running: no card, and no message on every hover.
          return null;
        }
      },
    });

  textus.commands.register("catvinci.zotero.cite", async function () {
    const style = await textus.settings.get("style");
    const item = await chooseItem();
    if (!item) return;
    await insert(item, style);
    // A [[@key]] link leads nowhere until its note is there: offer it.
    const key = citationKey(item);
    const root = await textus.files.root().catch(() => null);
    if (style !== "wiki" || !key || !root) return;
    const where = await noteSettings(root);
    const path = notePath(root, where, item);
    if (await textus.files.stat(path).catch(() => null)) return;
    if (await textus.ui.confirm(t("offerNote", "@" + key), { okLabel: t("makeNote") }))
      await openNote(root, item);
  });

  textus.commands.register("catvinci.zotero.note", async function () {
    const root = await textus.files.root();
    if (!root) {
      await textus.ui.message(t("needsFolder"));
      return;
    }
    const item = await chooseItem();
    if (item) await openNote(root, item);
  });

  textus.commands.register(
    "catvinci.zotero.bibliography",
    async function () {
      const text = (await textus.editor.getText()) || "";
      const found = citedIn(text);
      if (!found.length) {
        await textus.ui.message(t("noCitations"));
        return;
      }
      let items;
      try {
        items = (await Promise.all(found.map((f) => itemFor(f).catch(() => null))))
          .filter(Boolean);
      } catch (err) {
        await textus.ui.message(err.message, { tone: "warning" });
        return;
      }
      if (!items.length) {
        await textus.ui.message(t("unreachable"), { tone: "warning" });
        return;
      }
      // One entry per item, by its first author, then its year.
      const seen = new Set();
      const entries = items
        .filter((item) => !seen.has(item.key) && seen.add(item.key))
        .sort((a, b) =>
          nameOrder.compareNames(authors(a) + year(a), authors(b) + year(b)),
        )
        .map(reference);
      const list = "## " + t("references") + "\n\n" + entries.join("\n");
      // Run again, the list there is replaced, not added a second time.
      const blocks = (await textus.editor.getBlocks()) || [];
      const at = blocks.findIndex(
        (b) => b.kind === "heading" && b.markdown.trim() === "## " + t("references"),
      );
      if (at < 0) {
        await textus.editor.edit({ action: "append", text: list });
        return;
      }
      let end = at + 1;
      while (end < blocks.length && !/^#{1,2}\s/.test(blocks[end].markdown)) end++;
      await textus.editor.edit({
        action: "replace",
        block: blocks[at].id,
        lastBlock: blocks[end - 1].id,
        text: list,
      });
    },
  );
};

exports.citedIn = citedIn;

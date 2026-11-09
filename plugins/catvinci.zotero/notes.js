// Literature notes: an item's note, @citekey.md, made from a template (the
// vault's, as Zotero Integration or Citations set it, else ours) with the
// item's details, its notes and its annotations. Loaded before host.js.

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
async function noteText(template, values, language) {
  const fill = async (text) => (await textus.templates.fill(text, { values: values, language: language })).text;
  const front = /^---\r?\n[^]*?\r?\n---\r?\n/.exec(template);
  let head = front
    ? await fill(
        front[0].replace(
          /^([ \t]*[\w-]+:[ \t]*)\{\{\s*([\w.-]+)\s*\}\}[ \t]*$/gm,
          (all, lead, key) => (key in values ? lead + yamlValue(values[key]) : all),
        ),
      )
    : "";
  let body = await fill(template.slice(front ? front[0].length : 0));
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
    const text = await noteText(await templateFor(root, where), values, textus.env.language);
    if (where.folder) await textus.files.createFolder(folderPaths.abs(root, where.folder)).catch(() => {});
    await textus.files.create(path, text);
  }
  await textus.layout.open(path);
}

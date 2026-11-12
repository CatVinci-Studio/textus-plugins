// Zotero: a citation from the user's Zotero library, inserted where the
// caret is. The library is searched through the local API of Zotero 7 and
// later on this computer (http://localhost:23119/api/), which Zotero serves
// once "Allow other applications on this computer to communicate with
// Zotero" is on - nothing leaves the computer.
/* global nameOrder, noteSettings, notePath, openNote */
/** What activate was given: the plugin's storage and own files. */
let ctx;

const ITEMS = "http://localhost:23119/api/users/0/items/";
const API = ITEMS + "top";

/** Every locale's References heading, so a list made in another app
 *  language is still found and replaced. */
const REFERENCE_HEADINGS = [
  "References", "参考文献", "參考文獻", "참고문헌", "Referencias",
  "Références", "Literatur", "Литература", "Referências",
];

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
    const error = new Error(t("unreachable"), { cause: cause });
    error.unreachable = true;
    throw error;
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

/** Citation keys found this session, so a hover answers at once. */
const byCitationKey = new Map();

/** The item a citation or a zotero:// link names, or null. */
async function itemFor(target) {
  if (target.type === "citation") {
    if (byCitationKey.has(target.key)) return byCitationKey.get(target.key);
    // The quick mode first: full text can outlast the hover's wait.
    for (const mode of ["titleCreatorYear", "everything"]) {
      const items = await search(target.key, mode);
      const item = items.find((i) => citationKey(i) === target.key);
      if (item) {
        byCitationKey.set(target.key, item);
        return item;
      }
    }
    return null;
  }
  const key =
    target.type === "link" &&
    (/^zotero:\/\/select\/library\/items\/([A-Z0-9]+)/i.exec(target.url) ||
      [])[1];
  return key ? itemByKey(key) : null;
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

async function insert(item, style, replace) {
  // Searched by the selected words: the citation takes their place.
  if (replace) await textus.editor.replaceSelection(citation(item, style));
  else await textus.editor.insertText(citation(item, style));
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
  return get(ITEMS + key + "?format=json");
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

/** The item the user picks, from the selection's words (`fromSelection`),
 *  else a recent item or a search: {item, fromSelection}, or null. */
async function chooseItem() {
  const selection = await textus.editor.getSelection();
  let query = selection && selection.text && selection.text.trim();
  const fromSelection = Boolean(query);
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
        if (item) return { item: item, fromSelection: false };
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
  const item = items.find((i) => i.key === picked);
  return item ? { item: item, fromSelection: fromSelection } : null;
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
    const chosen = await chooseItem();
    if (!chosen) return;
    const item = chosen.item;
    await insert(item, style, chosen.fromSelection);
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
    const chosen = await chooseItem();
    if (chosen) await openNote(root, chosen.item);
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
      let unreachable = false;
      const lookup = (f) =>
        itemFor(f).catch((err) => {
          if (err.unreachable) unreachable = true;
          return null;
        });
      const items = (await Promise.all(found.map(lookup))).filter(Boolean);
      if (!items.length) {
        if (unreachable) await textus.ui.message(t("unreachable"), { tone: "warning" });
        else await textus.ui.message(t("notInLibrary"));
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
      const headings = new Set([t("references"), ...REFERENCE_HEADINGS].map((h) => "## " + h));
      const at = blocks.findIndex(
        (b) => b.kind === "heading" && headings.has(b.markdown.trim()),
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

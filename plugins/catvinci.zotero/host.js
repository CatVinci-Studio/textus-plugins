// Zotero: a citation from the user's Zotero library, inserted where the
// caret is as a proposal. The library is searched through Zotero 7's local
// API on this computer (http://localhost:23119/api/), which Zotero serves
// once "Allow other applications on this computer to communicate with
// Zotero" is on - nothing leaves the computer.
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
  const key =
    item.data.citationKey ||
    (/Citation Key:\s*(\S+)/.exec(item.data.extra || "") || [])[1];
  return key ? "[@" + key + "]" : "(" + who + ", " + year(item) + ")";
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
      headers: { "Zotero-API-Version": "3" },
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
  await textus.document.proposeEdit({
    action: "insert_at_cursor",
    text: citation(item, style),
    reason: t("citeReason", item.data.title || ""),
  });
  const recent = (await textus.storage.get(RECENT)) || [];
  const entry = {
    key: item.key,
    title: item.data.title || item.key,
    byline: [authors(item), year(item)].filter(Boolean).join(" · "),
  };
  await textus.storage.set(
    RECENT,
    [entry, ...recent.filter((r) => r.key !== item.key)].slice(0, 10),
  );
}

async function itemByKey(key) {
  return get(API.replace(/\/top$/, "/") + key + "?format=json");
}

/** The citations and zotero:// links in `text`, each once. */
function citedIn(text) {
  const out = [];
  const seen = new Set();
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

exports.activate = function () {
  // Resting on a citation shows what it cites (Textus 1.3 and later).
  if (textus.editor && textus.editor.registerHoverProvider)
    textus.editor.registerHoverProvider({
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

  textus.commands.registerCommand("catvinci.zotero.cite", async function () {
    const style = await textus.settings.get("style");
    // The selection is what to look for; else a recent item, or a search.
    const selection = await textus.document.getSelection();
    let query = selection && selection.text && selection.text.trim();
    if (!query) {
      const recent = (await textus.storage.get(RECENT)) || [];
      if (recent.length) {
        const picked = await textus.window.showQuickPick(
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
        if (picked === null || picked === undefined) return;
        if (picked) {
          const item = await itemByKey(picked).catch(() => null);
          if (item) return insert(item, style);
        }
      }
      query = await textus.window.showInput({ prompt: t("search"), value: "" });
      if (!query || !query.trim()) return;
    }
    let items;
    try {
      items = await search(query.trim());
    } catch (err) {
      await textus.window.showMessage(err.message, { tone: "warning" });
      return;
    }
    if (!items.length) {
      await textus.window.showMessage(t("nothing"));
      return;
    }
    const picked = await textus.window.showQuickPick(
      items.map((item) => ({
        label: item.data.title || item.key,
        description: [authors(item), year(item)].filter(Boolean).join(" · "),
        value: item.key,
      })),
      { placeholder: t("choose") },
    );
    const item = items.find((i) => i.key === picked);
    if (item) await insert(item, style);
  });

  textus.commands.registerCommand(
    "catvinci.zotero.bibliography",
    async function () {
      const text = (await textus.document.getText()) || "";
      const found = citedIn(text);
      if (!found.length) {
        await textus.window.showMessage(t("noCitations"));
        return;
      }
      let items;
      try {
        items = (await Promise.all(found.map((f) => itemFor(f).catch(() => null))))
          .filter(Boolean);
      } catch (err) {
        await textus.window.showMessage(err.message, { tone: "warning" });
        return;
      }
      if (!items.length) {
        await textus.window.showMessage(t("unreachable"), { tone: "warning" });
        return;
      }
      // One entry per item, by its first author, then its year.
      const seen = new Set();
      const entries = items
        .filter((item) => !seen.has(item.key) && seen.add(item.key))
        .sort((a, b) =>
          (authors(a) + year(a)).localeCompare(authors(b) + year(b)),
        )
        .map(reference);
      await textus.document.proposeEdit({
        action: "append",
        text: "## " + t("references") + "\n\n" + entries.join("\n"),
        reason: t("bibliographyReason", entries.length),
      });
    },
  );
};

exports.citedIn = citedIn;

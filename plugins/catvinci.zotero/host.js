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
    const query = await textus.window.showInput({
      prompt: t("search"),
      value: "",
    });
    if (!query || !query.trim()) return;
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
    const style = await textus.settings.get("style");
    const picked = await textus.window.showQuickPick(
      items.map((item) => ({
        label: item.data.title || item.key,
        description: [authors(item), year(item)].filter(Boolean).join(" · "),
        value: item.key,
      })),
      { placeholder: t("choose") },
    );
    const item = items.find((i) => i.key === picked);
    if (!item) return;
    await textus.document.proposeEdit({
      action: "insert_at_cursor",
      text: citation(item, style),
      reason: t("citeReason", item.data.title || ""),
    });
  });
};

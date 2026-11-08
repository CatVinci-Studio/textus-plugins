// Tags: every #tag in the open folder, with how many notes use it; open one
// for its notes. Right-click to rename a tag everywhere - to a name another
// tag has, and the two become one.

/* global tagEdit, nameOrder */
const t = (key, ...args) => textus.l10n.t(key, ...args);

let list = null;

/** A tag's node: nested tags (#project/alpha) are a tree, as in Obsidian. */
function tagNode(tag, count, nested) {
  return {
    id: "tag:" + tag,
    label: "#" + (tag.includes("/") ? tag.slice(tag.lastIndexOf("/") + 1) : tag),
    description: String(count),
    detail: tag.includes("/") ? "#" + tag : undefined,
    icon: "tag",
    children: true,
    data: { tag, nested },
    actions: [{ label: t("rename"), command: "catvinci.tags.rename", args: [tag] }],
  };
}

/** The tags one level under `prefix` ("" for the top), each counting the
 *  notes of its sub-tags too. */
function level(tags, prefix) {
  const counts = new Map();
  const nested = new Set();
  for (const { tag, count } of tags) {
    if (prefix && !tag.startsWith(prefix + "/")) continue;
    const rest = prefix ? tag.slice(prefix.length + 1) : tag;
    const name = (prefix ? prefix + "/" : "") + rest.split("/")[0];
    counts.set(name, (counts.get(name) || 0) + count);
    if (rest.includes("/")) nested.add(name);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || nameOrder.compareNames(a[0], b[0]))
    .map(([tag, count]) => tagNode(tag, count, nested.has(tag)));
}

async function items(parent) {
  if (!(await textus.files.root())) {
    list.setMessage(t("nofolder"));
    return [];
  }
  list.setMessage("");
  const tags = await textus.metadata.tags();
  if (!parent) return level(tags, "");
  const { tag, nested } = parent.data;
  const docs = (await textus.metadata.all())
    .filter((d) => d.tags.includes(tag))
    .map((d) => ({
      id: "note:" + tag + ":" + d.path,
      label: d.title,
      detail: d.rel,
      icon: "file",
      location: { path: d.path },
    }));
  return (nested ? level(tags, tag) : []).concat(docs);
}

/** Renames `from` in every note of the folder that has it. */
async function rename(from) {
  const typed = await textus.ui.input({ prompt: t("renameTitle", "#" + from), value: from });
  const to = typed && typed.trim().replace(/^#/, "");
  if (!to || to === from) return;
  if (!tagEdit.validTag(to)) {
    textus.ui.notice(t("invalid"), { tone: "warning" });
    return;
  }
  const docs = (await textus.metadata.all()).filter((d) => d.tags.includes(from));
  for (const doc of docs)
    await textus.files.process(doc.path, (text) => tagEdit.renameTag(text, from, to));
  textus.ui.notice(t("renamed", "#" + from, "#" + to, docs.length));
}

// Textus AI's tools.
async function listTags() {
  if (!(await textus.files.root())) return { error: "No folder is open." };
  const tags = await textus.metadata.tags();
  return { tags: tags.sort((a, b) => b.count - a.count || nameOrder.compareNames(a.tag, b.tag)) };
}

async function notesWithTag(input) {
  if (!(await textus.files.root())) return { error: "No folder is open." };
  const tag = String(input.tag || "").trim().replace(/^#/, "");
  // Nested tags count for their parent: #project/alpha is a #project note.
  const has = (d) => d.tags.some((name) => name === tag || name.startsWith(tag + "/"));
  const docs = (await textus.metadata.all()).filter(has);
  return { tag: tag, notes: docs.map((d) => ({ title: d.title, path: d.rel, tags: d.tags })) };
}

exports.activate = function (ctx) {
  list = textus.views.registerList("catvinci.tags.panel", {
    items,
    filterPlaceholder: t("filter"),
    emptyText: t("none"),
  });
  const refresh = () => list.refresh();
  ctx.subscriptions.push(
    list,
    textus.commands.register("catvinci.tags.rename", (tag) => rename(tag).finally(refresh)),
    textus.metadata.onDidChange(refresh),
    textus.files.onDidChangeRoot(refresh),
    textus.ai.registerTool("list_tags", listTags),
    textus.ai.registerTool("notes_with_tag", notesWithTag),
  );
};

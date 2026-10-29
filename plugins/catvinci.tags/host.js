// Tags: every #tag in the open folder, with how many notes use it; open one
// for its notes. Right-click to rename a tag everywhere - to a name another
// tag has, and the two become one.

/* global tagEdit */
const t = (key, ...args) => textus.l10n.t(key, ...args);

let list = null;

async function items(parent) {
  if (!(await textus.files.root())) {
    list.setMessage(t("nofolder"));
    return [];
  }
  list.setMessage("");
  if (parent) {
    const docs = await textus.metadata.all();
    return docs
      .filter((d) => d.tags.includes(parent.data))
      .map((d) => ({
        id: "note:" + parent.data + ":" + d.path,
        label: d.title,
        detail: d.rel,
        icon: "file",
        location: { path: d.path },
      }));
  }
  const tags = await textus.metadata.tags();
  return tags
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .map((tag) => ({
      id: "tag:" + tag.tag,
      label: "#" + tag.tag,
      description: String(tag.count),
      icon: "tag",
      children: true,
      data: tag.tag,
      actions: [{ label: t("rename"), command: "catvinci.tags.rename", args: [tag.tag] }],
    }));
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
  );
};

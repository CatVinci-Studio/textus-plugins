// Templates: Markdown files kept in the plugin's own global folder
// (ctx.storage.global), filled in as they are used - {{date}}, {{time}},
// {{title}} - into a new document or at the caret.
let ctx;
const t = (key, ...args) => textus.l10n.t(key, ...args);
const pad = (n) => String(n).padStart(2, "0");

function fill(text, title) {
  const now = new Date();
  return text
    .replace(
      /\{\{date\}\}/g,
      now.getFullYear() +
        "-" +
        pad(now.getMonth() + 1) +
        "-" +
        pad(now.getDate()),
    )
    .replace(/\{\{time\}\}/g, pad(now.getHours()) + ":" + pad(now.getMinutes()))
    .replace(/\{\{title\}\}/g, title);
}

/** The templates there are; a first one is written if there are none. */
async function templates() {
  let names = (await ctx.storage.global.files()).filter((f) =>
    f.endsWith(".md"),
  );
  if (!names.length) {
    await ctx.storage.global.writeText(
      t("meeting") + ".md",
      "# {{title}}\n\n{{date}} {{time}}\n\n## " +
        t("attendees") +
        "\n\n- \n\n## " +
        t("agenda") +
        "\n\n1. \n\n## " +
        t("actions") +
        "\n\n- [ ] \n",
    );
    names = [t("meeting") + ".md"];
  }
  return names.sort();
}

async function pickTemplate() {
  const name = await textus.ui.pick(
    (await templates()).map((file) => ({
      label: file.replace(/\.md$/, ""),
      value: file,
    })),
    { placeholder: t("pick") },
  );
  return name
    ? {
        name: String(name).replace(/\.md$/, ""),
        text: await ctx.storage.global.readText(name),
      }
    : null;
}

function join(root, name) {
  const sep = root.includes("\\") && !root.includes("/") ? "\\" : "/";
  return root.replace(/[\\/]+$/, "") + sep + name;
}

exports.activate = function (context) {
  ctx = context;
  textus.commands.register("catvinci.templates.new", async function () {
    const root = await textus.files.root();
    if (!root) return textus.ui.message(t("needsFolder"));
    const template = await pickTemplate();
    if (!template) return;
    const title = await textus.ui.input({
      prompt: t("docName"),
      value: template.name,
    });
    if (!title || !title.trim()) return;
    const path = join(root, title.trim().replace(/[\\/:*?"<>|]/g, "-") + ".md");
    await textus.files.create(path, fill(template.text, title.trim()));
    await textus.layout.open(path);
  });
  textus.commands.registerEditorCommand(
    "catvinci.templates.insert",
    async function (editor) {
      const template = await pickTemplate();
      if (!template) return;
      const path = (await editor.getPath()) || "";
      const title =
        path.split(/[\\/]/).pop().replace(/\.md$/i, "") || template.name;
      await editor.insertText(fill(template.text, title));
    },
  );
  textus.commands.registerEditorCommand(
    "catvinci.templates.save",
    async function (editor) {
      const name = await textus.ui.input({ prompt: t("templateName") });
      if (!name || !name.trim()) return;
      await ctx.storage.global.writeText(
        name.trim() + ".md",
        (await editor.getText()) || "",
      );
      textus.ui.notice(t("saved", name.trim()), { tone: "success" });
    },
  );
};

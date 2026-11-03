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
    .replace(/\{\{title\}\}/g, () => title);
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

// Textus AI's tools.
async function listTemplates() {
  const out = [];
  for (const file of await templates())
    out.push({ name: file.replace(/\.md$/, ""), text: await ctx.storage.global.readText(file) });
  return { templates: out };
}

async function createFromTemplate(input) {
  const root = await textus.files.root();
  if (!root) return { error: t("needsFolder") };
  const names = await templates();
  const wanted = String(input.template || "").replace(/\.md$/, "").toLowerCase();
  const file = names.find((n) => n.replace(/\.md$/, "").toLowerCase() === wanted);
  if (!file) return { error: "No template " + JSON.stringify(input.template) + "; there are: " + names.map((n) => n.replace(/\.md$/, "")).join(", ") };
  const title = String(input.title || "").trim() || file.replace(/\.md$/, "");
  const folder = String(input.folder || "").replace(/\\/g, "/").replace(/^\.?\/+|\/+$/g, "");
  if (folder.split("/").includes("..")) return { error: "folder must be in the open folder." };
  const rel = (folder ? folder + "/" : "") + title.replace(/[\\/:*?"<>|]/g, "-") + ".md";
  const path = join(root, rel);
  if (await textus.files.stat(path)) return { error: t("exists", title) };
  if (folder) await textus.files.createFolder(join(root, folder)).catch(() => {});
  await textus.files.create(path, fill(await ctx.storage.global.readText(file), title));
  return { path: rel, template: file.replace(/\.md$/, "") };
}

exports.activate = function (context) {
  ctx = context;
  textus.ai.registerTool("list_templates", listTemplates);
  textus.ai.registerTool("create_from_template", createFromTemplate);
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
    if (await textus.files.stat(path))
      return textus.ui.message(t("exists", title.trim()));
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

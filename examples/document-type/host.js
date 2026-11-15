// Quarto documents: the manifest's documentTypes opens .qmd files in
// Textus's editor and keeps Quarto's own syntax (::: divs, {{< shortcodes >}},
// {#id .class} attributes) as written. The code only gives Textus AI the
// project's settings.

exports.activate = function (ctx) {
  ctx.subscriptions.push(
    textus.ai.registerTool("quarto_project", async () => {
      if (!textus.files.root()) return "No folder is open.";
      const text = await textus.files.readText("_quarto.yml").catch(() => null);
      return text ?? "This folder has no _quarto.yml: not a Quarto project.";
    }),
  );
};

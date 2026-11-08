import { expect, it } from "vitest";
import { folder, loadPlugin } from "./plugin-host";

/** Pages' tool for Textus AI (plugins/catvinci.database/pages-host.js). */
it("makes a page, or a sub-page in its parent's folder unit, and gives the link", async () => {
  const files: Record<string, string> = { "Life.md": "# Life\n" };
  const icons: Record<string, unknown> = {};
  const f = folder(files);
  const frontmatter = {
    update: async (path: string, change: (fm: Record<string, unknown>) => void) => {
      const fm: Record<string, unknown> = {};
      change(fm);
      icons[path] = fm.icon;
    },
  };
  const { tools } = loadPlugin("catvinci.database", { files: { ...f, frontmatter } });
  const create = tools.get("create_page")!;
  expect(await create({ title: "Week 1", parent: "Life", icon: "📅", body: "Plans." })).toEqual({
    path: "Life/Week 1.md",
    parent: "Life/Life.md",
    link: "[[Week 1]]",
  });
  // Its first sub-page made Life a folder unit: Life.md moved into Life/.
  expect(files["Life/Life.md"]).toBe("# Life\n");
  expect(files["Life.md"]).toBeUndefined();
  expect(files["Life/Week 1.md"]).toBe("# Week 1\n\nPlans.\n");
  expect(icons["/root/Life/Week 1.md"]).toBe("📅");
  expect(await create({ title: "Ideas" })).toMatchObject({ path: "Ideas.md", parent: null });
  expect(await create({ title: "Ideas" })).toHaveProperty("error");
  expect(await create({ title: "x", parent: "Missing" })).toHaveProperty("error");
});

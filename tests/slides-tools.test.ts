import { expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** Slides' tool for Textus AI (plugins/catvinci.slides/host.js), with the
 *  bundled Marp. */
it("exports the document in front as a deck beside it", async () => {
  const written: Record<string, string> = {};
  const editor = { getPath: async () => "/root/Talk.md", getText: async () => "# One\n\n---\n\n## Two" };
  const files = { writeText: async (path: string, text: string) => void (written[path] = text) };
  const { tools } = loadPlugin("catvinci.slides", { editor, files });
  expect(await tools.get("export_slides")!({})).toEqual({ path: "/root/Talk.slides.html", slides: 2 });
  expect(written["/root/Talk.slides.html"]).toContain("<title>Talk.md</title>");
});

it("asks for a saved document when there is none", async () => {
  const { tools } = loadPlugin("catvinci.slides");
  expect(await tools.get("export_slides")!({})).toHaveProperty("error");
});

import { expect, it, vi } from "vitest";
import { loadPlugin } from "./plugin-host";

/** The guest of Textus AI's model shows only while its panel is open
 *  (plugins/catvinci.desk-pet/host.js). */
it("sends the AI's guest home when the AI panel closes", async () => {
  let panels: (state: unknown) => void = () => {};
  let ai: (state: unknown) => void = () => {};
  const page = { html: "" };
  loadPlugin("catvinci.desk-pet", {
    ai: {
      state: async () => ({ state: "idle", model: null }),
      onDidChangeState: (f: typeof ai) => ((ai = f), { dispose() {} }),
    },
    layout: {
      panels: async () => ({ sidebar: { open: true, tab: "files" }, ai: { open: true } }),
      onDidChangePanels: (f: typeof panels) => ((panels = f), { dispose() {} }),
    },
    views: {
      registerWebview: (_id: string, view: { resolve: (w: unknown) => Promise<void> }) =>
        view.resolve(
          Object.assign(page, {
            postMessage() {},
            onDidDispose: () => ({ dispose() {} }),
            onDidReceiveMessage: () => ({ dispose() {} }),
          }),
        ),
    },
  });
  await vi.waitFor(() => expect(page.html).toContain("pets/textus/"));
  ai({ state: "thinking", model: { provider: "anthropic", id: "x" } });
  await vi.waitFor(() => expect(page.html).toContain("pets/claude/"));
  panels({ sidebar: { open: true, tab: "files" }, ai: { open: false } });
  await vi.waitFor(() => expect(page.html).toContain("pets/textus/"));
  panels({ sidebar: { open: true, tab: "files" }, ai: { open: true } });
  await vi.waitFor(() => expect(page.html).toContain("pets/claude/"));
});

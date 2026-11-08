import { expect, it, vi } from "vitest";
import { loadPlugin } from "./plugin-host";

type Listener = (state: unknown) => void;

/** Desk Pet loaded with Textus AI idle and its panel open; `layout` adds to
 *  or replaces the layout API. Answers her page and the AI and panel
 *  listeners, to drive (plugins/catvinci.desk-pet/host.js). */
function loadPet(layout: Record<string, unknown> = {}) {
  const heard: { ai: Listener; panels: Listener } = {
    ai: () => {},
    panels: () => {},
  };
  const page = { html: "" };
  loadPlugin("catvinci.desk-pet", {
    ai: {
      state: async () => ({ state: "idle", model: null }),
      onDidChangeState: (f: Listener) => ((heard.ai = f), { dispose() {} }),
    },
    layout: {
      panels: async () => ({ sidebar: { open: true, tab: "files" }, ai: { open: true } }),
      onDidChangePanels: (f: Listener) => ((heard.panels = f), { dispose() {} }),
      ...layout,
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
  return { page, heard };
}

/** The guest of Textus AI's model shows only while its panel is open. */
it("sends the AI's guest home when the AI panel closes", async () => {
  const { page, heard } = loadPet();
  await vi.waitFor(() => expect(page.html).toContain("pets/textus/"));
  heard.ai({ state: "thinking", model: { provider: "anthropic", id: "x" } });
  await vi.waitFor(() => expect(page.html).toContain("pets/claude/"));
  heard.panels({ sidebar: { open: true, tab: "files" }, ai: { open: false } });
  await vi.waitFor(() => expect(page.html).toContain("pets/textus/"));
  heard.panels({ sidebar: { open: true, tab: "files" }, ai: { open: true } });
  await vi.waitFor(() => expect(page.html).toContain("pets/claude/"));
});

/** Opened on the left half, she faces the middle from her first frame. */
it("faces the middle when she opens on the left", async () => {
  const { page } = loadPet({
    floatingViews: async () => [
      { view: "catvinci.desk-pet.pet", open: true, visible: true, side: "left" },
    ],
  });
  await vi.waitFor(() => expect(page.html).toContain('toggle("turned", true)'));
});

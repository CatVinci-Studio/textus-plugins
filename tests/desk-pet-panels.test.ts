import { expect, it, vi } from "vitest";
import { loadPlugin } from "./plugin-host";

type Listener = (state: unknown) => void;

/** Desk Pet loaded with Textus AI idle and its panel open; `layout` adds to
 *  or replaces the layout API. Answers her page and the AI and panel
 *  listeners, to drive (plugins/catvinci.desk-pet/host.js). */
function loadPet(layout: Record<string, unknown> = {}, more: Record<string, unknown> = {}) {
  const heard: { ai: Listener; panels: Listener; page: Listener } = {
    ai: () => {},
    panels: () => {},
    page: () => {},
  };
  const posts: Record<string, unknown>[] = [];
  const page = { html: "" };
  loadPlugin("catvinci.desk-pet", {
    settings: { get: async (key: string) => key === "bubbles" },
    ...more,
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
            postMessage: (m: Record<string, unknown>) => void posts.push(m),
            onDidDispose: () => ({ dispose() {} }),
            onDidReceiveMessage: (f: Listener) => ((heard.page = f), { dispose() {} }),
          }),
        ),
    },
  });
  return { page, heard, posts };
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

/** A page rebuilt for the guest starts surprised and still shows her hello
 *  sent while it loaded. */
it("gives the guest's new page her pose and greeting", async () => {
  const { page, heard, posts } = loadPet({}, { app: { state: "active" } });
  await vi.waitFor(() => expect(page.html).toContain("pets/textus/"));
  heard.ai({ state: "thinking", model: { provider: "openrouter", id: "anthropic/claude-sonnet-5-5" } });
  await vi.waitFor(() => expect(page.html).toContain("pets/claude/"));
  expect(page.html).toContain('show("surprised"');
  await vi.waitFor(() => expect(posts.some((m) => m.say)).toBe(true));
  posts.length = 0;
  heard.page({ ready: true });
  expect(posts.some((m) => m.say)).toBe(true);
});

/** Opened while Textus is away, her page starts still. */
it("starts still when Textus is away", async () => {
  const { page, heard, posts } = loadPet({}, { app: { state: "inactive" } });
  await vi.waitFor(() => expect(page.html).toContain("pets/textus/"));
  heard.page({ ready: true });
  expect(posts.some((m) => m.paused === true)).toBe(true);
});

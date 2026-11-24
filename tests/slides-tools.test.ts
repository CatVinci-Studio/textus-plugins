import { expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** Slides' tool for Textus AI (plugins/catvinci.slides/host.js), with the
 *  bundled Marp. */
it("exports the document in front as a deck beside it", async () => {
  const written: Record<string, string> = {};
  const editor = {
    getPath: async () => "/root/Talk.md",
    getText: async () => "# One\n\n---\n\n## Two",
  };
  const files = {
    writeText: async (path: string, text: string) =>
      void (written[path] = text),
  };
  const { tools } = loadPlugin("catvinci.slides", { editor, files });
  expect(await tools.get("export_slides")!({})).toEqual({
    path: "/root/Talk.slides.html",
    slides: 2,
  });
  expect(written["/root/Talk.slides.html"]).toContain("<title>Talk.md</title>");
  // Marp's own script, which scales each slide to its frame in Safari.
  expect(written["/root/Talk.slides.html"]).toContain("marpitSVGPolyfill");
});

it("asks for a saved document when there is none; File › Export takes any", async () => {
  type Format = {
    export(d: { markdown: string; path: string | null }): Promise<string>;
  };
  let format: Format | undefined;
  const { tools } = loadPlugin("catvinci.slides", {
    export: {
      registerFormat: (_id: string, f: Format) => (
        (format = f),
        { dispose() {} }
      ),
    },
  });
  expect(await tools.get("export_slides")!({})).toHaveProperty("error");
  const page = await format!.export({
    markdown: "# One\n\n---\n\n# Two",
    path: null,
  });
  expect(page).toContain("<title>name</title>");
  expect(page.match(/<svg[^>]*data-marpit-svg/g)).toHaveLength(2);
  expect(page).toContain("marpitSVGPolyfill");
});

it("renders nothing on edits while no slides tab is open", async () => {
  const listeners: Array<() => unknown> = [];
  let reads = 0;
  const editor = {
    getPath: async () => "/root/Talk.md",
    getText: async () => (reads++, "# One"),
    onDidChange: (run: () => unknown) => (
      listeners.push(run),
      { dispose() {} }
    ),
    onDidChangeActive: (run: () => unknown) => (
      listeners.push(run),
      { dispose() {} }
    ),
  };
  loadPlugin("catvinci.slides", { editor });
  for (const run of listeners) await run();
  expect(listeners).toHaveLength(2);
  expect(reads).toBe(0);
});

it("sends the deck again only when it changed, and to a page that opens", async () => {
  const listeners: Array<() => unknown> = [];
  let text = "# One";
  let resolve: ((view: unknown) => Promise<void>) | null = null;
  const editor = {
    getPath: async () => "/root/Talk.md",
    getText: async () => text,
    onDidChange: (run: () => unknown) => (
      listeners.push(run),
      { dispose() {} }
    ),
    onDidChangeActive: () => ({ dispose() {} }),
  };
  loadPlugin("catvinci.slides", {
    editor,
    views: {
      registerWebview: (_id: string, p: { resolve: typeof resolve }) => (
        (resolve = p.resolve),
        { dispose() {} }
      ),
    },
  });
  const page = () => {
    const sent: unknown[] = [];
    let told: ((m: unknown) => void) | null = null;
    return {
      sent,
      ready: async () => told!("ready"),
      view: {
        html: "",
        postMessage: (m: unknown) => void sent.push(m),
        onDidReceiveMessage: (fn: typeof told) => (
          (told = fn),
          { dispose() {} }
        ),
        onDidDispose: () => ({ dispose() {} }),
      },
    };
  };
  const a = page();
  await resolve!(a.view);
  await a.ready();
  await new Promise((r) => setTimeout(r, 0));
  expect(a.sent).toHaveLength(1);
  // A pause with the same text: nothing new to show.
  await listeners[0]();
  expect(a.sent).toHaveLength(1);
  const b = page();
  await resolve!(b.view);
  await b.ready();
  await new Promise((r) => setTimeout(r, 0));
  expect([a.sent.length, b.sent.length]).toEqual([1, 1]);
  text = "# One\n\n---\n\n## Two";
  await listeners[0]();
  expect([a.sent.length, b.sent.length]).toEqual([2, 2]);
});

/** A slides page with the plugin loaded: what it was sent, and its "ready". */
function slidesPage(api: Record<string, unknown>) {
  let resolve: ((view: unknown) => Promise<void>) | null = null;
  loadPlugin("catvinci.slides", {
    ...api,
    views: {
      registerWebview: (_id: string, p: { resolve: typeof resolve }) => (
        (resolve = p.resolve),
        { dispose() {} }
      ),
    },
  });
  const sent: Array<{ html: string }> = [];
  let told: ((m: unknown) => void) | null = null;
  return {
    sent,
    async open() {
      await resolve!({
        html: "",
        postMessage: (m: { html: string }) => void sent.push(m),
        onDidReceiveMessage: (fn: typeof told) => ((told = fn), { dispose() {} }),
        onDidDispose: () => ({ dispose() {} }),
      });
      told!("ready");
      await new Promise((r) => setTimeout(r, 0));
    },
  };
}

it("with no document in front, shows the one open in another tab, as saved", async () => {
  // Presented from the plugin's own page, or the document in Source and
  // Preview: the editor has no document in front.
  const editor = {
    getPath: async () => null,
    getText: async () => null,
    onDidChange: () => ({ dispose() {} }),
    onDidChangeActive: () => ({ dispose() {} }),
  };
  const read: string[] = [];
  const page = slidesPage({
    editor,
    layout: {
      tabs: async () => [
        { id: "a", title: "Plugin: Marp", kind: "view", path: null },
        { id: "b", title: "Talk.md", kind: "document", path: "/root/Talk.md" },
      ],
    },
    files: {
      readText: async (path: string) => (read.push(path), "# 第一页\n\n---\n\n# 第二页"),
      stat: async () => null,
    },
  });
  await page.open();
  expect(read).toContain("/root/Talk.md");
  expect(page.sent).toHaveLength(1);
  expect(page.sent[0].html.match(/<svg[^>]*data-marpit-svg/g)).toHaveLength(2);
});

it("tells a page there is nothing to show rather than leaving it blank", async () => {
  const editor = {
    getPath: async () => null,
    getText: async () => null,
    onDidChange: () => ({ dispose() {} }),
    onDidChangeActive: () => ({ dispose() {} }),
  };
  const page = slidesPage({ editor, layout: { tabs: async () => [] } });
  await page.open();
  expect(page.sent).toEqual([{ html: "", css: "" }]);
});

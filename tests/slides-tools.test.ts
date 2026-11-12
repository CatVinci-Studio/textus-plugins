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
});

it("asks for a saved document when there is none", async () => {
  const { tools } = loadPlugin("catvinci.slides");
  expect(await tools.get("export_slides")!({})).toHaveProperty("error");
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
        onDidReceiveMessage: (fn: typeof told) => ((told = fn), { dispose() {} }),
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

import { describe, expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** Canvas's tabs (plugins/catvinci.canvas/host.js): what each page is sent,
 *  and what a click in it opens. */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

const enc = (s: string) => new TextEncoder().encode(s);

/** The plugin over a folder at /root of `files`, its two editors, and the
 *  places layout.open was asked for. */
function canvasPlugin(files: Record<string, string>) {
  const editors = new Map<string, Any>();
  const opened: Any[] = [];
  const path = (p: string) => p.replace(/^\/root\//, "");
  loadPlugin("catvinci.canvas", {
    views: {
      registerFileEditor: (type: string, provider: Any) => {
        editors.set(type, provider);
        return { dispose() {} };
      },
    },
    files: {
      root: async () => "/root",
      stat: async (p: string) => (path(p) in files ? { size: files[path(p)].length } : null),
      readText: async (p: string) => {
        if (!(path(p) in files)) throw new Error("missing");
        return files[path(p)];
      },
      read: async (p: string) => enc(files[path(p)]),
    },
    metadata: {
      resolveNote: async (link: string) => ({ path: "/root/" + link.slice(2, -2), exists: true, kind: "file" }),
    },
    layout: {
      open: async (...args: Any[]) => void opened.push(args),
    },
  });
  return { editors, opened };
}

/** Opens `file` in the editor `type` and says the page is ready: the
 *  messages the page got, and a way to send it more. */
async function open(editor: Any, file: string, text: string) {
  const sent: Any[] = [];
  let receive: (m: unknown) => Promise<void> = async () => {};
  const webview = {
    html: "",
    postMessage: async (m: Any) => void sent.push(m),
    onDidReceiveMessage: (f: Any) => (receive = f),
    onDidDispose: () => {},
  };
  const document = { path: "/root/" + file, fileName: file.split("/").pop(), readText: async () => text };
  await editor.resolve(document, webview, { target: null });
  await receive({ type: "ready" });
  return { sent, send: (m: unknown) => receive(m) };
}

describe("canvas tabs", () => {
  const board = JSON.stringify({
    nodes: [
      { id: "n", type: "file", file: "Notes/Plan.md", subpath: "#Goals", x: 0, y: 0, width: 200, height: 100 },
      { id: "p", type: "file", file: "pic.png", x: 300, y: 0, width: 100, height: 100 },
      { id: "m", type: "file", file: "Gone.md", x: 0, y: 200, width: 100, height: 100 },
    ],
    edges: [],
  });
  const files = { "Board.canvas": board, "Notes/Plan.md": "---\ntags: a\n---\n# Plan\nFirst line", "pic.png": "PNG" };

  it("sends the canvas, then each file on it as the folder has it", async () => {
    const { editors } = canvasPlugin(files);
    const { sent } = await open(editors.get("catvinci.canvas.canvas"), "Board.canvas", board);
    expect(sent[0]).toMatchObject({ type: "canvas", name: "Board.canvas" });
    expect(sent[0].canvas.nodes).toHaveLength(3);
    expect(sent.slice(1)).toEqual([
      { type: "file", file: "Notes/Plan.md", kind: "note", title: "Plan", text: "# Plan\nFirst line" },
      { type: "file", file: "pic.png", kind: "image", bytes: enc("PNG"), mime: "image/png" },
      { type: "file", file: "Gone.md", kind: "missing" },
    ]);
  });

  it("opens a file node's note at its heading", async () => {
    const { editors, opened } = canvasPlugin(files);
    const { send } = await open(editors.get("catvinci.canvas.canvas"), "Board.canvas", board);
    await send({ type: "open", file: "Notes/Plan.md", subpath: "#Goals" });
    expect(opened).toEqual([[{ path: "/root/Notes/Plan.md", heading: "Goals" }]]);
  });

  it("says when the canvas isn't JSON", async () => {
    const { editors } = canvasPlugin({});
    const { sent } = await open(editors.get("catvinci.canvas.canvas"), "Bad.canvas", "{oops");
    expect(sent).toEqual([{ type: "failed", message: expect.any(String) }]);
  });
});

describe("a canvas that can't be read", () => {
  it("opens the file as text", async () => {
    const { editors, opened } = canvasPlugin({});
    const broken = await open(editors.get("catvinci.canvas.canvas"), "Broken.canvas", "{");
    expect(broken.sent[0].type).toBe("failed");
    await broken.send({ type: "text" });
    expect(opened).toEqual([["/root/Broken.canvas", { asDocument: true }]]);
  });
});

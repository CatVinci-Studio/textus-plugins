import { createRequire } from "node:module";
import { beforeAll, describe, expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** Excalidraw's two files (plugins/catvinci.excalidraw/excalidraw-file.js):
 *  read, and written back keeping what isn't the drawing. */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;
let file: Any;
const LZString = createRequire(import.meta.url)("lz-string");

beforeAll(async () => {
  (globalThis as Any).LZString = LZString;
  await import(/* @vite-ignore */ "../plugins/catvinci.excalidraw/excalidraw-file.js");
  file = (globalThis as Any).excalidrawFile;
});

const scene = {
  type: "excalidraw",
  version: 2,
  elements: [
    { id: "t1", type: "text", text: "Hello", originalText: "Hello" },
    { id: "r1", type: "rectangle" },
    { id: "t2", type: "text", text: "Gone", isDeleted: true },
  ],
  appState: {},
  files: { abc123: { id: "abc123" }, new1: { id: "new1" } },
};

const note = (drawing: string) =>
  [
    "---",
    "",
    "excalidraw-plugin: parsed",
    "tags: [excalidraw]",
    "",
    "---",
    "==⚠  Switch to EXCALIDRAW VIEW ⚠==",
    "",
    "",
    "# Excalidraw Data",
    "",
    "## Text Elements",
    "Old words ^t0",
    "",
    "## Embedded Files",
    "abc123: [[Pasted image.png]]",
    "",
    "%%",
    "## Drawing",
    drawing,
    "%%",
  ].join("\n");

describe("a .excalidraw file", () => {
  it("is its scene, and is written as the page sent it", () => {
    expect(file.parse("/v/A.excalidraw", JSON.stringify(scene)).scene.elements).toHaveLength(3);
    expect(file.parse("/v/A.excalidraw", "").scene).toEqual({});
    expect(file.write("/v/A.excalidraw", "{}", '{"a":1}', null)).toBe('{"a":1}');
  });
});

describe("an Obsidian Excalidraw note", () => {
  const compressed = note("```compressed-json\n" + LZString.compressToBase64(JSON.stringify(scene)).replace(/(.{40})/g, "$1\n\n") + "\n```");

  it("reads a compressed drawing and the pictures it links", () => {
    const parsed = file.parse("/v/A.excalidraw.md", compressed);
    expect(parsed.compressed).toBe(true);
    expect(parsed.scene.elements[0].text).toBe("Hello");
    expect(parsed.embedded).toEqual([{ id: "abc123", link: "Pasted image.png" }]);
  });

  it("is written back keeping its other parts, its words listed again", () => {
    const parsed = file.parse("/v/A.excalidraw.md", compressed);
    const out = file.write("/v/A.excalidraw.md", compressed, JSON.stringify(scene), parsed);
    expect(out.startsWith(compressed.slice(0, compressed.indexOf("## Text Elements")))).toBe(true);
    expect(out).toContain("## Text Elements\nHello ^t1\n\n## Embedded Files\nabc123: [[Pasted image.png]]");
    expect(out).not.toContain("Old words");
    expect(out).toMatch(/%%\n## Drawing\n```compressed-json\n[\s\S]+\n```\n%%$/);
    const again = file.parse("/v/A.excalidraw.md", out);
    expect(again.scene.elements).toHaveLength(3);
    // The note's linked picture stays a link; a new one is kept in the scene.
    expect(Object.keys(again.scene.files)).toEqual(["new1"]);
    expect(file.write("/v/A.excalidraw.md", out, JSON.stringify(scene), again)).toBe(out);
  });

  it("keeps a plain drawing plain", () => {
    const plain = note("```json\n" + JSON.stringify(scene) + "\n```");
    const parsed = file.parse("/v/A.excalidraw.md", plain);
    expect(parsed.compressed).toBe(false);
    expect(file.write("/v/A.excalidraw.md", plain, JSON.stringify(scene), parsed)).toContain("```json\n{");
  });

  it("gets a drawing and its words when it has none", () => {
    const bare = "---\nexcalidraw-plugin: parsed\n---\n";
    const parsed = file.parse("/v/A.excalidraw.md", bare);
    const out = file.write("/v/A.excalidraw.md", bare, JSON.stringify(scene), parsed);
    expect(out).toContain("## Text Elements\nHello ^t1\n\n%%\n## Drawing\n```compressed-json\n");
    expect(file.parse("/v/A.excalidraw.md", out).scene.elements).toHaveLength(3);
  });
});

describe("a drawing's tab", () => {
  it("is sent the scene, writes what the page saves, and never over a newer file", async () => {
    let editor: Any;
    loadPlugin("catvinci.excalidraw", {
      views: { registerFileEditor: (_type: string, provider: Any) => ((editor = provider), { dispose() {} }) },
      files: { onDidChange: () => ({ dispose() {} }), onDidSave: () => ({ dispose() {} }) },
      commands: { register: () => ({ dispose() {} }) },
    });
    let text = JSON.stringify(scene);
    const sent: Any[] = [];
    let receive: Any;
    await editor.resolve(
      { path: "/v/A.excalidraw", readText: async () => text, writeText: async (t: string) => void (text = t) },
      { postMessage: async (m: Any) => void sent.push(m), onDidReceiveMessage: (f: Any) => (receive = f), onDidDispose: () => {} },
      { target: null },
    );
    await receive({ type: "ready" });
    expect(sent[0]).toMatchObject({ type: "scene", scene: { elements: scene.elements } });
    await receive({ type: "save", json: '{"elements":[]}' });
    expect(text).toBe('{"elements":[]}');
    text = '{"elements":[{"id":"x"}]}';
    await receive({ type: "save", json: '{"elements":[]}' });
    expect(text).toBe('{"elements":[{"id":"x"}]}');
    expect(sent.at(-1)).toMatchObject({ type: "scene", scene: { elements: [{ id: "x" }] } });
  });
});

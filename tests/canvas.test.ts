import { beforeAll, describe, expect, it } from "vitest";

/** Canvas's logic (plugins/catvinci.canvas/canvas-model.js). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let jc: any;

beforeAll(async () => {
  const script = "../plugins/catvinci.canvas/canvas-model.js";
  await import(/* @vite-ignore */ script);
  jc = (globalThis as unknown as { jsonCanvas: unknown }).jsonCanvas;
});

const box = (id: string, x: number, y: number, w = 100, h = 50, more = {}) => ({
  id,
  type: "text",
  x,
  y,
  width: w,
  height: h,
  ...more,
});

describe("canvas files", () => {
  it("reads nodes and edges, groups first, leaving out what can't be drawn", () => {
    const canvas = jc.parse(
      JSON.stringify({
        nodes: [
          box("a", 0, 0, 100, 50, { text: "# Hi" }),
          { id: "g", type: "group", x: -20, y: -40, width: 400, height: 300, label: "Ideas", color: "4" },
          { id: "broken", type: "text", x: "1" },
          box("a", 5, 5),
          { id: "f", type: "file", x: 200, y: 0, width: 100, height: 100, file: "Notes/Plan.md", subpath: "#Goals" },
        ],
        edges: [
          { id: "e1", fromNode: "a", toNode: "f", label: "next" },
          { id: "e2", fromNode: "a", toNode: "gone" },
          { id: "e3", fromNode: "f", toNode: "a", fromSide: "left", fromEnd: "arrow", toEnd: "none", color: "#ff8800" },
        ],
      }),
    );
    expect(canvas.nodes.map((n: { id: string }) => n.id)).toEqual(["g", "a", "f"]);
    expect(canvas.nodes[2]).toMatchObject({ type: "file", file: "Notes/Plan.md", subpath: "#Goals" });
    expect(canvas.edges.map((e: { id: string }) => e.id)).toEqual(["e1", "e3"]);
    expect(canvas.edges[0]).toMatchObject({ fromEnd: "none", toEnd: "arrow", fromSide: "" });
    expect(canvas.edges[1]).toMatchObject({ fromSide: "left", fromEnd: "arrow", toEnd: "none" });
    expect(jc.parse("")).toEqual({ nodes: [], edges: [] });
    expect(() => jc.parse("{nope")).toThrow();
  });

  it("paints presets in the theme's tones and hex colours as given", () => {
    expect(jc.color("1")).toEqual({
      line: "var(--tone-red)",
      fill: "var(--tone-red-tint)",
      text: "var(--tone-red-text)",
    });
    expect(jc.color("5").line).toBe("var(--tone-teal)");
    expect(jc.color("6").line).toBe("var(--tone-purple)");
    expect(jc.color("#FF8800").line).toBe("#FF8800");
    expect(jc.color("#FF8800").fill).toContain("color-mix");
    expect(jc.color("#1e1e1e").text).toBeNull();
    expect(jc.color("")).toBeNull();
    expect(jc.color("7")).toBeNull();
    expect(jc.color("red; background: url(x)")).toBeNull();
  });
});

describe("the view", () => {
  it("fits every node in the stage, centred, never past its own size", () => {
    const b = jc.bounds([box("a", -100, -50), box("b", 300, 250, 100, 50)]);
    expect(b).toEqual({ x: -100, y: -50, width: 500, height: 350 });
    const v = jc.fit(b, 1000, 800, 40);
    expect(v.scale).toBe(1);
    // The box's middle (150, 125) lands on the stage's (500, 400).
    expect(150 * v.scale + v.x).toBe(500);
    expect(125 * v.scale + v.y).toBe(400);
    const small = jc.fit(b, 290, 800, 20);
    expect(small.scale).toBeCloseTo(0.5);
    expect(jc.fit(null, 200, 100)).toEqual({ x: 100, y: 50, scale: 1 });
  });

  it("zooms about the pointer, within its limits", () => {
    const v = { x: 10, y: 20, scale: 1 };
    const z = jc.zoomAt(v, 2, 110, 120);
    expect(z.scale).toBe(2);
    // The canvas point under the pointer (100, 100) stays under it.
    expect(100 * z.scale + z.x).toBe(110);
    expect(100 * z.scale + z.y).toBe(120);
    expect(jc.zoomAt(v, 100, 0, 0).scale).toBe(4);
    expect(jc.zoomAt(v, 0.0001, 0, 0).scale).toBe(0.05);
  });

  it("zooms with Ctrl, ⌘ or a pinch, and moves the canvas otherwise", () => {
    expect(jc.wheelIntent({ ctrlKey: true })).toBe("zoom");
    expect(jc.wheelIntent({ metaKey: true })).toBe("zoom");
    expect(jc.wheelIntent({})).toBe("pan");
  });
});

describe("edges", () => {
  const a = box("a", 0, 0, 100, 50);
  const b = box("b", 300, 0, 100, 50);
  const below = box("c", 0, 300, 100, 50);
  const byId = { a, b, c: below };

  it("leaves by the facing sides when the file names none", () => {
    expect(jc.facing(a, b)).toBe("right");
    expect(jc.facing(b, a)).toBe("left");
    expect(jc.facing(a, below)).toBe("bottom");
    const geo = jc.edgePath({ fromNode: "a", toNode: "b", fromSide: "", toSide: "", toEnd: "arrow", fromEnd: "none" }, byId);
    expect(geo.d.startsWith("M 100 25 C")).toBe(true);
    expect(geo.d.endsWith("300 25")).toBe(true);
    expect(geo.middle).toEqual({ x: 200, y: 25 });
  });

  it("draws a head at each arrow end, pointing into its node", () => {
    const geo = jc.edgePath({ fromNode: "a", toNode: "b", fromSide: "right", toSide: "left", toEnd: "arrow", fromEnd: "arrow" }, byId);
    expect(geo.arrows).toHaveLength(2);
    // Into b from the left: the tip at b's left side, the base before it.
    expect(geo.arrows[0]).toBe("300,25 288,31 288,19");
    expect(geo.arrows[1]).toBe("100,25 112,19 112,31");
    const none = jc.edgePath({ fromNode: "a", toNode: "c", fromSide: "bottom", toSide: "top", toEnd: "none", fromEnd: "none" }, byId);
    expect(none.arrows).toEqual([]);
    expect(none.d).toBe("M 50 50 C 50 175, 50 175, 50 300");
    expect(jc.edgePath({ fromNode: "a", toNode: "x" }, byId)).toBeNull();
  });
});

describe("what nodes show", () => {
  it("draws simple Markdown, everything escaped", () => {
    const html = jc.markdown(
      "# Title\n\nSome **bold**, *it*, ==mark== and `<code>`.\n- [ ] todo\n- done\n\n> quote\n\n```\n<b>raw</b>\n```\n[site](https://textus.md) [[Note|alias]] <script>x</script>",
    );
    expect(html).toContain("<h1>Title</h1>");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("<em>it</em>");
    expect(html).toContain("<mark>mark</mark>");
    expect(html).toContain("<code>&lt;code&gt;</code>");
    expect(html).toContain("<ul><li class=\"task\">☐ todo</li><li>done</li></ul>");
    expect(html).toContain("<blockquote>quote</blockquote>");
    expect(html).toContain("<pre><code>&lt;b&gt;raw&lt;/b&gt;</code></pre>");
    expect(html).toContain('<a data-href="https://textus.md">site</a>');
    expect(html).toContain('<span class="wikilink">alias</span>');
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
    // No link but http(s) and mailto, and no emphasis inside an address.
    expect(jc.markdown("[x](javascript:alert(1))")).not.toContain("data-href");
    expect(jc.markdown("[x](https://a.org/_b_/c)")).toContain('data-href="https://a.org/_b_/c"');
  });

  it("previews a note without its front matter, and names files", () => {
    const text = "---\ntags: [a]\n---\n\n# Plan\nline 2\nline 3\nline 4";
    expect(jc.notePreview(text, 3)).toBe("# Plan\nline 2\nline 3");
    expect(jc.fileKind("a/b.md")).toBe("note");
    expect(jc.fileKind("pic.PNG")).toBe("image");
    expect(jc.fileKind("x.pdf")).toBe("other");
    expect(jc.mimeOf("d.svg")).toBe("image/svg+xml");
    expect(jc.titleOf("Notes/Plan.md")).toBe("Plan");
    expect(jc.subpathPlace("#Goals")).toEqual({ heading: "Goals" });
    expect(jc.subpathPlace("#^ab12cd")).toEqual({ block: "ab12cd" });
    expect(jc.subpathPlace("")).toEqual({});
  });
});

describe("Excalidraw", () => {
  const note = [
    "---",
    "excalidraw-plugin: parsed",
    "---",
    "==⚠  Switch to EXCALIDRAW VIEW ⚠==",
    "",
    "![[Drawing 1.svg|600]]",
    "![alt](Exports/My%20Drawing.png)",
    "![web](https://x.org/a.png)",
    "",
    "# Excalidraw Data",
    "## Embedded Files",
    "abc123: [[Pasted image.png]]",
    "%%",
    "![[Hidden.png]]",
    "## Drawing",
    "```compressed-json",
    "![[InCode.png]]",
    "```",
    "%%",
  ].join("\n");

  it("finds the pictures the note embeds, not the drawing's own data", () => {
    expect(jc.excalidrawEmbeds(note)).toEqual(["Drawing 1.svg", "Exports/My Drawing.png"]);
    expect(jc.excalidrawEmbeds("![[Other note]]")).toEqual([]);
  });

  it("knows where auto-export writes its pictures", () => {
    expect(jc.excalidrawExports("/v/Drawing.excalidraw.md")).toEqual([
      "/v/Drawing.excalidraw.svg",
      "/v/Drawing.excalidraw.png",
      "/v/Drawing.svg",
      "/v/Drawing.png",
    ]);
    expect(jc.excalidrawExports("/v/Drawing.excalidraw")[0]).toBe("/v/Drawing.excalidraw.svg");
    expect(jc.excalidrawExports("/v/Plain.md")).toEqual([]);
  });
});

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/** Timeline's draw.js on a stand-in DOM that keeps attributes and text. */
const draw = readFileSync(
  new URL("../plugins/catvinci.timeline/draw.js", import.meta.url),
  "utf8",
);
type Node = {
  name: string;
  attrs: Record<string, string>;
  children: Node[];
  textContent?: string;
};
const document = {
  createElementNS: (_ns: string, name: string) => {
    const node = {
      name,
      attrs: {} as Record<string, string>,
      children: [] as Node[],
      setAttribute: (k: string, v: unknown) => void (node.attrs[k] = String(v)),
      append: (child: Node) => void node.children.push(child),
    };
    return node;
  },
};
const chartColors = () => ({ ink: "#000", muted: "#888", tones: ["#00f"] });
const { timeline } = new Function(
  "document",
  "chartColors",
  "drawChartBlock",
  draw + "\nreturn { timeline };",
)(document, chartColors, () => {}) as {
  timeline: (s: string, w: number, dark: boolean, look: object) => Node;
};
// Every character 0.6 em wide.
const look = {
  family: "serif",
  size: 15,
  small: 13,
  measure: (text: string, px: number) => text.length * px * 0.6,
};
const texts = (svg: Node) => svg.children.filter((n) => n.name === "text");
const left = (n: Node) => {
  const x = Number(n.attrs.x);
  const w = look.measure(n.textContent!, Number(n.attrs["font-size"]));
  return n.attrs["text-anchor"] === "end" ? x - w : x;
};
const right = (n: Node) => left(n) + look.measure(n.textContent!, Number(n.attrs["font-size"]));

describe("timeline", () => {
  it("keeps long words and labels inside a narrow island, in the theme's font", () => {
    const svg = timeline(
      "2024-03-15 09:30 | The outline and two chapters | Sent to the editor for a first read\n2025 | 出版了第一本书，大家都很喜欢",
      260,
      false,
      look,
    );
    expect(svg.attrs["font-family"]).toBe("serif");
    for (const t of texts(svg)) {
      expect(left(t)).toBeGreaterThanOrEqual(0);
      expect(right(t)).toBeLessThanOrEqual(260);
    }
    expect(texts(svg).map((t) => t.textContent).join(" ")).toContain("The outline");
  });

  it("sets the axis after the widest date on a wide frame", () => {
    const svg = timeline("2024-03-15 09:30 | Draft\n1999 | Start", 700, false, look);
    for (const t of texts(svg)) expect(left(t)).toBeGreaterThanOrEqual(0);
    const line = svg.children.find((n) => n.name === "line")!;
    expect(Number(line.attrs.x1)).toBeGreaterThan(look.measure("2024-03-15 09:30", 13));
  });

  it("says what to write when there are no events", () => {
    expect(() => timeline("| no date", 600, false, look)).toThrow(/when \| what/);
  });
});

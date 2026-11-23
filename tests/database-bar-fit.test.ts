import { beforeAll, describe, expect, it } from "vitest";

/** catvinci.database/bar-fit.js's one-line test, on stand-in elements
 *  measured as WebKit measured a zoomed block's bar. */
type Box = { id?: string; top: number; height: number; hidden?: boolean };
let fits: ($: (id: string) => unknown, bar: unknown) => boolean;
let start: ($: (id: string) => unknown) => void;
let more: (root: unknown, x: number, y: number, inTab: boolean, innerHeight?: number) => { right: boolean; below: boolean };

beforeAll(async () => {
  const script = "../plugins/catvinci.database/bar-fit.js";
  (globalThis as Record<string, unknown>).window = globalThis;
  await import(/* @vite-ignore */ script);
  fits = (globalThis as Record<string, never>).databaseBarFits;
  start = (globalThis as Record<string, never>).databaseBarFit;
  more = (globalThis as Record<string, never>).databaseMore;
});

const el = (b: Box, children: unknown[] = []) => ({
  id: b.id ?? "",
  offsetTop: b.top,
  offsetHeight: b.hidden ? 0 : b.height,
  offsetParent: b.hidden ? null : {},
  scrollWidth: 100,
  clientWidth: 100,
  children,
  querySelector: () => null,
  contains: (n: unknown) => children.includes(n),
});

function bar(items: Box[]) {
  const tab = el({ top: 0, height: 28 });
  const parts = items.map((b) => (b.id === "views" ? el(b, [tab]) : el(b)));
  const all = el({ top: 0, height: 32 }, parts);
  const byId = (id: string) => parts.find((p) => p.id === id) ?? el({ id, top: 0, height: 0 });
  return fits(byId, all);
}

describe("a database's bar", () => {
  it("is on one line when its spacer's middle rounds past the first item's", () => {
    // WebKit, a block at zoom=90: the zero-height spacer's top, 17, is past
    // half the tabs' 32px, though every item is on the one line.
    expect(
      bar([
        { id: "views", top: 0, height: 32 },
        { id: "rules", top: 2, height: 29 },
        { id: "spacer", top: 17, height: 0 },
        { id: "count", top: 8, height: 18 },
        { id: "add", top: 1, height: 30 },
      ]),
    ).toBe(true);
  });

  it("is on two lines when an item starts below the first one's foot", () => {
    expect(
      bar([
        { id: "views", top: 0, height: 32 },
        { id: "spacer", top: 16, height: 0 },
        { id: "add", top: 40, height: 30 },
      ]),
    ).toBe(false);
  });
});

describe("a database's bar, measured again", () => {
  it("is measured once a frame, however many of its parts changed", () => {
    const g = globalThis as Record<string, unknown>;
    const watchers: (() => void)[] = [];
    const frames: (() => void)[] = [];
    g.ResizeObserver = class { observe() {} };
    g.MutationObserver = class {
      constructor(fn: () => void) {
        watchers.push(fn);
      }
      observe() {}
    };
    g.requestAnimationFrame = (fn: () => void) => frames.push(fn);
    g.document = { body: { clientWidth: 600 } };
    const part = (id: string) => ({ id, children: [], childElementCount: 0, dataset: {}, parentNode: null });
    const parts: Record<string, unknown> = { bar: part("bar"), rules: part("rules"), views: part("views") };
    start((id) => parts[id]);
    // A redraw replaces the view tabs and the sorts at once.
    for (const changed of watchers) changed();
    expect(frames).toHaveLength(1);
  });
});

describe("a database block's foot", () => {
  const root = { scrollWidth: 600, clientWidth: 600, scrollHeight: 960, clientHeight: 560 };
  it("fades while rows are below it in a document, not at the end", () => {
    expect(more(root, 0, 0, false).below).toBe(true);
    expect(more(root, 0, 400, false).below).toBe(false);
  });
  it("doesn't for a table that fits, or in a tab of its own", () => {
    expect(more({ ...root, scrollHeight: 560 }, 0, 0, false).below).toBe(false);
    expect(more(root, 0, 0, true).below).toBe(false);
  });
  it("doesn't for the height a sideways scroll bar takes from a table that fits", () => {
    // Classic scroll bars (Windows, Linux): 13px of a 203px frame.
    const wide = { scrollWidth: 900, clientWidth: 600, scrollHeight: 202, clientHeight: 190 };
    expect(more(wide, 0, 0, false, 203)).toEqual({ right: true, below: false });
  });
});

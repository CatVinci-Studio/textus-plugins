import { beforeAll, expect, it } from "vitest";

/** The graph's page by touch (plugins/catvinci.graph/graph-view.js): no
 *  hover, so a first tap lights a note's links and a second opens it. */

type Handler = (e: Record<string, unknown>) => void;
const onCanvas: Record<string, Handler[]> = {};
const opened: string[] = [];
let lit = 0;

beforeAll(async () => {
  const g = globalThis as Record<string, unknown>;
  g.window = g;
  g.addEventListener = () => {};
  g.removeEventListener = () => {};
  g.devicePixelRatio = 1;
  g.requestAnimationFrame = () => 0;
  g.getComputedStyle = () => ({ getPropertyValue: () => "", fontSize: "11px" });
  g.ResizeObserver = class {
    constructor(private fn: () => void) {}
    observe() {
      this.fn();
    }
  };
  g.MutationObserver = class {
    observe() {}
  };
  g.document = {
    documentElement: {},
    body: { append() {} },
    getElementById: () => null,
    createElement: () => ({ style: {} }),
  };
  await import(/* @vite-ignore */ "../plugins/catvinci.graph/graph-forces.js");
  await import(/* @vite-ignore */ "../shared/drag.js");
  await import(/* @vite-ignore */ "../plugins/catvinci.graph/graph-view.js");
  // Counts the frames drawn with the accent: a lit note.
  const ctx = new Proxy(
    { measureText: () => ({ width: 10 }) } as Record<string, unknown>,
    {
      get: (t, k) => (k in t ? t[k] : () => {}),
      set: (t, k, v) => {
        if (k === "fillStyle" && v === "accent") lit++;
        t[k as string] = v;
        return true;
      },
    },
  );
  g.getComputedStyle = () => ({
    getPropertyValue: (name: string) =>
      name === "--ui-accent" ? "accent" : "",
    fontSize: "11px",
  });
  const canvas = {
    style: {},
    getContext: () => ctx,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 400, height: 400 }),
    addEventListener: (type: string, fn: Handler) =>
      (onCanvas[type] ??= []).push(fn),
  };
  const view = (
    g.createGraphView as (
      c: unknown,
      o: unknown,
    ) => {
      setData: (d: unknown) => void;
      zoomToFit: () => void;
    }
  )(canvas, { onOpen: (id: string) => opened.push(id) });
  view.setData({ nodes: [{ id: "a.md", name: "a", kind: "note" }], edges: [] });
  view.zoomToFit();
});

/** A press and release on the middle, where the one note sits once fitted. */
function tap(pointerType: string) {
  const e = {
    button: 0,
    pointerType,
    pointerId: 1,
    clientX: 200,
    clientY: 200,
  };
  onCanvas.pointerdown.forEach((fn) => fn(e));
  onCanvas.pointerleave.forEach((fn) => fn(e));
  onCanvas.click.forEach((fn) => fn(e));
}

it("lights a note at the first tap and opens it at the second", () => {
  lit = 0;
  tap("touch");
  expect(opened).toEqual([]);
  expect(lit).toBeGreaterThan(0);
  tap("touch");
  expect(opened).toEqual(["a.md"]);
});

it("opens at once with a mouse click", () => {
  opened.length = 0;
  tap("mouse");
  expect(opened).toEqual(["a.md"]);
});

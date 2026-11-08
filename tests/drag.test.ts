import { beforeAll, describe, expect, it } from "vitest";

/** shared/drag.js on a page drawn at a zoom, with just enough of a DOM. */

type Handler = (e: Record<string, unknown>) => void;
const listeners: Record<string, Handler[]> = {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let drag: any;

function node(rect: {
  left: number;
  top: number;
  width: number;
  height: number;
}) {
  const style: Record<string, string> = {};
  const n = {
    style,
    classList: { add() {}, remove() {} },
    parentNode: null as unknown,
    nextSibling: null,
    remove() {},
    // The page is zoomed 1.5×: what it is told in its own pixels shows larger.
    cloneNode: () => {
      const ghost = node(rect);
      ghost.getBoundingClientRect = () => ({
        ...rect,
        width: parseFloat(ghost.style.width) * 1.5,
        right: 0,
        bottom: 0,
      });
      return ghost;
    },
    getBoundingClientRect: () => ({
      ...rect,
      right: rect.left + rect.width,
      bottom: rect.top + rect.height,
    }),
  };
  return n;
}

beforeAll(async () => {
  const g = globalThis as Record<string, unknown>;
  g.window = g;
  g.addEventListener = (type: string, fn: Handler) =>
    (listeners[type] ??= []).push(fn);
  g.removeEventListener = (type: string, fn: Handler) => {
    listeners[type] = (listeners[type] ?? []).filter((f) => f !== fn);
  };
  g.getSelection = () => ({ removeAllRanges() {} });
  g.document = { body: { style: { userSelect: "" }, append() {} } };
  const script = "../shared/drag.js";
  await import(/* @vite-ignore */ script);
  drag = g.drag;
});

const fire = (type: string, x: number, y: number) =>
  [...(listeners[type] ?? [])].forEach((fn) =>
    fn({ clientX: x, clientY: y, preventDefault() {} }),
  );

describe("dragging on a zoomed page", () => {
  it("keeps the copy under the pointer and selects no text on the way", () => {
    const item = node({ left: 300, top: 60, width: 150, height: 30 });
    const list = node({ left: 0, top: 50, width: 900, height: 50 });
    item.parentNode = list;
    const ghosts: ReturnType<typeof node>[] = [];
    const body = (
      globalThis as unknown as {
        document: {
          body: { append: (g: unknown) => void; style: { userSelect: string } };
        };
      }
    ).document.body;
    body.append = (g) => void ghosts.push(g as ReturnType<typeof node>);
    drag.sortable(
      { button: 0, clientX: 330, clientY: 70 },
      { item, lists: () => [], itemsOf: () => [item], onDrop() {} },
    );
    fire("pointermove", 430, 70);
    expect(body.style.userSelect).toBe("none");
    const ghost = ghosts[0];
    // The pointer is 30 px into the item; at 1.5× the copy's own pixels are
    // the screen's divided by 1.5.
    expect(parseFloat(ghost.style.left)).toBeCloseTo((430 - 30) / 1.5);
    expect(parseFloat(ghost.style.width)).toBeCloseTo(150 / 1.5);
    fire("pointerup", 430, 70);
    expect(body.style.userSelect).toBe("");
  });
});

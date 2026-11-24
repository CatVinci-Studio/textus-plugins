import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

/** shared/drag.js with just enough of a DOM: a page drawn at a zoom, a
 *  finger that holds before it drags, a scroller near its edge. */

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
    nodeType: 1,
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
  g.requestAnimationFrame = (cb: (now: number) => void) =>
    setTimeout(() => cb(Date.now()), 16);
  g.cancelAnimationFrame = (id: number) => clearTimeout(id);
  const script = "../shared/drag.js";
  await import(/* @vite-ignore */ script);
  drag = g.drag;
});

const fire = (type: string, x: number, y: number) =>
  send(type, { clientX: x, clientY: y });

/** An event to every listener of `type`; what they did to it. */
function send(type: string, props: Record<string, unknown> = {}) {
  const e = {
    prevented: false,
    stopped: false,
    cancelable: true,
    preventDefault() {
      e.prevented = true;
    },
    stopPropagation() {
      e.stopped = true;
    },
    ...props,
  };
  [...(listeners[type] ?? [])].forEach((fn) => fn(e));
  return e;
}

afterEach(() => {
  vi.useRealTimers();
});

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

const finger = (x: number, y: number) => ({
  button: 0,
  pointerType: "touch",
  clientX: x,
  clientY: y,
});

function recorder() {
  const calls: string[] = [];
  return {
    calls,
    handlers: {
      start: (x: number, y: number) => void calls.push(`start ${x},${y}`),
      move: (x: number, y: number) => void calls.push(`move ${x},${y}`),
      end: (x: number, y: number, dropped: boolean) =>
        void calls.push(`end ${x},${y} ${dropped}`),
      held: (x: number, y: number) => void calls.push(`held ${x},${y}`),
    },
  };
}

describe("a finger, as Textus's own lists take one", () => {
  it("that moves before it has held still scrolls, and drags nothing", () => {
    vi.useFakeTimers();
    const { calls, handlers } = recorder();
    drag.track(finger(100, 100), handlers);
    fire("pointermove", 100, 130);
    vi.advanceTimersByTime(1000);
    fire("pointermove", 100, 160);
    fire("pointerup", 100, 160);
    expect(calls).toEqual([]);
    expect(listeners.pointermove ?? []).toEqual([]);
  });

  it("held still lifts; the page doesn't scroll under it; letting go drops", () => {
    vi.useFakeTimers();
    const { calls, handlers } = recorder();
    drag.track(finger(100, 100), handlers);
    fire("pointermove", 104, 102);
    expect(send("touchmove").prevented).toBe(false);
    vi.advanceTimersByTime(300);
    expect(calls).toEqual(["start 100,100"]);
    expect(send("touchmove").prevented).toBe(true);
    // Under 5 px from the press: still where it was.
    fire("pointermove", 102, 101);
    fire("pointermove", 100, 140);
    fire("pointerup", 100, 140);
    expect(calls).toEqual([
      "start 100,100",
      "move 100,140",
      "end 100,140 true",
    ]);
    expect(send("touchmove").prevented).toBe(false);
    // The click its release sends is no click on the item.
    expect(send("click").stopped).toBe(true);
  });

  it("lifted and let go where it was is a long press: nothing dropped, no menu of the web view's", () => {
    vi.useFakeTimers();
    const { calls, handlers } = recorder();
    drag.track(finger(100, 100), handlers);
    vi.advanceTimersByTime(300);
    const menu = send("contextmenu");
    expect(menu.prevented && menu.stopped).toBe(true);
    fire("pointerup", 101, 100);
    expect(calls).toEqual([
      "start 100,100",
      "end 101,100 false",
      "held 101,100",
    ]);
  });

  it("joined by a second finger before it has held still is a pinch: nothing lifts", () => {
    vi.useFakeTimers();
    const { calls, handlers } = recorder();
    drag.track({ ...finger(100, 100), pointerId: 1 }, handlers);
    send("pointerdown", { pointerId: 2, clientX: 200, clientY: 200 });
    vi.advanceTimersByTime(1000);
    fire("pointerup", 100, 100);
    expect(calls).toEqual([]);
    expect(listeners.pointerdown ?? []).toEqual([]);
  });

  it("on a surface that takes every touch itself drags at once", () => {
    const { calls, handlers } = recorder();
    drag.track(finger(100, 100), handlers, { hold: false });
    fire("pointermove", 100, 110);
    fire("pointerup", 100, 110);
    expect(calls).toEqual([
      "start 100,100",
      "move 100,110",
      "end 100,110 true",
    ]);
  });
});

describe("a mouse", () => {
  it("drags once it moves 5 px, and Esc puts it back", () => {
    const { calls, handlers } = recorder();
    drag.track({ button: 0, clientX: 10, clientY: 10 }, handlers);
    fire("pointermove", 13, 10);
    expect(calls).toEqual([]);
    fire("pointermove", 20, 10);
    send("keydown", { key: "Escape" });
    expect(calls).toEqual(["start 10,10", "move 20,10", "end 10,10 false"]);
    expect(listeners.pointermove ?? []).toEqual([]);
  });
});

describe("near a scroller's edge", () => {
  it("goes faster the further in, up to a limit", () => {
    expect(drag.edgeStep(500, 0, 1000)).toBe(0);
    expect(drag.edgeStep(990, 0, 1000)).toBe(9);
    expect(drag.edgeStep(5, 0, 1000)).toBe(-11);
    expect(drag.edgeStep(2000, 0, 1000)).toBe(40);
  });

  function board(snap: string, tall = false, at = { x: 395, y: 110 }) {
    const g = globalThis as Record<string, unknown>;
    g.innerWidth = 400;
    g.innerHeight = 800;
    const scrolls: number[] = [];
    const el = {
      nodeType: 1,
      parentNode: null,
      scrollWidth: 2000,
      clientWidth: 400,
      scrollHeight: tall ? 3000 : 800,
      scrollTop: 0,
      clientHeight: 800,
      scrollLeft: 0,
      style: { snap },
      scrollBy: (by: { left: number }) => void scrolls.push(by.left),
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        right: 400,
        bottom: 800,
        width: 400,
        height: 800,
      }),
    };
    g.getComputedStyle = (n: { style: { snap?: string } }) =>
      n === el
        ? { overflowX: "auto", overflowY: "auto", scrollSnapType: snap }
        : {
            overflowX: "visible",
            overflowY: "visible",
            scrollSnapType: "none",
          };
    const list = node({ left: 16, top: 0, width: 368, height: 800 });
    list.parentNode = el;
    const item = node({ left: 30, top: 100, width: 340, height: 40 });
    item.parentNode = list;
    drag.sortable(
      { button: 0, clientX: 200, clientY: 110 },
      { item, lists: () => [], itemsOf: () => [item], onDrop() {} },
    );
    fire("pointermove", at.x, at.y);
    return { el, scrolls };
  }

  it("scrolls on while the pointer rests there", () => {
    vi.useFakeTimers();
    const { el } = board("none");
    vi.advanceTimersByTime(500);
    expect(el.scrollLeft).toBeGreaterThan(100);
    fire("pointerup", 395, 110);
  });

  it("turns one page at a time where the scroller snaps (a list per screen)", () => {
    vi.useFakeTimers();
    const { el, scrolls } = board("x mandatory");
    vi.advanceTimersByTime(500);
    expect(scrolls).toEqual([]);
    vi.advanceTimersByTime(200);
    expect(scrolls).toEqual([400]);
    vi.advanceTimersByTime(500);
    expect(scrolls).toEqual([400]);
    vi.advanceTimersByTime(200);
    expect(scrolls).toEqual([400, 400]);
    expect(el.scrollLeft).toBe(0);
    fire("pointerup", 395, 110);
  });
  it("scrolls down a board that snaps only across", () => {
    vi.useFakeTimers();
    const { el, scrolls } = board("x mandatory", true, { x: 200, y: 795 });
    vi.advanceTimersByTime(800);
    expect(el.scrollTop).toBeGreaterThan(100);
    expect(scrolls).toEqual([]);
    fire("pointerup", 200, 795);
  });
});

describe("a board's columns", () => {
  it("take a card a finger lets go below a short column's last card", () => {
    vi.useFakeTimers();
    const g = globalThis as Record<string, unknown>;
    g.innerWidth = 1000;
    g.innerHeight = 800;
    g.getComputedStyle = () => ({
      overflowX: "visible",
      overflowY: "visible",
      scrollSnapType: "none",
    });
    const column = (left: number, height: number) => {
      const l = node({ left, top: 50, width: 200, height });
      const kids: unknown[] = [];
      return Object.assign(l, {
        kids,
        append(n: { parentNode: unknown }) {
          kids.push(n);
          n.parentNode = l;
        },
      });
    };
    const first = column(0, 600);
    const second = column(250, 60);
    const item = node({ left: 10, top: 60, width: 180, height: 40 });
    item.parentNode = first;
    first.kids.push(item);
    let dropped: unknown = null;
    drag.sortable(
      finger(50, 70),
      {
        item,
        lists: () => [first, second],
        itemsOf: (l: { kids: unknown[] }) =>
          l.kids.filter((n) => (n === item ? item.parentNode === l : true)),
        onDrop: (list: unknown, index: number) => (dropped = [list, index]),
      },
    );
    vi.advanceTimersByTime(300);
    fire("pointermove", 300, 400);
    fire("pointerup", 300, 400);
    expect(dropped).toEqual([second, 0]);
  });
});

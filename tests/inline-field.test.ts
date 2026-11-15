import { beforeAll, describe, expect, it } from "vitest";

/** shared/inline-field.js on a stand-in field. */
type Handler = (e: Record<string, unknown>) => void;
let inlineField: (field: unknown, finish: (keep: boolean) => void, multiline?: boolean) => void;

beforeAll(async () => {
  const script = "../shared/inline-field.js";
  await import(/* @vite-ignore */ script);
  inlineField = (globalThis as Record<string, never>).inlineField;
});

function field(multiline = false) {
  const on: Record<string, Handler> = {};
  const attrs = new Set<string>();
  const calls: boolean[] = [];
  const node = {
    addEventListener: (type: string, fn: Handler) => void (on[type] = fn),
    hasAttribute: (name: string) => attrs.has(name),
  };
  inlineField(node, (keep) => calls.push(keep), multiline);
  const key = (key: string, more: Record<string, unknown> = {}) =>
    on.keydown({ key, preventDefault() {}, ...more });
  return { on, attrs, calls, key };
}

describe("an inline field", () => {
  it("keeps on Enter and drops on Esc", () => {
    const f = field();
    f.key("Enter");
    f.key("Escape");
    expect(f.calls).toEqual([true, false]);
  });

  it("lets an input method's Enter pick its words", () => {
    const f = field();
    f.key("Enter", { isComposing: true });
    f.key("Enter", { keyCode: 229 });
    expect(f.calls).toEqual([]);
  });

  it("keeps a multiline field open on a plain Enter", () => {
    const f = field(true);
    f.key("Enter");
    f.key("Enter", { metaKey: true });
    expect(f.calls).toEqual([true]);
  });

  it("stays open while Textus's text menu is over it", () => {
    const f = field();
    f.attrs.add("data-menu-open");
    f.on.blur({});
    expect(f.calls).toEqual([]);
    f.attrs.delete("data-menu-open");
    f.on.blur({});
    expect(f.calls).toEqual([true]);
  });
});

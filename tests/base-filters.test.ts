import { beforeAll, describe, expect, it } from "vitest";

/** A view's filters as rules are added (shared/base-filters.js). */
type Filter = { key: string; op: string; value: string; raw?: string };
let merge: (filters: Filter[], next: Filter) => Filter[];

beforeAll(async () => {
  const script = "../shared/base-filters.js";
  await import(/* @vite-ignore */ script);
  merge = (globalThis as unknown as { baseFilters: { merge: typeof merge } })
    .baseFilters.merge;
});

const f = (key: string, op: string, value = ""): Filter => ({ key, op, value });

describe("a filter added to a view", () => {
  it("is kept once", () => {
    const one = [f("status", "=", "Done")];
    expect(merge(one, f("status", "=", "Done"))).toBe(one);
  });

  it("takes the place of the one it contradicts", () => {
    expect(merge([f("status", "=", "Done")], f("status", "=", "Doing"))).toEqual([
      f("status", "=", "Doing"),
    ]);
    expect(merge([f("due", "empty")], f("due", "!empty"))).toEqual([f("due", "!empty")]);
    expect(merge([f("rating", ">", "2")], f("rating", ">", "3"))).toEqual([f("rating", ">", "3")]);
  });

  it("adds to rules that can stand together, and leaves hand-written ones", () => {
    const raw = { key: "", op: "", value: "", raw: 'status == "Done"' };
    expect(merge([f("tags", "has", "ml"), raw], f("tags", "has", "ai"))).toEqual([
      f("tags", "has", "ml"),
      raw,
      f("tags", "has", "ai"),
    ]);
    expect(merge([f("status", "!=", "Done")], f("status", "!=", "Doing"))).toHaveLength(2);
    expect(merge([f("rating", ">", "2")], f("rating", "<", "5"))).toHaveLength(2);
  });
});

describe("a rule of several values", () => {
  type Rule = { key: string; op: string; value: string | string[]; raw?: string };
  const api = () =>
    (globalThis as unknown as {
      baseFilters: { text: (f: Rule) => string; read: (s: string) => Rule };
    }).baseFilters;

  it("is written with || and read back as one rule", () => {
    const { text, read } = api();
    const any = { key: "status", op: "in", value: ["To do", "Doing"] };
    expect(text(any)).toBe('(status == "To do" || status == "Doing")');
    expect(read(text(any))).toEqual(any);
    const none = { key: "status", op: "!in", value: ["Done"] };
    expect(text(none)).toBe('!(status == "Done")');
    expect(read(text(none))).toEqual(none);
    const tags = { key: "my tags", op: "hasAny", value: ["a", "b || c"] };
    expect(text(tags)).toBe('(note["my tags"].contains("a") || note["my tags"].contains("b || c"))');
    expect(read(text(tags))).toEqual(tags);
  });

  it("leaves a mixed or hand-written group as written, and plain rules as they were", () => {
    const { read } = api();
    expect(read('status == "A" || rating > 3')).toEqual({ raw: 'status == "A" || rating > 3' });
    expect(read('status == "Done"')).toEqual({ key: "status", op: "=", value: "Done" });
  });

  it("takes the place of a single value on the same property", () => {
    expect(
      merge([f("status", "=", "Done")], { key: "status", op: "in", value: ["A", "B"] } as never),
    ).toEqual([{ key: "status", op: "in", value: ["A", "B"] }]);
  });
});

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

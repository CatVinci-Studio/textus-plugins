import { beforeAll, describe, expect, it } from "vitest";
import { load } from "js-yaml";

/** The YAML of a base (plugins/catvinci.database/yaml.js). */
let y: { parse: (s: string) => unknown; stringify: (v: unknown) => string };

beforeAll(async () => {
  const script = "../shared/yaml.js";
  await import(/* @vite-ignore */ script);
  y = (globalThis as unknown as { yaml: typeof y }).yaml;
});

// Obsidian's own example base, as its help page gives it.
const OBSIDIAN = `filters:
  or:
    - file.hasTag("tag")
    - and:
        - file.hasTag("book")
        - file.hasLink("Textbook")
        - not:
            - file.hasTag("book")
            - file.inFolder("Required Reading")
formulas:
  formatted_price: 'if(price, price.toFixed(2) + " dollars")'
  ppu: "(price / age).toFixed(2)"
properties:
  status:
    displayName: Status
  formula.formatted_price:
    displayName: "Price"
  file.ext:
    displayName: Extension
summaries:
  customAverage: 'values.mean().round(3)'
views:
  - type: table
    name: "My table"
    limit: 10
    groupBy:
      property: note.age
      direction: DESC
    filters:
      and:
        - 'status != "done"'
        - or:
            - "formula.ppu > 5"
            - "price > 2.1"
    order:
      - file.name
      - file.ext
      - note.age
    summaries:
      formula.ppu: Average
  - type: cards
    name: Gallery # a comment
    order: [file.name, "a, b", 'it''s']
    groupOrder: []
`;

describe("a base's YAML", () => {
  it("reads Obsidian's example as a full YAML reader does", () => {
    expect(y.parse(OBSIDIAN)).toEqual(load(OBSIDIAN));
  });

  it("writes it back so it reads the same", () => {
    const value = y.parse(OBSIDIAN);
    const text = y.stringify(value);
    expect(load(text)).toEqual(value);
    expect(y.parse(text)).toEqual(value);
    // As Obsidian writes it: two spaces, lists under their key.
    expect(text).toContain("views:\n  - type: table\n    name: My table\n");
    expect(text).toContain("  or:\n    - file.hasTag(\"tag\")\n");
  });

  it("keeps lists at their key's indent, block text, and values that look like numbers", () => {
    const text = "views:\n- type: kanban\n  name: Board\n  groupOrder:\n  - Not Started\n  - '2025'\n  - 2026\nnote: |\n  one\n  two\n";
    expect(y.parse(text)).toEqual(load(text));
    const back = y.stringify(y.parse(text));
    expect(load(back)).toEqual(load(text));
  });
});

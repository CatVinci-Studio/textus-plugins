import { readFileSync } from "node:fs";
import { expect, it } from "vitest";

/** The Cisco IOS grammar read as Textus reads a plugin's code language
 *  (the app's src/editor/code/code-grammar.ts): a line at a time, at each
 *  place the first rule matching there, else one character plain. */
const grammar = JSON.parse(
  readFileSync(new URL("../plugins/catvinci.cisco-ios/cisco.json", import.meta.url), "utf8"),
) as { flags: string; rules: { token: string; match: string; flags?: string }[] };
const rules = grammar.rules.map((r) => ({ token: r.token, re: new RegExp(r.match, `${r.flags ?? grammar.flags}y`) }));

function tokens(line: string): [string, string][] {
  const out: [string, string][] = [];
  for (let pos = 0; pos < line.length; ) {
    const hit = rules
      .map(({ token, re }) => ((re.lastIndex = pos), [token, re.exec(line)?.[0] ?? ""] as const))
      .find(([, text]) => text.length);
    if (!hit) pos++;
    else (out.push([hit[1], hit[0]]), (pos += hit[1].length));
  }
  return out;
}

it("keeps to what Textus accepts in a grammar", () => {
  const TOKENS = ["comment", "string", "number", "constant", "keyword", "operator", "function", "type", "tag", "attribute", "punctuation"];
  for (const { token, match } of grammar.rules) {
    expect(TOKENS).toContain(token);
    // No backreference or lookbehind; no group repeated without bound.
    expect(match).not.toMatch(/\\[1-9]|\\k<|\(\?<[=!]|\)[*+]|\)\{\d+,\}/);
  }
});

it("colours commands, interfaces, addresses and comments", () => {
  expect(tokens(" ! core link")).toEqual([[" ! core link", "comment"]]);
  expect(tokens("interface GigabitEthernet0/1.10")).toEqual([
    ["interface", "keyword"],
    ["GigabitEthernet0/1.10", "type"],
  ]);
  expect(tokens(" ip address 192.168.1.1 255.255.255.0")).toEqual([
    ["ip", "keyword"],
    ["address", "keyword"],
    ["192.168.1.1", "number"],
    ["255.255.255.0", "number"],
  ]);
  expect(tokens("access-list 101 permit tcp any host 10.0.0.5 eq www")).toEqual([
    ["access-list", "keyword"],
    ["101", "number"],
    ["permit", "keyword"],
    ["tcp", "constant"],
    ["any", "keyword"],
    ["host", "keyword"],
    ["10.0.0.5", "number"],
    ["eq", "keyword"],
    ["www", "constant"],
  ]);
  expect(tokens("router ospf 1")).toEqual([
    ["router", "keyword"],
    ["ospf", "keyword"],
    ["1", "number"],
  ]);
  expect(tokens(" NO SHUTDOWN")).toEqual([
    ["NO", "keyword"],
    ["SHUTDOWN", "keyword"],
  ]);
  expect(tokens(" description uplink interface")).toEqual([["description uplink interface", "string"]]);
  expect(tokens(" ip route 0.0.0.0/0 Gi0/0")).toEqual([
    ["ip", "keyword"],
    ["route", "keyword"],
    ["0.0.0.0/0", "number"],
    ["Gi0/0", "type"],
  ]);
  // A word that holds a keyword isn't one.
  expect(tokens("hostname shipyard")).toEqual([["hostname", "keyword"]]);
});

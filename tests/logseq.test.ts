import { describe, expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

type Reader = {
  marker: string;
  notes: boolean;
  read(request: { root: string; text: string }): unknown;
};

function reader(): Reader {
  let found: Reader | null = null;
  loadPlugin("catvinci.logseq", {
    files: {
      registerConventionReader(_id: string, r: Reader) {
        found = r;
        return { dispose() {} };
      },
    },
  });
  return found!;
}

describe("Logseq folders", () => {
  it("reads a graph's config.edn as Textus's conventions", () => {
    const r = reader();
    expect(r.marker).toBe("logseq/config.edn");
    expect(r.notes).toBe(true);
    const text = [
      "{:meta/version 1",
      ' ;; :pages-directory "not-this"',
      ' :pages-directory "notes"',
      ' :journal/file-name-format "yyyy-MM-dd EEE"',
      ' :journals-directory "days"}',
    ].join("\n");
    expect(r.read({ root: "/g", text })).toEqual({
      linkStyle: "wiki",
      linkPath: "shortest",
      attachments: "assets",
      softBreaks: true,
      newNotes: "notes",
      daily: { folder: "days", format: "YYYY-MM-DD ddd" },
    });
  });

  it("takes Logseq's defaults where the file says nothing", () => {
    expect(reader().read({ root: "/g", text: "{}" })).toMatchObject({
      newNotes: "pages",
      daily: { folder: "journals", format: "YYYY_MM_DD" },
    });
  });
});

import { describe, expect, it, vi } from "vitest";
import { folder, loadPlugin, memoryStorage } from "./plugin-host";

/** Version History's tools for Textus AI (plugins/catvinci.version-history/host.js). */
async function setup() {
  const storage = memoryStorage();
  const files = { "Plan.md": "# Plan\n\none\ntwo\nthree\nfour\nfive\nsix\n" };
  const { tools } = loadPlugin(
    "catvinci.version-history",
    {
      files: folder(files),
      editor: { getPath: async () => "/root/Plan.md" },
    },
    storage,
  );
  const versions = [
    {
      at: Date.UTC(2026, 10, 2, 10),
      text: "# Plan\n\none\ntwo\nthree\nfour\nfive\nsix\n",
    },
    {
      at: Date.UTC(2026, 10, 1, 10),
      text: "# Plan\n\none\n2\nthree\nfour\nfive\nsix\nseven\n",
    },
  ];
  return { tools, storage, versions };
}

/** The plugin's storage held to `quota` characters of JSON, with keys. */
function smallStorage(quota: number) {
  const values = new Map<string, unknown>();
  const size = () =>
    [...values.values()].reduce<number>(
      (n, v) => n + JSON.stringify(v).length,
      0,
    );
  return {
    values,
    get: async (key: string) => values.get(key),
    set: async (key: string, value: unknown) => {
      const old = values.get(key);
      values.set(key, structuredClone(value));
      if (size() > quota) {
        if (old === undefined) values.delete(key);
        else values.set(key, old);
        throw new Error("The plugin's storage is full (50 MB).");
      }
    },
    delete: async (key: string) => void values.delete(key),
    keys: async () => [...values.keys()],
  };
}

/** The plugin with its History panel open on `path`; `save` as Textus
 *  sends a save, `post` as the panel sends a message. */
function withPanel(storage: ReturnType<typeof smallStorage>, path: string) {
  let save: (s: {
    path: string;
    text: string;
  }) => Promise<void> = async () => {};
  let resolve: (w: unknown) => Promise<void> = async () => {};
  let receive: (m: unknown) => Promise<void> = async () => {};
  const shown: { versions: { id: number; text: string }[]; full: boolean }[] =
    [];
  const opened: string[] = [];
  const doc = { path };
  loadPlugin(
    "catvinci.version-history",
    {
      files: { onDidSave: (fn: typeof save) => void (save = fn) },
      editor: { getPath: async () => doc.path, getText: async () => "" },
      layout: { openUntitled: async (text: string) => void opened.push(text) },
      views: {
        registerWebview: (_id: string, view: { resolve: typeof resolve }) =>
          void (resolve = view.resolve),
      },
    },
    storage as never,
  );
  const ready = resolve({
    postMessage: (m: (typeof shown)[number]) => void shown.push(m),
    onDidDispose: () => ({ dispose() {} }),
    onDidReceiveMessage: (fn: typeof receive) => void (receive = fn),
  });
  return {
    save: (text: string) => save({ path: doc.path, text }),
    post: (m: unknown) => receive(m),
    shown,
    opened,
    doc,
    ready,
  };
}

describe("version history keeps saves", () => {
  it("finds a version by its id after autosave merges into it", async () => {
    const now = vi.spyOn(Date, "now").mockReturnValue(1_000_000);
    const storage = smallStorage(1e6);
    const p = withPanel(storage, "/root/A.md");
    await p.ready;
    await p.save("one");
    now.mockReturnValue(1_000_000 + 20 * 60000);
    await p.save("one two");
    const id = p.shown.at(-1)!.versions[0].id;
    // An autosave inside the merge window writes the newest version alone,
    // not the list before it.
    const writes: string[] = [];
    const set = storage.set;
    storage.set = async (key, value) => {
      writes.push(key);
      return set(key, value);
    };
    now.mockReturnValue(1_000_000 + 21 * 60000);
    await p.save("one two three");
    expect(writes).toEqual([expect.stringMatching(/:now$/)]);
    expect(p.shown.at(-1)!.versions).toHaveLength(2);
    expect(p.shown.at(-1)!.versions[0].id).toBe(id);
    await p.post({ type: "open", id });
    expect(p.opened).toEqual(["one two three"]);
    now.mockRestore();
  });

  it("makes room from older documents when the storage is full", async () => {
    const now = vi.spyOn(Date, "now").mockReturnValue(1_000_000);
    const storage = smallStorage(450);
    const p = withPanel(storage, "/root/Old.md");
    await p.ready;
    await p.save("x".repeat(150));
    now.mockReturnValue(5_000_000);
    await p.save("y".repeat(150));
    p.doc.path = "/root/New.md";
    now.mockReturnValue(9_000_000);
    await p.save("z".repeat(150));
    expect(p.shown.at(-1)!.full).toBe(false);
    expect(p.shown.at(-1)!.versions.map((v) => v.text[0])).toEqual(["z"]);
    // The old document lost its oldest version, not all of them: its
    // newest is kept apart from the rest.
    const old = [...storage.values.values()]
      .filter((v) => (v as { path: string }).path === "/root/Old.md")
      .flatMap((v) => {
        const kept = v as {
          versions?: { text: string }[];
          version?: { text: string };
        };
        return kept.versions ?? (kept.version ? [kept.version] : []);
      });
    expect(old.map((v) => v.text[0])).toEqual(["y"]);
    now.mockRestore();
  });

  it("says so when even one version doesn't fit", async () => {
    const p = withPanel(smallStorage(100), "/root/A.md");
    await p.ready;
    await p.save("x".repeat(150));
    expect(p.shown.at(-1)).toMatchObject({ versions: [], full: true });
  });
});

describe("version history's tools", () => {
  it("list a document's versions, newest first", async () => {
    const { tools, storage, versions } = await setup();
    // Kept as the plugin keeps them: under its hash of the path.
    const keyOf = (path: string) => {
      let a = 0x811c9dc5;
      let b = 0x01000193;
      for (let i = 0; i < path.length; i++) {
        const c = path.charCodeAt(i);
        a = Math.imul(a ^ c, 0x01000193) >>> 0;
        b = Math.imul(b ^ c, 0x811c9dc5) >>> 0;
      }
      return (
        "v:" + a.toString(16).padStart(8, "0") + b.toString(16).padStart(8, "0")
      );
    };
    await storage.set(keyOf("/root/Plan.md"), {
      path: "/root/Plan.md",
      versions,
    });
    expect(await tools.get("list_versions")!({ path: "Plan" })).toEqual({
      document: "Plan.md",
      versions: [
        {
          version: 1,
          saved: "2026-11-02T10:00:00.000Z",
          lines: 9,
          characters: 36,
        },
        {
          version: 2,
          saved: "2026-11-01T10:00:00.000Z",
          lines: 10,
          characters: 40,
        },
      ],
    });
    const diff = await tools.get("diff_versions")!({ from: 2 });
    expect(diff).toMatchObject({
      document: "Plan.md",
      from: "version 2",
      to: "current",
    });
    expect(diff.diff).toBe(
      "…\n  \n  one\n+ two\n- 2\n  three\n  four\n  five\n  six\n- seven\n  ",
    );
    expect(await tools.get("diff_versions")!({ from: 1 })).toMatchObject({
      diff: "(no changes)",
    });
    expect(await tools.get("diff_versions")!({ from: 9 })).toHaveProperty(
      "error",
    );
  });
});

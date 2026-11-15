import { describe, expect, it, vi } from "vitest";
import { folder, loadPlugin } from "./plugin-host";

/** Version History (plugins/catvinci.version-history): its store, the
 *  panel's messages and its tools for Textus AI. */

/** The plugin's global place, keys and files, held to `quota` characters
 *  (a key's JSON, a file's text). */
function place(quota = 1e9) {
  const values = new Map<string, unknown>();
  const texts = new Map<string, string>();
  const size = () =>
    [...values.values()].reduce<number>((n, v) => n + JSON.stringify(v).length, 0) +
    [...texts.values()].reduce((n, t) => n + t.length, 0);
  const within = (undo: () => void) => {
    if (size() <= quota) return;
    undo();
    throw new Error("The plugin's storage is full (50 MB).");
  };
  return {
    values,
    texts,
    get: async (key: string) => structuredClone(values.get(key)),
    set: async (key: string, value: unknown) => {
      const old = values.get(key);
      values.set(key, structuredClone(value));
      within(() => (old === undefined ? values.delete(key) : values.set(key, old)));
    },
    delete: async (key: string) => void values.delete(key),
    keys: async () => [...values.keys()],
    readText: async (name: string) => {
      if (!texts.has(name)) throw new Error("no file");
      return texts.get(name)!;
    },
    writeText: async (name: string, text: string) => {
      const old = texts.get(name);
      texts.set(name, text);
      within(() => (old === undefined ? texts.delete(name) : texts.set(name, old)));
    },
    files: async () => [...texts.keys()],
    deleteFile: async (name: string) => void texts.delete(name),
  };
}

type Shown = {
  versions: { id: number; at: number; name?: string; pinned?: boolean; source: string }[];
  full: boolean;
};

/** The plugin with its History panel open on `path`. */
function withPanel(storage: ReturnType<typeof place>, path: string) {
  const on: Record<string, (e: never) => unknown> = {};
  const listen = (name: string) => (fn: (e: never) => unknown) => void (on[name] = fn);
  let resolve: (w: unknown) => Promise<void> = async () => {};
  let receive: (m: unknown) => Promise<void> = async () => {};
  const shown: Shown[] = [];
  const posted: Record<string, unknown>[] = [];
  const opened: string[] = [];
  const proposed: string[] = [];
  const doc = { path, text: "" };
  const disk: Record<string, string> = {};
  loadPlugin(
    "catvinci.version-history",
    {
      files: {
        onDidSave: listen("save"),
        onDidRename: listen("rename"),
        onDidDelete: listen("delete"),
        onDidChangeOnDisk: listen("disk"),
        readText: async (p: string) => disk[p] ?? Promise.reject(new Error("none")),
      },
      editor: {
        getPath: async () => doc.path,
        getText: async () => doc.text,
        getBlocks: async () => [{ id: "b1" }],
        propose: async (change: { text: string }) => void proposed.push(change.text),
        onDidChangeActive: listen("active"),
      },
      ui: { input: async () => "Sent to the editor" },
      layout: { openUntitled: async (text: string) => void opened.push(text) },
      views: {
        registerWebview: (_id: string, provider: { resolve: typeof resolve }) => void (resolve = provider.resolve),
      },
    },
    storage,
  );
  const settle = () => new Promise((r) => setTimeout(r, 5));
  const ready = (async () => {
    await resolve({
      set html(_: string) {},
      postMessage: (m: Record<string, unknown>) => {
        posted.push(m);
        if (m.type === "versions") shown.push(m as unknown as Shown);
      },
      onDidDispose: () => {},
      onDidReceiveMessage: (fn: typeof receive) => void (receive = fn),
    });
    await receive({ type: "ready" });
    await settle();
  })();
  const fire = async (name: string, e: unknown) => {
    await (on[name] as (e: unknown) => unknown)(e);
    await settle();
  };
  return {
    ready,
    doc,
    disk,
    shown,
    posted,
    opened,
    proposed,
    latest: () => shown.at(-1)!,
    save: (text: string) => fire("save", { path: doc.path, text }),
    fire,
    post: async (m: unknown) => {
      await receive(m);
      await settle();
    },
  };
}

const textOf = (storage: ReturnType<typeof place>, p: ReturnType<typeof withPanel>) =>
  async (id: number) => {
    await p.post({ type: "load", id, against: "current" });
    return (p.posted.findLast((m) => m.type === "texts" && m.id === id) as { from: string }).from;
  };

describe("version history keeps saves", () => {
  it("keeps the text from before the first save, and follows a rename", async () => {
    const storage = place();
    const p = withPanel(storage, "/root/A.md");
    await p.ready;
    p.disk["/root/A.md"] = "the original";
    await p.fire("active", undefined);
    await p.save("half of it");
    const read = textOf(storage, p);
    const ids = p.latest().versions.map((v) => v.id);
    expect(await Promise.all(ids.map(read))).toEqual(["half of it", "the original"]);
    // Texts asked for come alone: the list sent again would clear them.
    expect(p.posted.at(-1)!.type).toBe("texts");
    await p.fire("rename", { from: "/root", to: "/root2" });
    p.doc.path = "/root2/A.md";
    await p.fire("active", undefined);
    expect(p.latest().versions).toHaveLength(2);
  });

  it("merges saves close together into one version, its id kept", async () => {
    const now = vi.spyOn(Date, "now").mockReturnValue(1_000_000);
    const storage = place();
    const p = withPanel(storage, "/root/A.md");
    await p.ready;
    await p.save("one");
    now.mockReturnValue(1_000_000 + 20 * 60000);
    await p.save("one two");
    const id = p.latest().versions[0].id;
    now.mockReturnValue(1_000_000 + 21 * 60000);
    await p.save("one two three");
    expect(p.latest().versions).toHaveLength(2);
    expect(p.latest().versions[0].id).toBe(id);
    await p.post({ type: "open", id });
    expect(p.opened).toEqual(["one two three"]);
    now.mockRestore();
  });

  it("keeps each text once, however many versions and documents hold it", async () => {
    const now = vi.spyOn(Date, "now").mockReturnValue(1_000_000);
    const storage = place();
    const p = withPanel(storage, "/root/A.md");
    await p.ready;
    await p.save("same words");
    now.mockReturnValue(2_000_000 + 3600e3);
    await p.save("other");
    now.mockReturnValue(3_000_000 + 7200e3);
    await p.save("same words");
    p.doc.path = "/root/B.md";
    await p.save("same words");
    expect([...storage.texts.values()].sort()).toEqual(["other", "same words"]);
    now.mockRestore();
  });

  it("thins old versions out by age, but never a named or pinned one", async () => {
    const DAY = 864e5;
    const start = Date.UTC(2026, 0, 5, 9);
    const now = vi.spyOn(Date, "now").mockReturnValue(start);
    const storage = place();
    const p = withPanel(storage, "/root/A.md");
    await p.ready;
    // Every 20 minutes for a day, then nothing for ten days.
    for (let i = 0; i < 72; i++) {
      now.mockReturnValue(start + i * 20 * 60e3);
      await p.save("text " + i);
    }
    const pinned = p.latest().versions.at(-1)!.id;
    await p.post({ type: "pin", id: pinned });
    now.mockReturnValue(start + 10 * DAY);
    await p.save("much later");
    const kept = p.latest().versions;
    // The last day's, one an hour: a day's hours, plus today's and the pin.
    expect(kept.length).toBeLessThanOrEqual(2 + 2);
    expect(kept.some((v) => v.id === pinned && v.pinned)).toBe(true);
    now.mockRestore();
  });

  it("names a version, and keeps a deleted document's versions a month", async () => {
    const DAY = 864e5;
    const now = vi.spyOn(Date, "now").mockReturnValue(1_000_000);
    const storage = place();
    const p = withPanel(storage, "/root/A.md");
    await p.ready;
    await p.save("draft");
    const id = p.latest().versions[0].id;
    await p.post({ type: "name", id });
    expect(p.latest().versions[0].name).toBe("Sent to the editor");
    await p.fire("delete", { path: "/root" });
    // The store's daily clean, as the next start runs it.
    now.mockReturnValue(1_000_000 + 31 * DAY);
    const again = withPanel(storage, "/root/A.md");
    await again.ready;
    expect(again.latest().versions).toEqual([]);
    expect(storage.texts.size).toBe(0);
    now.mockRestore();
  });

  it("keeps what a change from outside replaced and brought", async () => {
    const storage = place();
    const p = withPanel(storage, "/root/A.md");
    await p.ready;
    await p.fire("disk", { path: "/root/A.md", before: "mine", after: "theirs" });
    expect(p.latest().versions.map((v) => v.source)).toEqual(["disk", "save"]);
  });

  it("brings 0.3's versions over", async () => {
    const storage = place();
    // Within the last day, so none thins out.
    const h = Date.now() - 5 * 3600e3;
    await storage.set("v:old", {
      path: "/root/A.md",
      versions: [{ at: h + 2000, text: "second" }, { at: h + 1000, text: "first" }],
    });
    await storage.set("v:old:now", { path: "/root/A.md", version: { at: h + 3000, since: h + 2500, text: "third" } });
    const p = withPanel(storage, "/root/A.md");
    await p.ready;
    expect(p.latest().versions.map((v) => v.id - h)).toEqual([2500, 2000, 1000]);
    expect([...storage.values.keys()].some((k) => k.startsWith("v:"))).toBe(false);
  });

  it("makes room from older versions when the storage is full, or says so", async () => {
    const now = vi.spyOn(Date, "now").mockReturnValue(1_000_000);
    const storage = place(900);
    const p = withPanel(storage, "/root/Old.md");
    await p.ready;
    await p.save("x".repeat(300));
    now.mockReturnValue(5_000_000 + 3600e3);
    await p.save("y".repeat(300));
    p.doc.path = "/root/New.md";
    now.mockReturnValue(9_000_000 + 7200e3);
    await p.save("z".repeat(300));
    expect(p.latest().full).toBe(false);
    expect([...storage.texts.values()].map((t) => t[0]).sort()).toEqual(["y", "z"]);
    await p.save("w".repeat(2000));
    expect(p.latest().full).toBe(true);
    now.mockRestore();
  });

  it("takes back one change on its own, as a proposal", async () => {
    const storage = place();
    const p = withPanel(storage, "/root/A.md");
    await p.ready;
    await p.post({ type: "restoreText", text: "put back" });
    expect(p.proposed).toEqual(["put back"]);
  });
});

describe("its diff", () => {
  it("takes one run of changes back and marks the words that changed", () => {
    loadPlugin("catvinci.version-history");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = globalThis as any;
    const parts = g.lineDiff("a\nb old words\nc\nd", "a\nb new words\nc\nd2");
    const groups = g.changeGroups(parts);
    expect(groups).toEqual([[1, 3], [4, 6]]);
    expect(g.revertGroup(parts, groups[0])).toBe("a\nb old words\nc\nd2");
    expect(g.wordDiff("我们今天去", "我们明天去").after).toEqual([
      { text: "我们", changed: false },
      { text: "明", changed: true },
      { text: "天去", changed: false },
    ]);
  });
});

describe("version history's tools", () => {
  it("list a document's versions and compare them", async () => {
    const now = vi.spyOn(Date, "now").mockReturnValue(Date.UTC(2026, 10, 1, 10));
    const storage = place();
    const files = { "Plan.md": "# Plan\n\none\ntwo\nthree\n" };
    const { tools } = loadPlugin(
      "catvinci.version-history",
      { files: folder(files), editor: { getPath: async () => "/root/Plan.md" } },
      storage,
    );
    // After the plugin's own start (its clean), as its saves would be.
    await new Promise((r) => setTimeout(r, 5));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const store = (globalThis as any).versionStore.createStore(storage);
    await store.record("/root/Plan.md", "# Plan\n\none\n2\nthree\nfour\n");
    now.mockReturnValue(Date.UTC(2026, 10, 2, 10));
    await store.record("/root/Plan.md", files["Plan.md"]);
    expect(await tools.get("list_versions")!({ path: "Plan" })).toEqual({
      document: "Plan.md",
      versions: [
        { version: 1, saved: "2026-11-02T10:00:00.000Z", characters: 22, words: 5 },
        { version: 2, saved: "2026-11-01T10:00:00.000Z", characters: 25, words: 6 },
      ],
    });
    const diff = await tools.get("diff_versions")!({ from: 2 });
    expect(diff).toMatchObject({ document: "Plan.md", from: "version 2", to: "current" });
    expect(diff.diff).toBe("…\n  \n  one\n- 2\n+ two\n  three\n- four\n  ");
    expect(await tools.get("diff_versions")!({ from: 1 })).toMatchObject({ diff: "(no changes)" });
    expect(await tools.get("diff_versions")!({ from: 9 })).toHaveProperty("error");
    now.mockRestore();
  });
});

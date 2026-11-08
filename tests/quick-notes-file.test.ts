import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { folder, loadPlugin, memoryStorage } from "./plugin-host";

/** Quick Notes kept in a document of the open folder
 *  (plugins/catvinci.quick-notes/host.js). */
type Message = Record<string, unknown>;

function setup(
  files: Record<string, string>,
  settings: Record<string, unknown> = {},
  storage = memoryStorage(),
  overrides: Record<string, unknown> = {},
  heading = "Quick notes",
) {
  const posted: Message[] = [];
  const opened: unknown[] = [];
  let receive: (m: Message) => Promise<void> = async () => {};
  const { tools } = loadPlugin(
    "catvinci.quick-notes",
    {
      files: { ...folder(files), ...overrides },
      settings: { get: async (key: string) => settings[key] },
      layout: { open: async (place: unknown) => opened.push(place), openUntitled: async () => {} },
      l10n: { t: (key: string) => (key === "heading" ? heading : key) },
      views: {
        registerWebview: (_id: string, view: { resolve: (w: unknown) => Promise<void> }) =>
          view.resolve({
            postMessage: (m: Message) => posted.push(m),
            onDidDispose: () => ({ dispose() {} }),
            onDidReceiveMessage: (f: typeof receive) => ((receive = f), { dispose() {} }),
          }),
      },
    },
    storage,
  );
  const add = (text: string) => tools.get("add_note")!({ text });
  const send = (m: Message) => receive(m);
  const shown = () => (posted.filter((m) => m.type === "notes").at(-1)!.notes as { id: string; text: string }[]);
  return { add, send, shown, posted, storage, opened };
}

const at = (h: number, m: number, d = 7) => new Date(2026, 10, d, h, m).getTime();

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(at(14, 5));
});
afterEach(() => vi.useRealTimers());

describe("notes in Inbox.md", () => {
  it("are appended as list items stamped with their day and time", async () => {
    const files: Record<string, string> = {};
    const { add } = setup(files);
    await add("Buy milk");
    vi.setSystemTime(at(16, 30));
    await add("Two lines\n\nof thought\n");
    expect(files["Inbox.md"]).toBe(
      "- 2026-11-07 14:05 Buy milk\n- 2026-11-07 16:30 Two lines\n\n  of thought\n",
    );
  });

  it("go after what the file already holds, in the file the setting names", async () => {
    const files: Record<string, string> = { "Notes/In.md": "# Inbox\n\nSome words.\n\n\n" };
    const { add } = setup(files, { inbox: "Notes/In" });
    await add("First");
    await add("Second");
    expect(files["Notes/In.md"]).toBe(
      "# Inbox\n\nSome words.\n\n- 2026-11-07 14:05 First\n- 2026-11-07 14:05 Second\n",
    );
  });

  it("are read back into the sidebar, newest first, and changed there", async () => {
    const files: Record<string, string> = {
      "Inbox.md": "- 2026-11-06 09:00 Old\n  second line\n- by hand\n- 2026-11-07 10:15 New\n",
    };
    const { send, shown } = setup(files);
    await send({ type: "ready" });
    // A list item written by hand, with no stamp, is the file's, not a note.
    expect(shown()).toEqual([
      { id: "1", text: "New", at: at(10, 15) },
      { id: "0", text: "Old\nsecond line", at: at(9, 0, 6) },
    ]);
    await send({ type: "edit", id: "0", text: "Older\nstill" });
    await send({ type: "delete", id: "1" });
    expect(files["Inbox.md"]).toBe("- 2026-11-06 09:00 Older\n  still\n- by hand\n");
    await send({ type: "undo" });
    expect(files["Inbox.md"]).toBe(
      "- 2026-11-06 09:00 Older\n  still\n- by hand\n- 2026-11-07 10:15 New\n",
    );
    await send({ type: "new" });
    await send({ type: "drop", id: "2" });
    expect(files["Inbox.md"]).toBe(
      "- 2026-11-06 09:00 Older\n  still\n- by hand\n- 2026-11-07 10:15 New\n",
    );
    expect(shown().map((n) => n.text)).toEqual(["New", "Older\nstill"]);
  });

  it("open in their file, at their line", async () => {
    const files: Record<string, string> = { "Inbox.md": "# Inbox\n\n- 2026-11-07 10:15 New\n" };
    const { send, opened } = setup(files);
    await send({ type: "ready" });
    await send({ type: "open", id: "0" });
    expect(opened).toEqual([{ path: "/root/Inbox.md", line: 2 }]);
  });
});

describe("notes in today's daily note", () => {
  it("go under the heading in the user's language, and are read under the English one", async () => {
    const files: Record<string, string> = {
      "Daily/2026-11-06.md": "# Friday\n\n## Quick notes\n\n- 09:00 Yesterday\n",
    };
    const { add, send, shown } = setup(files, { saveTo: "daily" }, memoryStorage(), {}, "快速笔记");
    await add("今天");
    expect(files["Daily/2026-11-07.md"]).toContain("## 快速笔记\n\n- 14:05 今天\n");
    vi.setSystemTime(at(9, 30, 6));
    await send({ type: "ready" });
    expect(shown().map((n) => n.text)).toEqual(["Yesterday"]);
  });

  it("go under ## Quick notes, made with the note when missing", async () => {
    const files: Record<string, string> = {};
    const { add } = setup(files, { saveTo: "daily" });
    await add("Buy milk");
    await add("Call Anna");
    expect(files["Daily/2026-11-07.md"]).toBe(
      "# 2026-11-07\n\n## Quick notes\n\n- 14:05 Buy milk\n- 14:05 Call Anna\n",
    );
  });

  it("keep the rest of the note, and follow the vault's daily notes settings", async () => {
    const files: Record<string, string> = {
      ".obsidian/daily-notes.json": '{"folder":"Journal","format":"YYYY/MM-DD"}',
      "Journal/2026/11-07.md": "# Saturday\n\n## Quick notes\n- 09:00 Early\n## Evening\nRain.\n",
    };
    const { add, send, shown } = setup(files, { saveTo: "daily" });
    await add("Later");
    expect(files["Journal/2026/11-07.md"]).toBe(
      "# Saturday\n\n## Quick notes\n- 09:00 Early\n- 14:05 Later\n\n## Evening\nRain.\n",
    );
    await send({ type: "ready" });
    expect(shown().map((n) => n.text)).toEqual(["Later", "Early"]);
  });

  it("start the section at the end of a note that has none", async () => {
    const files: Record<string, string> = { "Daily/2026-11-07.md": "# Today\n\n- [ ] a task\n" };
    const { add } = setup(files, { saveTo: "daily" });
    await add("Idea");
    expect(files["Daily/2026-11-07.md"]).toBe("# Today\n\n- [ ] a task\n\n## Quick notes\n\n- 14:05 Idea\n");
  });
});

describe("notes stored before they were kept in a document", () => {
  const old = [
    { id: "b", text: "Newer", at: at(8, 0, 6) },
    { id: "c", text: " ", at: at(8, 30, 6) },
    { id: "a", text: "Older\nwith more", at: at(18, 45, 5) },
  ];

  it("move into it once, oldest first, a backup kept", async () => {
    const storage = memoryStorage();
    await storage.set("notes", old);
    const files: Record<string, string> = {};
    const { add } = setup(files, {}, storage);
    await add("Today");
    expect(files["Inbox.md"]).toBe(
      "- 2026-11-05 18:45 Older\n  with more\n- 2026-11-06 08:00 Newer\n- 2026-11-07 14:05 Today\n",
    );
    expect(await storage.get("notes")).toEqual([]);
    expect(await storage.get("notesBackup")).toEqual(old);
  });

  it("stay stored when the document can't be written", async () => {
    const storage = memoryStorage();
    await storage.set("notes", old);
    const process = async () => {
      throw new Error("Read-only");
    };
    const { send } = setup({}, {}, storage, { process });
    await send({ type: "ready" });
    expect(await storage.get("notes")).toEqual(old);
    expect(await storage.get("notesBackup")).toBe(undefined);
  });

  it("stay where they are with no folder open", async () => {
    const storage = memoryStorage();
    await storage.set("notes", old);
    const posted: Message[] = [];
    loadPlugin(
      "catvinci.quick-notes",
      {
        views: {
          registerWebview: (_id: string, view: { resolve: (w: unknown) => Promise<void> }) =>
            view.resolve({
              postMessage: (m: Message) => posted.push(m),
              onDidDispose: () => ({ dispose() {} }),
              onDidReceiveMessage: (f: (m: Message) => Promise<void>) => (f({ type: "ready" }), { dispose() {} }),
            }),
        },
      },
      storage,
    );
    await vi.waitFor(() => expect(posted.some((m) => m.type === "notes")).toBe(true));
    expect(await storage.get("notes")).toEqual(old);
  });
});

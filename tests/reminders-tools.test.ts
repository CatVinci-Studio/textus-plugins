import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { folder, loadPlugin } from "./plugin-host";

/** Reminders' tools for Textus AI (plugins/catvinci.reminders/host.js). */
describe("reminders' tools", () => {
  it("list the coming reminders, soonest first", async () => {
    const files = {
      "Plan.md":
        "# Plan\n\n- [ ] Call (@2999-01-02 10:30)\n- [ ] Old (@2000-01-01)\n",
      "Home.md": "Water the plants (@2999-01-01)\n",
    };
    const { tools } = loadPlugin("catvinci.reminders", {
      files: folder(files),
    });
    expect(await tools.get("list_reminders")!({})).toEqual({
      reminders: [
        {
          when: "2999-01-01 09:00",
          text: "Water the plants",
          path: "Home.md",
          line: 1,
        },
        { when: "2999-01-02 10:30", text: "Call", path: "Plan.md", line: 3 },
      ],
    });
  });

  it("add one to the end of the document in front", async () => {
    const edit = vi.fn(async () => true);
    const { tools } = loadPlugin("catvinci.reminders", { editor: { edit } });
    expect(
      await tools.get("add_reminder")!({
        text: "Send it",
        when: "2999-03-04 8:05",
      }),
    ).toEqual({
      added: "- [ ] Send it (@2999-03-04 08:05)",
      past: false,
    });
    expect(edit).toHaveBeenCalledWith({
      action: "append",
      text: "- [ ] Send it (@2999-03-04 08:05)",
    });
    expect(
      await tools.get("add_reminder")!({ text: "x", when: "tomorrow" }),
    ).toHaveProperty("error");
  });
});

/** The host's sync, schedule and sidebar list, with the events captured. */
function host(
  files: Record<string, string>,
  api: Record<string, unknown> = {},
) {
  const base = folder(files);
  const readText = vi.fn(base.readText);
  const listeners: Record<string, (e: unknown) => void> = {};
  const on = (name: string) => (fn: (e: unknown) => void) => {
    listeners[name] = fn;
    return { dispose() {} };
  };
  const jobs = new Map<string, Record<string, unknown>>();
  const schedule = {
    list: async () => [...jobs].map(([id, job]) => ({ id, ...job })),
    clear: vi.fn(async (id: string) => jobs.delete(id)),
    set: async (id: string, job: Record<string, unknown>) =>
      void jobs.set(id, job),
  };
  let items: () => { label: string }[] = () => [];
  const commands = new Map<string, () => Promise<unknown>>();
  const state = { root: "/root" as string | null };
  loadPlugin("catvinci.reminders", {
    files: {
      ...base,
      readText,
      root: async () => state.root,
      onDidChangeRoot: on("root"),
      onDidSave: on("save"),
      onDidChange: on("change"),
      onDidCreate: on("create"),
      onDidDelete: on("delete"),
      onDidRename: on("rename"),
    },
    schedule,
    views: {
      registerList: (_id: string, o: { items: () => { label: string }[] }) => {
        items = o.items;
        return { refresh() {}, dispose() {} };
      },
    },
    commands: {
      register: (id: string, fn: () => Promise<unknown>) => {
        commands.set(id, fn);
        return { dispose() {} };
      },
    },
    ...api,
  });
  return {
    jobs,
    schedule,
    readText,
    listeners,
    state,
    commands,
    items: () => items(),
  };
}

describe("reminders' host", () => {
  beforeEach(() =>
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] }),
  );
  afterEach(() => vi.useRealTimers());

  it("clears only its own folder's jobs, never another window's", async () => {
    const h = host({ "a.md": "Call (@2999-01-01)\n" });
    h.jobs.set("other", {
      at: "2999-01-01T09:00",
      notify: { title: "x", open: { path: "/other/b.md" } },
    });
    h.jobs.set("stale", {
      at: "2999-01-01T09:00",
      notify: { title: "x", open: { path: "/root/gone.md" } },
    });
    await vi.waitFor(() => expect(h.jobs.has("stale")).toBe(false));
    expect(h.jobs.size).toBe(2);
    expect(h.jobs.has("other")).toBe(true);
    expect(h.jobs.has("stale")).toBe(false);
  });

  it("reads only the saved document again, and empties the list when the folder closes", async () => {
    const h = host({
      "a.md": "Call (@2999-01-01)\n",
      "b.md": "Walk (@2999-01-02)\n",
    });
    await vi.waitFor(() => expect(h.items()).toHaveLength(2));
    h.readText.mockClear();
    h.listeners.save({
      path: "/root/a.md",
      text: "Call later (@2999-01-03)\n",
    });
    h.listeners.change({ path: "/root/b.md" });
    await vi.advanceTimersByTimeAsync(800);
    await vi.waitFor(() =>
      expect(h.items().map((i) => i.label)).toEqual(["Walk", "Call later"]),
    );
    expect(h.readText.mock.calls.map((c) => c[0])).toEqual(["/root/b.md"]);
    h.listeners.delete({ path: "/root/b.md" });
    await vi.advanceTimersByTimeAsync(800);
    await vi.waitFor(() => expect(h.items()).toHaveLength(1));
    h.state.root = null;
    h.listeners.root({ path: null });
    await vi.advanceTimersByTimeAsync(800);
    await vi.waitFor(() => expect(h.items()).toHaveLength(0));
  });

  it("refuses a typed time that isn't a date", async () => {
    const insertText = vi.fn(async () => undefined);
    const message = vi.fn(async () => undefined);
    const h = host(
      {},
      {
        editor: { insertText },
        ui: {
          pick: async (items: unknown[]) => items.length - 1,
          input: async () => "2026-13-40 25:99",
          message,
        },
      },
    );
    await h.commands.get("catvinci.reminders.remind")!();
    expect(insertText).not.toHaveBeenCalled();
    expect(message).toHaveBeenCalledWith("badTime");
  });
});

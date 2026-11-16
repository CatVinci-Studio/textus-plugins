import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { loadPlugin } from "./plugin-host";

const manifest = JSON.parse(readFileSync("plugins/catvinci.git/textus-plugin.json", "utf8"));

/** Git (plugins/catvinci.git): badges, the branch, committing and the
 *  tools, over a fake textus.git. */
function withGit(changes: { path: string; state: string }[] | null) {
  const badges = new Map<string, unknown>();
  const commands = new Map<string, () => Promise<unknown>>();
  const commits: [string, string[]][] = [];
  const asked: string[] = [];
  let item: { text: string } | null = null;
  const status = async () =>
    changes && { branch: "main", changes: changes.map((c) => ({ staged: false, ...c })) };
  const plugin = loadPlugin("catvinci.git", {
    git: {
      status,
      log: async (path: string) => [{ hash: "abc1234def", at: 0, author: "A", subject: "Last", path }],
      show: async () => "one\ntwo\n",
      commit: async (message: string, paths: string[]) => {
        commits.push([message, paths]);
        return "f00dfeed00";
      },
    },
    files: {
      root: async () => "/root",
      readText: async () => "one\n2\n",
      setBadge: async (path: string, badge: unknown) => void (badge ? badges.set(path, badge) : badges.delete(path)),
      onDidSave: () => ({ dispose() {} }),
      onDidCreate: () => ({ dispose() {} }),
      onDidRename: () => ({ dispose() {} }),
      onDidDelete: () => ({ dispose() {} }),
      onDidChangeRoot: () => ({ dispose() {} }),
      onDidChangeOnDisk: () => ({ dispose() {} }),
    },
    editor: { getPath: async () => "/root/a.md" },
    app: { onDidChangeState: () => ({ dispose() {} }) },
    commands: { register: (id: string, run: () => Promise<unknown>) => void commands.set(id, run) },
    ui: {
      statusItem: (_id: string, i: { text: string }) => {
        item = i;
        return { update: (u: { text: string }) => (item = { ...item!, ...u }), dispose: () => (item = null) };
      },
      pick: async (items: { value: string; picked: boolean }[]) => items.filter((i) => i.picked).map((i) => i.value),
      input: async () => " Fix the intro ",
      confirm: async (text: string, o?: { okLabel?: string }) => (asked.push(`${o?.okLabel}: ${text}`), true),
      notice: async () => true,
      message: async () => {},
    },
  });
  const settle = () => new Promise((r) => setTimeout(r, 5));
  return { plugin, badges, commands, commits, asked, item: () => item, settle };
}

describe("the Git plugin", () => {
  it("marks the changed files and shows the branch", async () => {
    const g = withGit([
      { path: "/root/a.md", state: "modified" },
      { path: "/root/b.md", state: "untracked" },
    ]);
    await g.settle();
    expect([...g.badges.keys()]).toEqual(["/root/a.md", "/root/b.md"]);
    expect(g.badges.get("/root/a.md")).toMatchObject({ text: "M", tone: "warning" });
    expect(g.item()?.text).toBe("⎇ main");
  });

  it("shows nothing outside a repository", async () => {
    const g = withGit(null);
    await g.settle();
    expect(g.badges.size).toBe(0);
    expect(g.item()).toBe(null);
  });

  it("commits the document in front, asking once per folder", async () => {
    const g = withGit([
      { path: "/root/a.md", state: "modified" },
      { path: "/root/b.md", state: "untracked" },
    ]);
    await g.settle();
    await g.commands.get("catvinci.git.commit")!();
    await g.commands.get("catvinci.git.commit")!();
    expect(g.commits).toEqual([
      ["Fix the intro", ["/root/a.md"]],
      ["Fix the intro", ["/root/a.md"]],
    ]);
    // Its button commits at once: "Commit", not the command's "Commit Changes…".
    expect(g.asked).toHaveLength(1);
    expect(g.asked[0]).toMatch(/^commitNow: /);
    expect(manifest.l10n.en.commitNow).toBe("Commit");
  });

  it("gives Textus AI the changes against the last commit", async () => {
    const g = withGit([{ path: "/root/a.md", state: "modified" }]);
    const result = await g.plugin.tools.get("git_changes")!({});
    expect(result).toEqual({
      branch: "main",
      changes: [{ path: "a.md", state: "modified", diff: "  one\n- two\n+ 2\n  " }],
    });
    expect(await g.plugin.tools.get("git_file_at")!({ path: "a.md", hash: "abc1" })).toMatchObject({
      file: "a.md",
      text: "one\ntwo\n",
    });
  });
});

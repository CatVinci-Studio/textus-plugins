import { describe, expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

type Provider = Record<string, (...args: unknown[]) => Promise<unknown>>;

/** The plugin over a fake ssh whose first link drops after one call. */
function plugin() {
  const calls: string[] = [];
  let provider: Provider | null = null;
  let next = 1;
  let live = 0;
  const on = (s: number, what: string) => {
    if (s !== live) throw new Error("The connection was closed.");
    calls.push(what);
  };
  loadPlugin("catvinci.ssh", {
    ssh: {
      connect: async (host: string) => {
        calls.push(`connect ${host}`);
        live = next++;
        return live;
      },
      list: async (s: number, path: string) => {
        on(s, `list ${path}`);
        return [{ name: "a.md", folder: false }];
      },
      readText: async (s: number, path: string) => {
        on(s, `read ${path}`);
        return "# A";
      },
      rename: async (s: number, from: string, to: string) =>
        on(s, `rename ${from} ${to}`),
      create: async (s: number, path: string, folder: boolean) =>
        on(s, `create ${path} ${folder}`),
    },
    files: {
      registerProvider(scheme: string, p: Provider) {
        expect(scheme).toBe("ssh");
        provider = p;
        return { dispose() {} };
      },
    },
    commands: { register: () => ({ dispose() {} }) },
  });
  return {
    provider: provider!,
    calls,
    drop: () => (live = 0),
  };
}

describe("SSH folders", () => {
  it("reaches a host once and maps a folder's paths to the server's", async () => {
    const { provider, calls } = plugin();
    await provider.list("ssh://me@box/home/me/notes");
    await provider.readText("ssh://me@box/home/me/notes/a.md");
    await provider.rename("ssh://me@box/home/me/notes/a.md", "b.md");
    await provider.move("ssh://me@box/home/me/notes/b.md", "ssh://me@box/srv");
    await provider.create("ssh://me@box/home/me/notes", "c", true);
    expect(calls).toEqual([
      "connect me@box",
      "list /home/me/notes",
      "read /home/me/notes/a.md",
      "rename /home/me/notes/a.md /home/me/notes/b.md",
      "rename /home/me/notes/b.md /srv/b.md",
      "create /home/me/notes/c true",
    ]);
  });

  it("connects again when the link dropped, and refuses other URLs", async () => {
    const { provider, calls, drop } = plugin();
    await provider.list("ssh://box/n");
    drop();
    expect(await provider.readText("ssh://box/n/a.md")).toBe("# A");
    expect(calls.filter((c) => c.startsWith("connect"))).toHaveLength(2);
    await expect(provider.list("file:///n")).rejects.toThrow();
  });
});

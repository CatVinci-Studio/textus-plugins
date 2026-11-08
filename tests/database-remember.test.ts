import { expect, it, vi } from "vitest";
import { loadPlugin, memoryStorage } from "./plugin-host";

type Any = any; // eslint-disable-line @typescript-eslint/no-explicit-any

/** A base block's view, kept per block on this device
 *  (plugins/catvinci.database/host.js), never in the note. */
it("remembers each block's view on this device", async () => {
  let render: (block: Any, webview: Any) => Promise<void> = async () => {};
  const storage = memoryStorage();
  loadPlugin(
    "catvinci.database",
    {
      plugin: { readText: async () => "<html></html>" },
      views: {
        registerCodeBlock: (_lang: string, p: Any) => ((render = p.render), { dispose() {} }),
      },
    },
    storage,
  );
  const open = async (block: number) => {
    const posted: Any[] = [];
    let receive: (m: Any) => Promise<void> = async () => {};
    const source = "views:\n  - type: table\n  - type: board\n";
    await render(
      { path: "/root/Note.md", block, source, setSource: async () => {}, onDidChange: () => {} },
      {
        html: "",
        postMessage: (m: Any) => posted.push(m),
        onDidDispose: () => {},
        onDidReceiveMessage: (f: Any) => (receive = f),
      },
    );
    return { posted, send: (m: Any) => receive(m) };
  };
  const first = await open(0);
  await first.send({ type: "select", index: 1 });
  const again = await open(0);
  await again.send({ type: "ready", index: 0 });
  await vi.waitFor(() =>
    expect(again.posted).toContainEqual({ type: "selected", index: 1 }),
  );
  const other = await open(1);
  await other.send({ type: "ready", index: 0 });
  expect(other.posted).toContainEqual({ type: "selected", index: 0 });
});

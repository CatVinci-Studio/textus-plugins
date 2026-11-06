import { readFileSync } from "node:fs";
import { join } from "node:path";
import JSZip from "jszip";
import { beforeAll, describe, expect, it } from "vitest";
import { FIXTURE, H, exportFiles, id } from "./notion-fixture";
import { loadPlugin, memoryStorage } from "./plugin-host";

/** Notion Import's host (plugins/catvinci.notion-import/host.js) and the
 *  zips it opens, against an open folder held in memory. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ni: any;

beforeAll(async () => {
  await import(/* @vite-ignore */ "../shared/notion-csv.js");
  await import(/* @vite-ignore */ "../plugins/catvinci.notion-import/notion.js");
  ni = (globalThis as unknown as { notionImport: unknown }).notionImport;
});

describe("zips", () => {
  async function zipOf(files: Record<string, string>) {
    const zip = new JSZip();
    for (const [name, text] of Object.entries(files)) zip.file(name, text);
    return zip.generateAsync({ type: "uint8array" });
  }

  it("reads an export's zip, without the folder it is in", async () => {
    const bytes = await zipOf({ [`Export-x/Home ${H}.md`]: "# Home\n", "Export-x/.DS_Store": "", "__MACOSX/Export-x/._Home.md": "" });
    const source = await ni.zipSource(JSZip, bytes);
    expect(source.paths).toEqual([`Home ${H}.md`]);
    expect(await source.read(`Home ${H}.md`, "text")).toBe("# Home\n");
    expect(ni.isExport(source.paths)).toBe(true);
  });

  it("opens Part-1.zip, Part-2.zip… inside a large export as one", async () => {
    const part1 = await zipOf({ [`Home ${H}.md`]: "# Home\n" });
    const part2 = await zipOf({ [`Home ${H}/Sub ${id("1")}.md`]: "# Sub\n" });
    const outer = new JSZip();
    outer.file("Export-x-Part-1.zip", part1);
    outer.file("Export-x-Part-2.zip", part2);
    const source = await ni.zipSource(JSZip, await outer.generateAsync({ type: "uint8array" }));
    expect(source.paths.sort()).toEqual([`Home ${H}.md`, `Home ${H}/Sub ${id("1")}.md`]);
    expect(await source.read(`Home ${H}/Sub ${id("1")}.md`, "text")).toBe("# Sub\n");
  });

  it("knows a zip that isn't Notion's", async () => {
    const source = await ni.zipSource(JSZip, await zipOf({ "notes/a.md": "# A\n", "b.csv": "x\n" }));
    expect(ni.isExport(source.paths)).toBe(false);
  });
});

describe("the plugin", () => {
  it("loads with jszip before its scripts and asks only to read and write files", () => {
    const { manifest } = loadPlugin("catvinci.notion-import");
    expect(manifest.permissions).toEqual(["files.read", "files.write"]);
    expect(manifest.main.slice(-3)).toEqual(["lib/jszip.min.js", "notion.js", "host.js"]);
  });
});

/** The open folder, its files by path: enough of textus.files for the host.
 *  `size` gives a file's size; reading a .zip takes `delay` ms. */
function disk(files: Record<string, Uint8Array | string>, options: { size?: number; delay?: number } = {}) {
  const root = "/root";
  const dirs = new Set<string>();
  const reads: string[] = [];
  const listed: string[] = [];
  const rel = (path: string) => path.slice(root.length + 1);
  const isDir = (r: string) => r === "" || dirs.has(r) || Object.keys(files).some((f) => f.startsWith(r + "/"));
  const get = async (path: string) => {
    reads.push(rel(path));
    if (options.delay && path.endsWith(".zip")) await new Promise((done) => setTimeout(done, options.delay));
    if (!(rel(path) in files)) throw new Error("No such file: " + path);
    return files[rel(path)];
  };
  return {
    files,
    dirs,
    reads,
    listed,
    api: {
      root: async () => root,
      find: async (glob: string) => {
        const exts = /\{(.+)\}$/.exec(glob)?.[1].split(",") ?? [glob.split(".").pop()];
        return Object.keys(files)
          .filter((f) => exts.some((e) => f.endsWith("." + e)))
          .map((f) => ({ path: root + "/" + f, rel: f }));
      },
      list: async (path: string) => {
        listed.push(rel(path));
        const prefix = rel(path) ? rel(path) + "/" : "";
        const names = new Set(Object.keys(files).filter((f) => f.startsWith(prefix)).map((f) => f.slice(prefix.length).split("/")[0]));
        return [...names].map((name) => ({ name, path: root + "/" + prefix + name, isDir: isDir(prefix + name) }));
      },
      stat: async (path: string) =>
        rel(path) in files || isDir(rel(path))
          ? { path, name: path.split("/").pop(), isDir: isDir(rel(path)), size: options.size ?? 70 }
          : null,
      read: get,
      readText: async (path: string) => String(await get(path)),
      createFolder: async (path: string) => void dirs.add(rel(path)),
      create: async (path: string, text: string) => {
        if (rel(path) in files) throw new Error("Exists: " + path);
        files[rel(path)] = text;
      },
      write: async (path: string, bytes: Uint8Array) => void (files[rel(path)] = bytes),
    },
  };
}

async function fixtureZip() {
  const zip = new JSZip();
  for (const path of exportFiles()) zip.file("Export-x/" + path, readFileSync(join(FIXTURE, path)));
  return zip.generateAsync({ type: "uint8array" });
}

/** The plugin loaded over `folder`; `run(arg)` is the import command. */
function host(
  folder: ReturnType<typeof disk>,
  options: { installed?: string[]; offer?: (args: unknown) => Promise<unknown>; signal?: AbortSignal } = {},
) {
  const commands = new Map<string, (...args: unknown[]) => Promise<unknown>>();
  const messages: string[] = [];
  const opened: string[] = [];
  const picks: unknown[][] = [];
  const t = (key: string, ...args: unknown[]) => [key, ...args].join("|");
  loadPlugin(
    "catvinci.notion-import",
    {
      l10n: { t },
      files: folder.api,
      commands: {
        register: (id: string, run: (...args: unknown[]) => Promise<unknown>) => {
          commands.set(id, run);
          return { dispose() {} };
        },
        execute: async (id: string, args: unknown) => (id === "textus.offerPlugin" && options.offer ? options.offer(args) : null),
      },
      ui: {
        pick: async (items: { value: unknown }[]) => {
          picks.push(items);
          return items[0].value;
        },
        withProgress: async (_title: string, task: (r: () => void, s: AbortSignal) => Promise<unknown>) =>
          task(() => {}, options.signal ?? new AbortController().signal),
        message: async (text: string) => void messages.push(text),
        notice: async (text: string) => void messages.push(text),
      },
      layout: { open: async (path: string) => void opened.push(path) },
      plugins: { get: async (id: string) => ((options.installed ?? []).includes(id) ? {} : null) },
    },
    memoryStorage(),
  );
  const run = (arg?: unknown) => commands.get("catvinci.notion-import.import")!(arg);
  return { commands, messages, opened, picks, run };
}

/** The new top-level folders the imports made. */
const targets = (folder: ReturnType<typeof disk>) => [...folder.dirs].filter((d) => !d.includes("/")).sort();

describe("the import command", () => {
  it("imports the zip it picked into a new dated folder and opens the report", async () => {
    const folder = disk({ "Inbox/Export-x.zip": await fixtureZip() });
    const { messages, opened, picks, run } = host(folder, { installed: ["catvinci.pages"] });
    await run();
    expect(picks[0]).toEqual([{ label: "Export-x.zip", description: "Inbox/Export-x.zip", value: "/root/Inbox/Export-x.zip" }]);
    const [target] = targets(folder);
    expect(target).toMatch(/^folderName\|\d{4}-\d{2}-\d{2}$/);
    expect(folder.files[target + "/Home/Projects/Launch.md"]).toContain("# Launch");
    expect(folder.files[target + "/Home/logo.png"]).toBeInstanceOf(Uint8Array);
    expect(opened).toEqual(["/root/" + target + "/reportName.md"]);
    const report = String(folder.files[target + "/reportName.md"]);
    expect(report).toContain("- **plugin.catvinci.database**: why.catvinci.database");
    expect(report).not.toContain("plugin.catvinci.pages");
    expect(messages).toEqual(["done|13|2|" + target]);
  });

  it("imports an unzipped folder: the one folder all is in, and decomposed names, as a Mac unzips them", async () => {
    const C = id("c");
    const D = id("d");
    const nfd = (files: Record<string, string>) =>
      Object.fromEntries(Object.entries(files).map(([path, text]) => ["Imports/Export-x/" + path.normalize("NFD"), text]));
    const folder = disk(
      nfd({
        [`Café ${C}.md`]: `# Café\n\n![photo](Caf%C3%A9%20${C}/photo.png)`,
        [`Café ${C}/photo.png`]: "png",
        [`DB ${D}.csv`]: "Name,Status\nCrème brûlée,Done\n",
        [`DB ${D}/Crème brûlée ${id("e")}.md`]: "# Crème brûlée\n\nStatus: Done\n\nSweet.",
      }),
    );
    const { messages, run } = host(folder);
    await run({ path: "/root/Imports" });
    const [target] = targets(folder);
    expect(folder.files[target + "/Café.md"]).toBe("# Café\n\n![photo](Café/photo.png)\n");
    expect(folder.files[target + "/DB/Crème brûlée.md"]).toBe("---\nstatus: Done\n---\n# Crème brûlée\n\nSweet.\n");
    expect(Object.keys(folder.files).filter((p) => p.includes("brûlée 2"))).toEqual([]);
    expect(String(folder.files[target + "/reportName.md"])).not.toContain("missingTitle");
    expect(messages).toEqual(["done|2|1|" + target]);
  });

  it("asks to unzip an export too big to read at once, and makes nothing", async () => {
    const folder = disk({ "Inbox/Export-x.zip": new Uint8Array(1) }, { size: 300 * 1024 * 1024 });
    const { messages, run } = host(folder);
    await run({ path: "/root/Inbox/Export-x.zip" });
    expect(messages).toEqual(["tooBig|Export-x.zip"]);
    expect(folder.reads).toEqual([]);
    expect(targets(folder)).toEqual([]);
  });

  it("makes nothing when cancelled while it reads the export, and stops walking a folder", async () => {
    const controller = new AbortController();
    controller.abort();
    const zipped = disk({ "Inbox/Export-x.zip": await fixtureZip() });
    const fromZip = host(zipped, { signal: controller.signal });
    await fromZip.run({ path: "/root/Inbox/Export-x.zip" });
    expect([targets(zipped), fromZip.opened, fromZip.messages]).toEqual([[], [], []]);

    const unzipped = disk(Object.fromEntries(exportFiles().map((p) => ["Export-x/" + p, readFileSync(join(FIXTURE, p), "utf8")])));
    const fromFolder = host(unzipped, { signal: controller.signal });
    await fromFolder.run({ path: "/root/Export-x" });
    expect([targets(unzipped), unzipped.listed, fromFolder.messages]).toEqual([[], [], []]);
  });

  it("gives two imports run at once a folder each", async () => {
    const folder = disk({ "Inbox/Export-x.zip": await fixtureZip() }, { delay: 20 });
    const { messages, run } = host(folder);
    await Promise.all([run({ path: "/root/Inbox/Export-x.zip" }), run({ path: "/root/Inbox/Export-x.zip" })]);
    const [first, second] = targets(folder);
    expect(second).toBe(first + " 2");
    expect(messages.sort()).toEqual(["done|13|2|" + first, "done|13|2|" + second]);
    expect(String(folder.files[second + "/reportName.md"])).not.toContain("failedTitle");
  });

  it("offers a suggested plugin through Textus, or says where to find it", async () => {
    const offers: unknown[] = [];
    const ok = host(disk({ "Inbox/Export-x.zip": await fixtureZip() }), { offer: async (args) => (offers.push(args), true) });
    await ok.run();
    await ok.commands.get("catvinci.notion-import.recommend")!();
    expect(offers).toEqual([{ id: "catvinci.pages", reason: "why.catvinci.pages" }]);
    expect(ok.messages.join("\n")).not.toContain("offerFallback");

    // Declined, muted or offline: Textus says no without a word.
    const no = host(disk({ "Inbox/Export-x.zip": await fixtureZip() }), { offer: async () => false });
    await no.run();
    await no.commands.get("catvinci.notion-import.recommend")!();
    expect(no.messages.at(-1)).toBe("offerFallback|plugin.catvinci.pages");

    const old = host(disk({ "Inbox/Export-x.zip": await fixtureZip() }), {
      offer: async () => {
        throw new Error("No command textus.offerPlugin.");
      },
    });
    await old.run();
    await old.commands.get("catvinci.notion-import.recommend")!();
    expect(old.messages.at(-1)).toBe("offerFallback|plugin.catvinci.pages");
  });
});

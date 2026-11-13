import { hash, parseManifest } from "./content";
import { download } from "./engine";
import { emptyHistory, parseHistory, retiredAt } from "./history";
import {
  HEAD,
  HISTORY,
  ID,
  SyncError,
  type Entry,
  type LocalFiles,
  type ObjectStore,
  type Version,
} from "./model";

/** A version to bring back, then sync. */
export interface Restore {
  path: string;
  version: Entry;
}
interface Source {
  remote(): Promise<{ root: string; store: ObjectStore }>;
  operation(kind: "sync", restore: Restore): Promise<string | null>;
  page(name: string): Promise<string>;
}

const LABELS: Record<string, string> = {
  macos: "Mac",
  windows: "Windows",
  linux: "Linux",
};
/** "Mac 3f2a": the platform, and enough of a random id to tell two apart. */
export async function deviceName(ctx: Textus.PluginContext, api: Textus.Api) {
  const saved = await ctx.storage.global.get("device");
  if (typeof saved === "string") return saved;
  const name = `${LABELS[api.env.platform] ?? api.env.platform} ${crypto.randomUUID().slice(0, 4)}`;
  await ctx.storage.global.set("device", name);
  return name;
}

/** "Note (3f2a9c1b).md" beside "Note.md". */
const beside = (path: string, tag: string) => {
  const dot = path.lastIndexOf(".");
  const cut = dot > path.lastIndexOf("/") + 1 ? dot : path.length;
  return `${path.slice(0, cut)} (${tag.slice(0, 8)})${path.slice(cut)}`;
};

/** The version in the file's place when the file there is the synced one;
 *  else (edits not yet synced, an open tab) beside it, as a conflict copy is. */
export async function restoreInto(
  local: LocalFiles,
  store: ObjectStore,
  { path, version }: Restore,
) {
  const bytes = await download(store, version);
  const current = await local.read(path);
  const now = current ? await hash(current) : null;
  const head = await store.get(HEAD);
  const synced = head ? parseManifest(head).files[path]?.hash : undefined;
  if (now === (synced ?? null) && (await local.apply(path, bytes, now)) === true)
    return;
  for (const tag of [version.hash, crypto.randomUUID()]) {
    if ((await local.apply(beside(path, tag), bytes, null)) === true) return;
  }
  throw new SyncError("localWriteError", [path]);
}

async function read(store: ObjectStore) {
  const head = await store.get(HEAD);
  const stored = await store.get(HISTORY);
  return {
    files: head ? parseManifest(head).files : {},
    history: stored ? parseHistory(stored) : emptyHistory(),
  };
}
const row = (v: Version) => ({
  hash: v.hash,
  size: v.size,
  at: v.at,
  until: v.until,
  device: v.device ?? "",
});


/** The history page: one file's versions, or the deleted files. */
export function registerHistory(api: Textus.Api, source: Source) {
  const relative = (root: string, path: string) =>
    path.startsWith(root) ? path.slice(root.length).replace(/^[/\\]/, "") : path;
  async function list(path: string | null) {
    const { files, history } = await read((await source.remote()).store);
    if (path)
      return {
        path,
        current: files[path]
          ? { size: files[path].size, ...history.current[path] }
          : null,
        versions: (history.versions[path] ?? []).map(row),
      };
    const deleted = Object.entries(history.versions)
      .filter(([p]) => !files[p])
      .map(([p, list]) => ({ path: p, ...row(list[0]) }))
      .sort((a, b) => retiredAt(b) - retiredAt(a));
    return { path: null, deleted };
  }
  async function version(path: string, wanted: string) {
    const { store } = await source.remote();
    const { history } = await read(store);
    const v = history.versions[path]?.find((x) => x.hash === wanted);
    if (!v) throw new SyncError("versionGone");
    return { store, v };
  }
  async function preview(path: string, wanted: string) {
    const { store, v } = await version(path, wanted);
    if (v.size > 512 * 1024) return { binary: true };
    try {
      const text = new TextDecoder("utf-8", { fatal: true }).decode(
        await download(store, v),
      );
      return { text };
    } catch {
      return { binary: true };
    }
  }
  const resolve = (view: Textus.Webview, state: unknown) => {
    const path =
      (state as { path?: string } | null)?.path?.replace(/\\/g, "/") ?? null;
    const reply = (m: object) => void view.postMessage(m).catch(() => {});
    view.onDidReceiveMessage(async (raw) => {
      const m = raw as { type?: string; path?: string; hash?: string };
      try {
        if (m.type === "ready" || m.type === "open")
          reply({ type: "list", ...(await list(m.path ?? path)) });
        else if (m.type === "preview" && m.path && m.hash)
          reply({ type: "preview", hash: m.hash, ...(await preview(m.path, m.hash)) });
        else if (m.type === "restore" && m.path && m.hash) {
          const { v } = await version(m.path, m.hash);
          const failed = await source.operation("sync", {
            path: m.path,
            version: v,
          });
          if (failed) throw new SyncError(failed);
          reply({ type: "restored", path: m.path });
        }
      } catch (e) {
        const code = e instanceof SyncError ? e.code : "unknownError";
        reply({ type: "error", message: api.l10n.t(code) });
      }
    });
    return source.page("history.html").then((html) => {
      view.html = html;
    });
  };
  return [
    api.views.registerWebview(`${ID}.history`, {
      resolve: (view, context) => resolve(view, context?.state),
    }),
    api.commands.register(`${ID}.history`, async (path?: unknown) => {
      const root = await api.files.root();
      const rel =
        typeof path === "string" && root ? relative(root, path) : null;
      await api.layout.openView(`${ID}.history`, {
        title: rel
          ? api.l10n.t("historyOf", rel.split("/").pop())
          : api.l10n.t("deletedFiles"),
        state: { path: rel },
      });
    }),
  ];
}

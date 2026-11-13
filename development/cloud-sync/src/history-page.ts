// The history page: a file's older versions to look at and bring back, or
// (opened from the Plugins menu) the files deleted in the cloud.
interface Row {
  hash: string;
  size: number;
  at: string;
  until?: string;
  device: string;
  path?: string;
}
interface Listing {
  path: string | null;
  current?: { size: number; at?: string; device?: string } | null;
  versions?: Row[];
  deleted?: Row[];
}

const api = acquireTextusApi();
const $ = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T;
const statusLine = $("status"),
  list = $("list"),
  title = $("title"),
  preview = $("preview"),
  previewText = $("preview-text"),
  previewNote = $("preview-note"),
  restore = $<HTMLButtonElement>("restore");
let shown: Listing | null = null;
let chosen: Row | null = null;
// The listing the page opened on (undefined: none yet).
let started: string | null | undefined;
let restoredNote = false;

document.documentElement.lang = api.language;
for (const item of document.querySelectorAll<HTMLElement>("[data-t]"))
  item.textContent = api.t(item.dataset.t!);

const when = (iso: string) =>
  new Date(iso).toLocaleString(api.language, {
    dateStyle: "medium",
    timeStyle: "short",
  });
const size = (n: number) =>
  n < 1024
    ? api.t("sizeBytes", n)
    : n < 1024 * 1024
      ? api.t("sizeKb", (n / 1024).toFixed(1))
      : api.t("sizeMb", (n / 1024 / 1024).toFixed(1));

function say(text: string) {
  statusLine.textContent = text;
  statusLine.hidden = !text;
}
function rowButton(main: string, side: string, onPick: () => void) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "tx-list-row";
  b.tabIndex = list.childElementCount ? -1 : 0;
  b.setAttribute("role", "option");
  b.setAttribute("aria-selected", "false");
  const a = document.createElement("span");
  a.className = "tx-list-label";
  a.textContent = main;
  const c = document.createElement("span");
  c.className = "tx-list-meta";
  c.textContent = side;
  b.append(a, c);
  b.onclick = () => {
    for (const x of list.querySelectorAll<HTMLElement>("[aria-selected]")) {
      x.setAttribute("aria-selected", String(x === b));
      x.tabIndex = x === b ? 0 : -1;
    }
    onPick();
  };
  return b;
}
// One tab stop: up and down move between the rows, Home and End to either end.
list.addEventListener("keydown", (e) => {
  const all = [...list.querySelectorAll<HTMLElement>(".tx-list-row")];
  const at = all.indexOf(document.activeElement as HTMLElement);
  const to = (
    { ArrowUp: at - 1, ArrowDown: at + 1, Home: 0, End: all.length - 1 } as Record<
      string,
      number
    >
  )[e.key];
  if (at < 0 || to === undefined || !all[to]) return;
  e.preventDefault();
  all[at].tabIndex = -1;
  all[to].tabIndex = 0;
  all[to].focus();
});
function render(l: Listing) {
  shown = l;
  chosen = null;
  preview.hidden = true;
  list.replaceChildren();
  if (started === undefined) started = l.path;
  $("head").hidden = started !== null || l.path === null;
  if (l.path === null) {
    title.textContent = api.t("deletedFiles");
    for (const d of l.deleted ?? [])
      list.append(
        rowButton(d.path!, when(d.until ?? d.at), () =>
          api.postMessage({ type: "open", path: d.path }),
        ),
      );
    say(l.deleted?.length ? "" : api.t("noDeleted"));
  } else {
    title.textContent = l.path;
    for (const v of l.versions ?? [])
      list.append(
        rowButton(
          [when(v.at), v.device].filter(Boolean).join(" · "),
          size(v.size),
          () => pick(v),
        ),
      );
    say(
      l.versions?.length
        ? l.current
          ? api.t("currentVersion", when(l.current.at ?? ""))
          : api.t("deletedInCloud")
        : api.t("noVersions"),
    );
  }
  title.hidden = list.hidden = !list.childElementCount;
  if (restoredNote) say(api.t("restored"));
  restoredNote = false;
}
function pick(v: Row) {
  chosen = v;
  preview.hidden = false;
  previewText.hidden = true;
  previewNote.textContent = api.t("loading");
  restore.disabled = false;
  api.postMessage({ type: "preview", path: shown?.path, hash: v.hash });
}
restore.onclick = () => {
  if (!chosen || !shown?.path) return;
  restore.disabled = true;
  say(api.t("restoring"));
  api.postMessage({ type: "restore", path: shown.path, hash: chosen.hash });
};
$("back").onclick = () => api.postMessage({ type: "open", path: null });

api.onMessage((raw) => {
  const m = raw as Listing & {
    type: string;
    hash?: string;
    text?: string;
    binary?: boolean;
    message?: string;
  };
  if (m.type === "list") render(m);
  else if (m.type === "preview" && m.hash === chosen?.hash) {
    previewNote.textContent = m.binary
      ? api.t("noPreview")
      : api.t("restoreHint");
    previewText.hidden = !!m.binary;
    previewText.textContent = m.text ?? "";
  } else if (m.type === "restored") {
    restoredNote = true;
    api.postMessage({ type: "open", path: m.path });
  } else if (m.type === "error") {
    say(m.message ?? "");
    restore.disabled = false;
  }
});
api.postMessage({ type: "ready" });

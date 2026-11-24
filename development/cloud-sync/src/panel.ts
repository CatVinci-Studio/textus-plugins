import {
  KEEP_DAYS,
  MAX_FILE_MIB,
  PARALLEL,
  type Config,
  type Result,
} from "./model";
import { providers, type Field } from "./config";

const api = acquireTextusApi();
const element = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T;
const input = (id: string) => element<HTMLInputElement>(id);
const secretFields = [
  "account",
  "secret",
  "token",
  "sync-password",
  "confirm-password",
];
const DEFAULT_PREFIX = "textus/my-workspace";
/** A first connection suggests a remote folder named after the workspace. */
function folderPrefix(root: string) {
  const name = (root.split(/[\\/]/).filter(Boolean).pop() ?? "")
    .replace(/[\x00-\x1f\x7f\\:*?"<>|]/g, "-")
    .replace(/[. ]+$/, "");
  return name ? `textus/${name}` : DEFAULT_PREFIX;
}

interface State {
  type: string;
  root: string | null;
  config: Config;
  busy: boolean;
  configured: boolean;
  message: string;
  error: boolean;
  progress: number | null;
  result?: Result;
  lastRun?: string;
  account?: string;
  phone?: boolean;
  note?: string;
}
let state: State | null = null;
/** The connection's form is open over a saved one (Edit). */
let editing = false;
/** The form holds what was typed: a state from the host doesn't refill it. */
let typed = false;

document.documentElement.lang = api.language;
for (const item of document.querySelectorAll<HTMLElement>("[data-t]"))
  item.textContent = api.t(item.dataset.t!);
document
  .querySelector("section.sync-status")
  ?.setAttribute("aria-label", api.t("name"));

const providerOf = (id: string) =>
  providers[id as Config["provider"]] ?? providers.s3;

/** A pick from Textus's own menu into a hidden field, its name on a button. */
function picker(
  id: string,
  values: readonly string[],
  label: (value: string) => string,
  picked: (value: string) => void,
  choices: () => readonly string[] = () => values,
) {
  const button = element<HTMLButtonElement>(`${id}-pick`);
  button.onclick = async () => {
    const now = input(id).value;
    const chosen = await api.menu(
      choices().map((v) => ({ label: label(v), value: v, checked: v === now })),
      button,
    );
    if (typeof chosen !== "string" || chosen === now) return;
    input(id).value = chosen;
    picked(chosen);
  };
}
picker(
  "provider",
  Object.keys(providers),
  (p) => api.t(p),
  (p) => {
    input("endpoint").value = "";
    input("region").value = providerOf(p).region ?? "";
    for (const id of secretFields) input(id).value = "";
    typed = true;
    formToggles();
  },
);
// Where the service has its own list, the region is picked from it.
picker(
  "region",
  [],
  String,
  () => {
    typed = true;
    formToggles();
  },
  () => Object.keys(providerOf(input("provider").value).regions ?? {}),
);
const keepLabel = (days: string) =>
  days === "0" ? api.t("keepForever") : api.t("keepDays", days);
const minutes = (m: string) => api.t("minutes", m);
const delayLabel = (m: string) => (m === "0" ? api.t("delayNone") : minutes(m));
/** Each option's choices, and how it reads. A value saved before these
 *  choices (an interval of 7) stays among them. */
const OPTION_PICKS: [string, readonly number[], (v: string) => string][] = [
  ["interval", [5, 10, 15, 30, 60], minutes],
  ["saveGap", [0, 1, 3, 5, 10], delayLabel],
  ["keepDays", KEEP_DAYS, keepLabel],
  ["parallel", PARALLEL, String],
  ["maxFileMiB", MAX_FILE_MIB, (v) => api.t("sizeMb", v)],
];
const optionLabel = (id: string, value: string) =>
  OPTION_PICKS.find(([k]) => k === id)![2](value);
for (const [id, values, label] of OPTION_PICKS)
  picker(
    id,
    values.map(String),
    label,
    (v) => {
      element(`${id}-name`).textContent = label(v);
      sendOptions();
    },
    () =>
      [...new Set([...values.map(Number), Number(input(id).value)])]
        .sort((a, b) => a - b)
        .map(String),
  );

/** The connection's fields, as the service asks for them. */
function formToggles() {
  const provider = input("provider").value;
  const encrypt = input("encrypt").checked;
  element("password-field").hidden = !encrypt;
  element("confirm-field").hidden = !encrypt;
  element("provider-name").textContent = api.t(provider);
  const spec = providerOf(provider);
  const shows = (field: Field) => spec.fields.includes(field);
  for (const field of ["endpoint", "bucket", "token", "pathStyle"] as const)
    element(`${field}-field`).hidden = !shows(field);
  element("region-row").hidden = !spec.regions;
  element("region-field").hidden = !shows("region") || !!spec.regions;
  element("region-name").textContent = input("region").value || api.t("choose");
  element("s3-more").hidden = [
    ...element("s3-more").querySelectorAll<HTMLElement>(".tx-row"),
  ].every((row) => row.hidden);
  element("provider-help").hidden = !spec.help;
  element("provider-help").textContent = spec.help ? api.t(spec.help) : "";
  const [account, secret] = spec.signIn;
  element("account-label").textContent = api.t(account);
  element("secret-label").textContent = api.t(secret);
  input("endpoint").required = shows("endpoint") && !spec.endpoint;
  input("bucket").required = shows("bucket");
  // A saved connection's keys stay unless new ones are typed.
  for (const id of ["account", "secret", "sync-password"]) {
    input(id).placeholder = editing ? api.t("keptIfEmpty") : "";
    input(id).required = !editing && id !== "sync-password";
  }
  input("sync-password").required = !editing && encrypt;
  for (const id of ["password-field", "confirm-field"])
    for (const field of element(id).querySelectorAll("input"))
      field.disabled = element(id).hidden;
}

/** The saved connection's card, or the form, and the options below. */
function show() {
  if (!state) return;
  const { config, configured, busy, root } = state;
  const form = !configured || editing;
  element("connected").hidden = form || !root;
  element("connection").hidden = !form || !root;
  for (const id of ["options", "rules"]) element(id).hidden = !configured;
  // Its memory and battery: a phone's own choice.
  element("maxFileMiB-field").hidden = !state.phone;
  element("cancel-edit").hidden = !editing;
  element("c-service").textContent = api.t(config.provider);
  element("c-endpoint").textContent = config.endpoint;
  const spec = providerOf(config.provider);
  // An address typed in or made from the region picked.
  element("c-endpoint-row").hidden =
    !spec.fields.includes("endpoint") && !spec.regions;
  element("c-bucket").textContent = config.bucket;
  element("c-bucket-row").hidden = !spec.fields.includes("bucket");
  element("c-account-label").textContent = api.t(spec.signIn[0]);
  element("c-account").textContent = state.account ?? "";
  element("c-prefix").textContent = config.prefix;
  element("c-encrypt").textContent = api.t(
    config.encrypt ? "encryptionOn" : "encryptionOff",
  );
  element<HTMLFieldSetElement>("fields").disabled = busy || !root;
  for (const id of ["test", "save", "test-saved", "edit", "disconnect"])
    element<HTMLButtonElement>(id).disabled = busy || !root;
  for (const id of ["sync", "unlock"])
    element<HTMLButtonElement>(id).disabled = busy || !root || !configured;
  // The sidebar offers Sync now only once there is something to sync.
  document.body.dataset.ready = String(!!root && configured);
}

/** The form filled from the saved connection (or a new one's defaults). */
function fillForm(config: Config, root: string | null) {
  const prefix =
    !state?.configured && root && config.prefix === DEFAULT_PREFIX
      ? folderPrefix(root)
      : config.prefix;
  for (const id of ["provider", "endpoint", "region", "bucket"] as const)
    input(id).value = String(config[id]);
  input("prefix").value = prefix;
  input("pathStyle").checked = config.pathStyle;
  input("encrypt").checked = config.encrypt;
  for (const id of secretFields) input(id).value = "";
  typed = false;
  formToggles();
}

/** The options filled from what is saved. */
function fillOptions(config: Config) {
  input("automatic").checked = config.automatic;
  for (const [id] of OPTION_PICKS) {
    const value = String(config[id as keyof Config]);
    input(id).value = value;
    element(`${id}-name`).textContent = optionLabel(id, value);
  }
  element<HTMLTextAreaElement>("exclude").value = config.exclude;
  input("gitignore").checked = config.gitignore;
  input("obsidian").checked = config.obsidian;
  optionToggles();
}
function optionToggles() {
  const automatic = input("automatic").checked;
  element("interval-field").hidden = !automatic;
  element("saveGap-field").hidden = !automatic;
}

/** The options, sent as they change (a number once it is a valid one). */
let pending: ReturnType<typeof setTimeout> | undefined;
function sendOptions(wait = 0) {
  clearTimeout(pending);
  pending = setTimeout(() => {
    api.postMessage({
      type: "options",
      options: {
        automatic: input("automatic").checked,
        interval: Number(input("interval").value),
        saveGap: Number(input("saveGap").value),
        keepDays: Number(input("keepDays").value),
        parallel: Number(input("parallel").value),
        maxFileMiB: Number(input("maxFileMiB").value),
        exclude: element<HTMLTextAreaElement>("exclude").value,
        gitignore: input("gitignore").checked,
        obsidian: input("obsidian").checked,
      },
    });
  }, wait);
}
for (const id of ["options", "rules"]) {
  element(id).addEventListener("change", () => {
    optionToggles();
    sendOptions();
  });
  element(id).addEventListener("submit", (e) => e.preventDefault());
}

/** The form's connection and keys, for a test or a save. */
function draft() {
  const encrypt = input("encrypt").checked;
  return {
    config: {
      provider: input("provider").value as Config["provider"],
      endpoint: input("endpoint").value,
      region: input("region").value,
      bucket: input("bucket").value,
      prefix: input("prefix").value,
      pathStyle: input("pathStyle").checked,
      encrypt,
    },
    credentials: {
      account: input("account").value,
      secret: input("secret").value,
      sessionToken: input("token").value,
      syncPassword: encrypt ? input("sync-password").value : "",
      confirmPassword: encrypt ? input("confirm-password").value : "",
    },
  };
}
function submit(type: "save" | "test") {
  if (state?.busy) return;
  if (!element<HTMLFormElement>("connection").reportValidity()) return;
  api.postMessage({ type, ...draft() });
}
// Textus intentionally omits allow-forms from webview sandboxes. Submit
// through the message bridge, including Enter, without native form submission.
element("save").onclick = () => submit("save");
element("test").onclick = () => submit("test");
element("connection").addEventListener("submit", (e) => e.preventDefault());
element("connection").addEventListener("input", () => (typed = true));
element("connection").addEventListener("change", () => {
  typed = true;
  formToggles();
});
element("connection").addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
    event.preventDefault();
    submit("save");
  }
});
element("edit").onclick = () => {
  editing = true;
  if (state) fillForm(state.config, state.root);
  show();
  input("account").focus();
};
element("cancel-edit").onclick = () => {
  editing = false;
  if (state) fillForm(state.config, state.root);
  show();
};
element("test-saved").onclick = () => api.postMessage({ type: "test" });
for (const id of ["sync", "unlock", "cancel", "openSettings", "disconnect"])
  element(id).onclick = () => api.postMessage({ type: id });

/** A list under its title: the conflict copies to open, files left out
 *  for their size folded under a line, the rest as they are. */
function showResult(result?: Result, limit = 0) {
  const container = element("results");
  container.replaceChildren();
  for (const key of ["conflicts", "deferred", "notTrashed"] as const) {
    const entries = result?.[key];
    if (!entries?.length) continue;
    const title = document.createElement("h3");
    title.textContent = api.t(key);
    const list = document.createElement(key === "conflicts" ? "div" : "ul");
    if (key === "conflicts") list.className = "tx-list";
    for (const path of entries) {
      const row = document.createElement(key === "conflicts" ? "button" : "li");
      row.textContent = path;
      if (row instanceof HTMLButtonElement) {
        row.type = "button";
        row.className = "tx-list-row";
        row.onclick = () => api.postMessage({ type: "openConflict", path });
      }
      list.append(row);
    }
    container.append(title, list);
  }
  const large = result?.tooLarge ?? [];
  if (!large.length) return;
  const fold = document.createElement("details");
  fold.className = "tx-disclosure";
  const line = document.createElement("summary");
  line.textContent = api.t("tooLargeFiles", large.length, limit);
  const list = document.createElement("ul");
  for (const path of large) {
    const row = document.createElement("li");
    row.textContent = path;
    list.append(row);
  }
  fold.append(line, list);
  container.append(fold);
}

// Older Textus has only onMessage.
api["onDidReceiveMessage" in api ? "onDidReceiveMessage" : "onMessage"](
  (value) => {
    const m = value as State;
    // Saved: the form closes onto the connection's card.
    if (m.type === "saved") {
      editing = false;
      typed = false;
      api.postMessage({ type: "ready" });
      return;
    }
    if (m.type !== "state") return;
    const first = !state || state.root !== m.root;
    const was = state;
    state = m;
    if (first || (!typed && !editing)) fillForm(m.config, m.root);
    if (first || was?.configured !== m.configured) editing = false;
    // Not under the rules being typed.
    if (document.activeElement?.closest(".options") == null || first)
      fillOptions(m.config);
    element("status").textContent = m.message || api.t("loading");
    element("status").dataset.error = String(m.error);
    element("cancel").hidden = !m.busy;
    // Textus's progress bar (tx-progress): how far, or a sweep when unknown.
    const progress = element("progress");
    progress.hidden = !m.busy;
    progress.classList.toggle("is-indeterminate", m.progress == null);
    progress.style.setProperty("--value", String(m.progress ?? 0));
    // What is synced where, as saved.
    const summary = element("summary");
    summary.hidden = !m.configured;
    summary.textContent = [
      api.t(m.config.provider),
      m.config.prefix,
      m.config.automatic
        ? api.t("summaryAuto", m.config.interval)
        : api.t("summaryManual"),
    ].join(" · ");
    const last = element("last-run");
    last.hidden = !m.lastRun;
    last.textContent = m.lastRun
      ? `${api.t("lastRun")} · ${new Date(m.lastRun).toLocaleString(api.language)}`
      : "";
    showResult(m.result, m.config.maxFileMiB);
    const note = element("note");
    note.hidden = !m.note;
    note.textContent = m.note ?? "";
    show();
  },
);
api.postMessage({ type: "ready" });

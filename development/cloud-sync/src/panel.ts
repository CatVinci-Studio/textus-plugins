import { KEEP_DAYS, PARALLEL, type Config, type Result } from "./model";
import { providers } from "./config";

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

// Each service names its sign-in its own way.
const signIn: Record<string, [string, string]> = {
  s3: ["accountS3", "secretS3"],
  webdav: ["accountDav", "secretDav"],
  nutstore: ["accountNutstore", "secretNutstore"],
};

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
  ["s3", "webdav", "nutstore"],
  (p) => api.t(p),
  () => {
    input("endpoint").value = "";
    for (const id of secretFields) input(id).value = "";
    typed = true;
    formToggles();
  },
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
  element("bucket-field").hidden = provider !== "s3";
  element("s3-more").hidden = provider !== "s3";
  element("endpoint-field").hidden = provider === "nutstore";
  element("nutstore-help").hidden = provider !== "nutstore";
  const [account, secret] = signIn[provider] ?? signIn.s3;
  element("account-label").textContent = api.t(account);
  element("secret-label").textContent = api.t(secret);
  input("endpoint").required = provider !== "s3";
  if (provider === "nutstore")
    input("endpoint").value = providers.nutstore.endpoint;
  input("bucket").required = provider === "s3";
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
  element("cancel-edit").hidden = !editing;
  element("c-service").textContent = api.t(config.provider);
  element("c-endpoint").textContent = config.endpoint;
  element("c-endpoint-row").hidden = config.provider === "nutstore";
  element("c-bucket").textContent = config.bucket;
  element("c-bucket-row").hidden = config.provider !== "s3";
  element("c-account-label").textContent = api.t(
    (signIn[config.provider] ?? signIn.s3)[0],
  );
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

function showResult(result?: Result) {
  const container = element("results");
  container.replaceChildren();
  for (const key of ["conflicts", "deferred"] as const) {
    const entries = result?.[key];
    if (!entries?.length) continue;
    const title = document.createElement("h3");
    title.textContent = api.t(key);
    const list = document.createElement("ul");
    for (const path of entries) {
      const row = document.createElement("li");
      row.textContent = path;
      list.append(row);
    }
    container.append(title, list);
  }
}

api.onMessage((value) => {
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
  showResult(m.result);
  show();
});
api.postMessage({ type: "ready" });

"use strict";
(() => {
  // development/cloud-sync/src/model.ts
  var CHUNK_SIZE = 2 * 1024 * 1024;
  var MAX_FILE_SIZE = 128 * 1024 * 1024;
  var TRANSFER_BYTES = 32 * 1024 * 1024;
  var MAX_MANIFEST_SIZE = 8 * 1024 * 1024;
  var MAX_HISTORY_SIZE = 8 * 1024 * 1024;
  var KEEP_DAYS = [30, 90, 365, 0];
  var PARALLEL = [1, 2, 4, 8, 16, 32];
  var MAX_FILE_MIB = [8, 16, 32, 64, 128];

  // development/cloud-sync/src/config.ts
  var providers = {
    s3: { transport: "s3", endpoint: "", saveGap: 0, parallel: 8 },
    kodo: { transport: "s3", endpoint: "", saveGap: 0, parallel: 8 },
    webdav: { transport: "dav", endpoint: "", saveGap: 0, parallel: 4 },
    nutstore: {
      transport: "dav",
      endpoint: "https://dav.jianguoyun.com/dav",
      saveGap: 3,
      parallel: 2
    }
  };

  // development/cloud-sync/src/panel.ts
  var api = acquireTextusApi();
  var element = (id) => document.getElementById(id);
  var input = (id) => element(id);
  var secretFields = [
    "account",
    "secret",
    "token",
    "sync-password",
    "confirm-password"
  ];
  var DEFAULT_PREFIX = "textus/my-workspace";
  function folderPrefix(root) {
    const name = (root.split(/[\\/]/).filter(Boolean).pop() ?? "").replace(/[\x00-\x1f\x7f\\:*?"<>|]/g, "-").replace(/[. ]+$/, "");
    return name ? `textus/${name}` : DEFAULT_PREFIX;
  }
  var state = null;
  var editing = false;
  var typed = false;
  document.documentElement.lang = api.language;
  for (const item of document.querySelectorAll("[data-t]"))
    item.textContent = api.t(item.dataset.t);
  document.querySelector("section.sync-status")?.setAttribute("aria-label", api.t("name"));
  var signIn = {
    s3: ["accountS3", "secretS3"],
    kodo: ["accountS3", "secretS3"],
    webdav: ["accountDav", "secretDav"],
    nutstore: ["accountNutstore", "secretNutstore"]
  };
  function picker(id, values, label, picked, choices = () => values) {
    const button = element(`${id}-pick`);
    button.onclick = async () => {
      const now = input(id).value;
      const chosen = await api.menu(
        choices().map((v) => ({ label: label(v), value: v, checked: v === now })),
        button
      );
      if (typeof chosen !== "string" || chosen === now) return;
      input(id).value = chosen;
      picked(chosen);
    };
  }
  picker(
    "provider",
    ["s3", "kodo", "webdav", "nutstore"],
    (p) => api.t(p),
    () => {
      input("endpoint").value = "";
      for (const id of secretFields) input(id).value = "";
      typed = true;
      formToggles();
    }
  );
  var keepLabel = (days) => days === "0" ? api.t("keepForever") : api.t("keepDays", days);
  var minutes = (m) => api.t("minutes", m);
  var delayLabel = (m) => m === "0" ? api.t("delayNone") : minutes(m);
  var OPTION_PICKS = [
    ["interval", [5, 10, 15, 30, 60], minutes],
    ["saveGap", [0, 1, 3, 5, 10], delayLabel],
    ["keepDays", KEEP_DAYS, keepLabel],
    ["parallel", PARALLEL, String],
    ["maxFileMiB", MAX_FILE_MIB, (v) => api.t("sizeMb", v)]
  ];
  var optionLabel = (id, value) => OPTION_PICKS.find(([k]) => k === id)[2](value);
  for (const [id, values, label] of OPTION_PICKS)
    picker(
      id,
      values.map(String),
      label,
      (v) => {
        element(`${id}-name`).textContent = label(v);
        sendOptions();
      },
      () => [.../* @__PURE__ */ new Set([...values.map(Number), Number(input(id).value)])].sort((a, b) => a - b).map(String)
    );
  function formToggles() {
    const provider = input("provider").value;
    const encrypt = input("encrypt").checked;
    element("password-field").hidden = !encrypt;
    element("confirm-field").hidden = !encrypt;
    element("provider-name").textContent = api.t(provider);
    const s3 = provider === "s3" || provider === "kodo";
    element("bucket-field").hidden = !s3;
    element("s3-more").hidden = !s3;
    element("endpoint-field").hidden = provider === "nutstore";
    element("nutstore-help").hidden = provider !== "nutstore";
    const [account, secret] = signIn[provider] ?? signIn.s3;
    element("account-label").textContent = api.t(account);
    element("secret-label").textContent = api.t(secret);
    input("endpoint").required = provider !== "s3" && provider !== "kodo";
    if (provider === "nutstore")
      input("endpoint").value = providers.nutstore.endpoint;
    input("bucket").required = provider === "s3" || provider === "kodo";
    for (const id of ["account", "secret", "sync-password"]) {
      input(id).placeholder = editing ? api.t("keptIfEmpty") : "";
      input(id).required = !editing && id !== "sync-password";
    }
    input("sync-password").required = !editing && encrypt;
    for (const id of ["password-field", "confirm-field"])
      for (const field of element(id).querySelectorAll("input"))
        field.disabled = element(id).hidden;
  }
  function show() {
    if (!state) return;
    const { config, configured, busy, root } = state;
    const form = !configured || editing;
    element("connected").hidden = form || !root;
    element("connection").hidden = !form || !root;
    for (const id of ["options", "rules"]) element(id).hidden = !configured;
    element("maxFileMiB-field").hidden = !state.phone;
    element("cancel-edit").hidden = !editing;
    element("c-service").textContent = api.t(config.provider);
    element("c-endpoint").textContent = config.endpoint;
    element("c-endpoint-row").hidden = config.provider === "nutstore";
    element("c-bucket").textContent = config.bucket;
    element("c-bucket-row").hidden = config.provider !== "s3" && config.provider !== "kodo";
    element("c-account-label").textContent = api.t(
      (signIn[config.provider] ?? signIn.s3)[0]
    );
    element("c-account").textContent = state.account ?? "";
    element("c-prefix").textContent = config.prefix;
    element("c-encrypt").textContent = api.t(
      config.encrypt ? "encryptionOn" : "encryptionOff"
    );
    element("fields").disabled = busy || !root;
    for (const id of ["test", "save", "test-saved", "edit", "disconnect"])
      element(id).disabled = busy || !root;
    for (const id of ["sync", "unlock"])
      element(id).disabled = busy || !root || !configured;
    document.body.dataset.ready = String(!!root && configured);
  }
  function fillForm(config, root) {
    const prefix = !state?.configured && root && config.prefix === DEFAULT_PREFIX ? folderPrefix(root) : config.prefix;
    for (const id of ["provider", "endpoint", "region", "bucket"])
      input(id).value = String(config[id]);
    input("prefix").value = prefix;
    input("pathStyle").checked = config.pathStyle;
    input("encrypt").checked = config.encrypt;
    for (const id of secretFields) input(id).value = "";
    typed = false;
    formToggles();
  }
  function fillOptions(config) {
    input("automatic").checked = config.automatic;
    for (const [id] of OPTION_PICKS) {
      const value = String(config[id]);
      input(id).value = value;
      element(`${id}-name`).textContent = optionLabel(id, value);
    }
    element("exclude").value = config.exclude;
    input("gitignore").checked = config.gitignore;
    input("obsidian").checked = config.obsidian;
    optionToggles();
  }
  function optionToggles() {
    const automatic = input("automatic").checked;
    element("interval-field").hidden = !automatic;
    element("saveGap-field").hidden = !automatic;
  }
  var pending;
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
          exclude: element("exclude").value,
          gitignore: input("gitignore").checked,
          obsidian: input("obsidian").checked
        }
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
  function draft() {
    const encrypt = input("encrypt").checked;
    return {
      config: {
        provider: input("provider").value,
        endpoint: input("endpoint").value,
        region: input("region").value,
        bucket: input("bucket").value,
        prefix: input("prefix").value,
        pathStyle: input("pathStyle").checked,
        encrypt
      },
      credentials: {
        account: input("account").value,
        secret: input("secret").value,
        sessionToken: input("token").value,
        syncPassword: encrypt ? input("sync-password").value : "",
        confirmPassword: encrypt ? input("confirm-password").value : ""
      }
    };
  }
  function submit(type) {
    if (state?.busy) return;
    if (!element("connection").reportValidity()) return;
    api.postMessage({ type, ...draft() });
  }
  element("save").onclick = () => submit("save");
  element("test").onclick = () => submit("test");
  element("connection").addEventListener("submit", (e) => e.preventDefault());
  element("connection").addEventListener("input", () => typed = true);
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
  function showResult(result, limit = 0) {
    const container = element("results");
    container.replaceChildren();
    for (const key of ["conflicts", "deferred", "notTrashed"]) {
      const entries = result?.[key];
      if (!entries?.length) continue;
      const title = document.createElement("h3");
      title.textContent = api.t(key);
      const list2 = document.createElement(key === "conflicts" ? "div" : "ul");
      if (key === "conflicts") list2.className = "tx-list";
      for (const path of entries) {
        const row = document.createElement(key === "conflicts" ? "button" : "li");
        row.textContent = path;
        if (row instanceof HTMLButtonElement) {
          row.type = "button";
          row.className = "tx-list-row";
          row.onclick = () => api.postMessage({ type: "openConflict", path });
        }
        list2.append(row);
      }
      container.append(title, list2);
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
  api["onDidReceiveMessage" in api ? "onDidReceiveMessage" : "onMessage"](
    (value) => {
      const m = value;
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
      if (first || !typed && !editing) fillForm(m.config, m.root);
      if (first || was?.configured !== m.configured) editing = false;
      if (document.activeElement?.closest(".options") == null || first)
        fillOptions(m.config);
      element("status").textContent = m.message || api.t("loading");
      element("status").dataset.error = String(m.error);
      element("cancel").hidden = !m.busy;
      const progress = element("progress");
      progress.hidden = !m.busy;
      progress.classList.toggle("is-indeterminate", m.progress == null);
      progress.style.setProperty("--value", String(m.progress ?? 0));
      const summary = element("summary");
      summary.hidden = !m.configured;
      summary.textContent = [
        api.t(m.config.provider),
        m.config.prefix,
        m.config.automatic ? api.t("summaryAuto", m.config.interval) : api.t("summaryManual")
      ].join(" \xB7 ");
      const last = element("last-run");
      last.hidden = !m.lastRun;
      last.textContent = m.lastRun ? `${api.t("lastRun")} \xB7 ${new Date(m.lastRun).toLocaleString(api.language)}` : "";
      showResult(m.result, m.config.maxFileMiB);
      const note = element("note");
      note.hidden = !m.note;
      note.textContent = m.note ?? "";
      show();
    }
  );
  api.postMessage({ type: "ready" });
})();

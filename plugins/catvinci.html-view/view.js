(function () {
  "use strict";
  const api = acquireTextusApi();
  const t = api.t;
  const $ = (id) => document.getElementById(id);
  $("edit").textContent = t("edit");
  $("edit").onclick = () => api.postMessage({ type: "edit" });
  $("status").textContent = t("loading");
  // Only Textus's messages: the page shown can't post as it.
  api.onMessage((m) => {
    if (!m || typeof m !== "object") return;
    if (m.type === "file") {
      const bytes = m.bytes instanceof Uint8Array ? m.bytes : new Uint8Array(m.bytes || []);
      $("page").srcdoc = new TextDecoder().decode(bytes);
      $("status").hidden = true;
    } else if (m.type === "failed") {
      $("status").textContent = t("failed", m.message);
    }
  });
  api.postMessage({ type: "ready" });
})();

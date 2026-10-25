(function () {
  "use strict";
  const api = acquireTextusApi();
  const t = api.t;
  const $ = (id) => document.getElementById(id);
  $("edit").textContent = t("edit");
  $("edit").onclick = () => api.postMessage({ type: "edit" });

  api.onMessage(async (message) => {
    if (message.type !== "file") return;
    $("name").textContent = message.name;
    $("status").textContent = t("loading");
    try {
      await window.docx.renderAsync(
        new Blob([message.bytes]),
        $("pages"),
        undefined,
        {
          inWrapper: true,
          ignoreLastRenderedPageBreak: true,
          experimental: true,
          useBase64URL: true,
        },
      );
      $("status").textContent = "";
    } catch (err) {
      $("status").textContent = t("failed", (err && err.message) || err);
    }
  });
  api.postMessage({ type: "ready" });
})();

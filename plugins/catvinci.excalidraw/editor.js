// A drawing's page: Excalidraw on the whole tab, in Textus's language and
// light or dark as Textus is. Each change is sent to host.js a moment
// after the drawing stops changing, and at once when the tab goes away.
(function () {
  "use strict";
  const api = acquireTextusApi();
  const kit = window.ExcalidrawKit;
  const h = kit.React.createElement;
  const app = document.getElementById("app");
  const status = document.getElementById("status");

  // Its own stylesheet as text: one linked would be scaled with Textus's
  // interface, and Excalidraw sizes itself.
  const style = document.createElement("style");
  style.textContent = kit.css;
  document.head.appendChild(style);

  const LANGUAGES = { zh: "zh-CN", "zh-Hant": "zh-TW", ja: "ja-JP", ko: "ko-KR", es: "es-ES", fr: "fr-FR", de: "de-DE", ru: "ru-RU", pt: "pt-BR" };
  const SAVE_AFTER = 600;

  const root = kit.createRoot(app);
  let excalidraw = null;
  let initial = null;
  /** The scene version last shown or sent: Excalidraw also calls onChange
   *  when only the view moves, which isn't saved. */
  let version = -1;
  let timer = 0;
  let latest = null;

  const theme = () => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

  function save() {
    clearTimeout(timer);
    timer = 0;
    if (!latest) return;
    const { elements, appState, files } = latest;
    latest = null;
    api.postMessage({ type: "save", json: kit.serializeAsJSON(elements, appState, files, "local") });
  }

  function onChange(elements, appState, files) {
    const now = kit.getSceneVersion(elements);
    if (now === version) return;
    version = now;
    latest = { elements: elements, appState: appState, files: files };
    clearTimeout(timer);
    timer = setTimeout(save, SAVE_AFTER);
  }

  function onLinkOpen(element, event) {
    const link = element && element.link;
    if (!/^https?:\/\//i.test(String(link))) return;
    event.preventDefault();
    api.postMessage({ type: "link", url: link });
  }

  function render() {
    root.render(
      h(kit.Excalidraw, {
        initialData: initial,
        excalidrawAPI: (a) => (excalidraw = a),
        onChange: onChange,
        onLinkOpen: onLinkOpen,
        theme: theme(),
        langCode: LANGUAGES[api.language] || "en",
        UIOptions: { canvasActions: { loadScene: false, saveToActiveFile: false, export: false, toggleTheme: null } },
      }),
    );
  }

  /** The appState a file keeps that is still the file's: its background
   *  and grid, not where it was last scrolled or which theme it had. */
  function kept(appState) {
    const s = appState || {};
    const out = {};
    for (const key of ["viewBackgroundColor", "gridSize", "gridStep", "gridModeEnabled"]) if (key in s) out[key] = s[key];
    return out;
  }

  function showScene(scene) {
    status.hidden = true;
    app.hidden = false;
    const elements = kit.restoreElements(scene.elements || [], null);
    version = kit.getSceneVersion(elements);
    latest = null;
    clearTimeout(timer);
    if (!excalidraw) {
      initial = { elements: elements, appState: kept(scene.appState), files: scene.files || {}, scrollToContent: true };
      render();
      return;
    }
    excalidraw.updateScene({ elements: elements, appState: kept(scene.appState) });
    const files = Object.values(scene.files || {});
    if (files.length) excalidraw.addFiles(files);
  }

  function dataUrl(bytes, mime) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(new Blob([bytes], { type: mime }));
    });
  }

  async function addPictures(files) {
    const out = [];
    for (const f of files)
      out.push({ id: f.id, mimeType: f.mime, dataURL: await dataUrl(f.bytes, f.mime), created: Date.now() });
    if (excalidraw) excalidraw.addFiles(out);
  }

  new MutationObserver(() => excalidraw && render()).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  document.addEventListener("visibilitychange", () => document.hidden && save());
  window.addEventListener("pagehide", save);

  api.onDidReceiveMessage((m) => {
    if (!m) return;
    if (m.type === "scene") showScene(m.scene);
    else if (m.type === "pictures") addPictures(m.files);
    else if (m.type === "failed" || m.type === "error") {
      status.textContent = api.t("failed", m.message);
      status.hidden = false;
      if (m.type === "failed") app.hidden = true;
    }
  });
  api.postMessage({ type: "ready" });
})();

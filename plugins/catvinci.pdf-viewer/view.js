(function () {
  "use strict";
  const api = acquireTextusApi();
  const t = api.t;
  const $ = (id) => document.getElementById(id);
  // The icon buttons' names, in the UI's language.
  for (const [id, key] of [
    ["prev", "prevPage"],
    ["next", "nextPage"],
    ["zoom-out", "zoomOut"],
    ["zoom-in", "zoomIn"],
    ["find-open", "find"],
  ])
    for (const attr of ["aria-label", "title"])
      $(id).setAttribute(attr, api.t(key));
  const viewer = $("viewer");
  const status = $("status");
  $("find").placeholder = t("find");
  $("find").setAttribute("aria-label", t("find"));

  const libReady = new Promise((resolve) => {
    if (window.pdfjsLib) resolve();
    else window.addEventListener("pdfjs-ready", resolve, { once: true });
  });

  // PDF.js's data files - a CJK font's character map (cMap), a standard
  // font, an image decoder - asked of the host, which reads them from the plugin's lib
  // folder: the page has no network. Answers come back by id.
  const FOLDERS = {
    cMapUrl: "lib/cmaps/",
    standardFontDataUrl: "lib/standard_fonts/",
    // Decoders for scanned pages' JBIG2 and JPEG 2000 images.
    wasmUrl: "lib/wasm/",
  };
  const waiting = new Map();
  let asked = 0;
  class PluginData {
    async fetch({ kind, filename }) {
      const folder = FOLDERS[kind];
      if (!folder) throw new Error("No " + kind + " data in the plugin.");
      const id = ++asked;
      const bytes = await new Promise((resolve) => {
        waiting.set(id, resolve);
        api.postMessage({ type: "data", id: id, path: folder + filename });
      });
      if (!bytes) throw new Error(filename + " is not in the plugin.");
      return new Uint8Array(bytes);
    }
  }

  let pdf = null;
  let scale = 1;
  let fitWidth = true;
  let baseWidth = 612;
  let pages = [];
  let observer = null;
  let freer = null;

  function fitScale() {
    return Math.max(0.25, (viewer.clientWidth - 48) / baseWidth);
  }

  function showZoom() {
    $("zoom").textContent = Math.round(scale * 100) + "%";
    // The figure itself switches: fitted, it shows the page's own size.
    $("zoom").title = t(fitWidth ? "actual" : "fit");
  }

  // Each page is a placeholder of its size until it comes into view, then
  // drawn - a long PDF opens at once and draws only what is looked at.
  async function draw(div) {
    if (div.dataset.drawn === String(scale)) return;
    div.dataset.drawn = String(scale);
    const page = await pdf.getPage(Number(div.dataset.page));
    const viewport = page.getViewport({ scale: scale });
    const ratio = window.devicePixelRatio || 1;
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width * ratio);
    canvas.height = Math.floor(viewport.height * ratio);
    div.style.width = viewport.width + "px";
    div.style.height = viewport.height + "px";
    await page.render({
      canvas: canvas,
      viewport: viewport,
      transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0],
    }).promise;
    if (div.dataset.drawn !== String(scale)) return;
    const text = document.createElement("div");
    text.className = "textLayer";
    div.style.setProperty("--total-scale-factor", String(scale));
    div.replaceChildren(canvas, text);
    await new window.pdfjsLib.TextLayer({
      textContentSource: page.streamTextContent(),
      container: text,
      viewport: viewport,
    }).render();
    markHits(div);
  }

  // A drawn page far out of sight is a placeholder again: a long PDF
  // scrolled through keeps only the canvases near the view.
  function free(div) {
    if (!div.dataset.drawn) return;
    delete div.dataset.drawn;
    div.replaceChildren();
  }

  async function layout() {
    observer?.disconnect();
    freer?.disconnect();
    const first = await pdf.getPage(1);
    const base = first.getViewport({ scale: 1 });
    baseWidth = base.width;
    if (fitWidth) scale = fitScale();
    showZoom();
    const at = currentPage();
    viewer.textContent = "";
    pages = [];
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) void draw(entry.target);
        updatePage();
      },
      { root: viewer, rootMargin: "300px 0px" },
    );
    freer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (!entry.isIntersecting) free(entry.target);
      },
      { root: viewer, rootMargin: "3000px 0px" },
    );
    for (let n = 1; n <= pdf.numPages; n++) {
      const div = document.createElement("div");
      div.className = "page";
      div.dataset.page = String(n);
      div.style.width = base.width * scale + "px";
      div.style.height = base.height * scale + "px";
      viewer.append(div);
      pages.push(div);
      observer.observe(div);
      freer.observe(div);
    }
    $("count").textContent = "/ " + pdf.numPages;
    $("page").max = String(pdf.numPages);
    const start = restoring || at;
    restoring = 0;
    if (start > 1) goTo(start);
  }

  function currentPage() {
    const top = viewer.scrollTop + viewer.clientHeight / 3;
    const page = pages.find((div) => div.offsetTop + div.offsetHeight > top);
    return page ? Number(page.dataset.page) : 1;
  }
  function updatePage() {
    if (document.activeElement !== $("page"))
      $("page").value = String(currentPage());
    keep();
  }

  // Where the reader is - page and zoom - told to the host a moment after
  // it settles, for the PDF to open there next time.
  let restoring = 0;
  let keeping = 0;
  function keep() {
    if (!pdf) return;
    clearTimeout(keeping);
    keeping = setTimeout(() => {
      api.postMessage({
        type: "position",
        page: currentPage(),
        scale: fitWidth ? null : scale,
      });
    }, 600);
  }

  // Find: each page's text, read once; the pages holding the words, in
  // order; Enter goes to the next, Shift+Enter back.
  let texts = [];
  let query = "";
  let hits = [];
  let hit = -1;
  async function pageText(n) {
    if (texts[n] === undefined) {
      const page = await pdf.getPage(n);
      const content = await page.getTextContent();
      texts[n] = content.items
        .map((item) => item.str || "")
        .join(" ")
        .toLowerCase();
    }
    return texts[n];
  }
  function markHits(div) {
    for (const span of div.querySelectorAll(".textLayer span"))
      span.classList.toggle(
        "hit",
        !!query && span.textContent.toLowerCase().includes(query),
      );
  }
  async function find(back) {
    const q = $("find").value.trim().toLowerCase();
    if (!pdf) return;
    if (q !== query) {
      query = q;
      hits = [];
      hit = -1;
      if (q)
        for (let n = 1; n <= pdf.numPages; n++)
          if ((await pageText(n)).includes(q)) hits.push(n);
      for (const div of pages) markHits(div);
    }
    if (!q) {
      $("find-count").textContent = "";
      return;
    }
    if (!hits.length) {
      $("find-count").textContent = t("notFound");
      return;
    }
    hit = (hit + (back ? -1 : 1) + hits.length) % hits.length;
    $("find-count").textContent = hit + 1 + "/" + hits.length;
    goTo(hits[hit]);
  }
  function openFind() {
    $("find-box").hidden = false;
    $("find").focus();
    $("find").select();
  }
  function closeFind() {
    $("find-box").hidden = true;
    $("find").value = "";
    void find(false);
  }
  $("find-open").onclick = () =>
    $("find-box").hidden ? openFind() : closeFind();
  $("find").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void find(event.shiftKey);
    } else if (event.key === "Escape") closeFind();
  });
  window.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f") {
      event.preventDefault();
      openFind();
    }
  });
  function goTo(n) {
    const page = pages[Math.min(pages.length, Math.max(1, n)) - 1];
    if (page) viewer.scrollTop = page.offsetTop - 16;
  }
  viewer.addEventListener("scroll", updatePage, { passive: true });

  // A zoom stretches the pages drawn at once, keeping the spot at (x, y)
  // still, and draws them sharp again once it stops.
  let sharpening = 0;
  function zoomTo(next, x, y) {
    if (!pdf || !pages.length) return;
    next = Math.min(5, Math.max(0.25, next));
    if (next === scale) return;
    const box = viewer.getBoundingClientRect();
    x = x ?? box.left + box.width / 2;
    y = y ?? box.top + box.height / 2;
    const under =
      pages.find((div) => {
        const r = div.getBoundingClientRect();
        return r.bottom >= y;
      }) || pages[pages.length - 1];
    const before = under.getBoundingClientRect();
    const fx = (x - before.left) / before.width;
    const fy = (y - before.top) / before.height;
    const ratio = next / scale;
    scale = next;
    for (const div of pages) {
      div.style.width = parseFloat(div.style.width) * ratio + "px";
      div.style.height = parseFloat(div.style.height) * ratio + "px";
      div.style.setProperty("--total-scale-factor", String(scale));
    }
    const after = under.getBoundingClientRect();
    viewer.scrollLeft += after.left + fx * after.width - x;
    viewer.scrollTop += after.top + fy * after.height - y;
    showZoom();
    clearTimeout(sharpening);
    sharpening = setTimeout(() => {
      const view = viewer.getBoundingClientRect();
      for (const div of pages) {
        const r = div.getBoundingClientRect();
        if (r.bottom > view.top - 300 && r.top < view.bottom + 300)
          void draw(div);
        else free(div);
      }
      keep();
    }, 180);
  }
  function setScale(next, x, y) {
    fitWidth = false;
    zoomTo(next, x, y);
  }
  $("zoom-in").onclick = () => setScale(scale * 1.2);
  $("zoom-out").onclick = () => setScale(scale / 1.2);
  $("zoom").onclick = () => {
    if (fitWidth) return setScale(1);
    fitWidth = true;
    zoomTo(fitScale());
    showZoom();
  };
  $("prev").onclick = () => goTo(currentPage() - 1);
  $("next").onclick = () => goTo(currentPage() + 1);
  $("page").addEventListener("change", () => goTo(Number($("page").value)));
  viewer.addEventListener(
    "wheel",
    (event) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      // A pinch sends many small steps, a mouse wheel few large ones.
      const step = Math.max(-25, Math.min(25, event.deltaY));
      setScale(scale * Math.exp(-step * 0.01), event.clientX, event.clientY);
    },
    { passive: false },
  );
  let resizing = 0;
  window.addEventListener("resize", () => {
    if (!pdf || !fitWidth) return;
    clearTimeout(resizing);
    resizing = setTimeout(() => zoomTo(fitScale()), 150);
  });

  api.onMessage(async (message) => {
    if (message.type === "data") {
      waiting.get(message.id)?.(message.bytes);
      waiting.delete(message.id);
      return;
    }
    if (message.type === "goto") {
      if (pdf) goTo(message.page);
      else restoring = message.page;
      return;
    }
    if (message.type === "failed") {
      status.textContent = t("failed", message.message);
      return;
    }
    if (message.type !== "file") return;
    status.textContent = t("loading");
    try {
      await libReady;
      const lib = window.pdfjsLib;
      pdf = await lib.getDocument({
        data: message.bytes,
        isEvalSupported: false,
        useSystemFonts: true,
        BinaryDataFactory: PluginData,
        cMapPacked: true,
      }).promise;
      // Where it was left, else the zoom it opens at.
      const position = message.position;
      fitWidth = position ? !position.scale : true;
      scale = position?.scale || 1;
      restoring = message.page || position?.page || 0;
      texts = [];
      status.textContent = "";
      await layout();
    } catch (err) {
      status.textContent = t("failed", (err && err.message) || err);
    }
  });
  api.postMessage({ type: "ready" });
})();

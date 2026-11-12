(function () {
  "use strict";
  const api = acquireTextusApi();
  const t = api.t;
  const $ = (id) => document.getElementById(id);
  const pages = $("pages");
  $("edit").textContent = t("edit");
  $("edit").onclick = () => api.postMessage({ type: "edit" });
  for (const [id, key] of [
    ["zoom-out", "zoomOut"],
    ["zoom-in", "zoomIn"],
    ["find-open", "find"],
  ])
    for (const attr of ["aria-label", "title"])
      $(id).setAttribute(attr, t(key));
  $("find-input").placeholder = t("find");

  // Zoom: the pages scaled as a whole, from 50% to 200%. They open fitted
  // to the tab's width (never above 100%) until the reader zooms.
  const saved = api.getState() || {};
  let zoom = saved.zoom || 1;
  let fit = !saved.zoom;
  let natural = 0;
  function setZoom(next, x, y) {
    const before = zoom;
    zoom = Math.min(2, Math.max(0.5, Math.round(next * 100) / 100));
    const wrapper = pages.querySelector(".docx-wrapper");
    if (wrapper) wrapper.style.zoom = String(zoom);
    $("zoom").textContent = Math.round(zoom * 100) + "%";
    if (x !== undefined && wrapper) {
      // The point under the pointer stays where it was.
      const box = pages.getBoundingClientRect();
      const ratio = zoom / before;
      pages.scrollLeft =
        (pages.scrollLeft + x - box.left) * ratio - (x - box.left);
      pages.scrollTop = (pages.scrollTop + y - box.top) * ratio - (y - box.top);
    }
    api.setState({ zoom: fit ? 0 : zoom });
  }
  function zoomBy(next, x, y) {
    fit = false;
    setZoom(next, x, y);
  }
  function fitWidth() {
    if (fit && natural) setZoom(Math.min(1, pages.clientWidth / natural));
  }
  $("zoom-in").onclick = () => zoomBy(zoom + 0.1);
  $("zoom-out").onclick = () => zoomBy(zoom - 0.1);
  $("zoom").onclick = () => zoomBy(1);
  pages.addEventListener(
    "wheel",
    (event) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      // A pinch sends many small steps, a mouse wheel few large ones.
      const step = Math.max(-25, Math.min(25, event.deltaY));
      zoomBy(zoom * Math.exp(-step * 0.01), event.clientX, event.clientY);
    },
    { passive: false },
  );
  let resizing;
  window.addEventListener("resize", () => {
    clearTimeout(resizing);
    resizing = setTimeout(fitWidth, 120);
  });

  // "Page 3 of 12": the page the middle of the tab is on.
  const pageList = () => [...pages.querySelectorAll("section.docx")];
  function showPage() {
    const all = pageList();
    if (!all.length) return ($("page").textContent = "");
    const middle = pages.getBoundingClientRect().top + pages.clientHeight / 2;
    let at = 0;
    all.forEach((page, i) => {
      if (page.getBoundingClientRect().top <= middle) at = i;
    });
    $("page").textContent = t("page", at + 1, all.length);
  }
  pages.addEventListener("scroll", showPage, { passive: true });

  // Find: every match marked, Enter and Shift+Enter step through them.
  let hits = [];
  let current = -1;
  function clearHits() {
    for (const mark of pages.querySelectorAll("mark.tx-hit")) {
      mark.replaceWith(document.createTextNode(mark.textContent));
    }
    pages.normalize();
    hits = [];
    current = -1;
  }
  function find(query) {
    clearHits();
    const q = query.trim().toLowerCase();
    if (q) {
      // Not the stylesheets docx-preview puts among the pages.
      const walker = document.createTreeWalker(pages, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) =>
          node.parentNode.nodeName === "STYLE"
            ? NodeFilter.FILTER_REJECT
            : NodeFilter.FILTER_ACCEPT,
      });
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        let text = node.nodeValue;
        let at = text.toLowerCase().indexOf(q);
        let rest = node;
        while (at >= 0) {
          const match = rest.splitText(at);
          rest = match.splitText(q.length);
          const mark = document.createElement("mark");
          mark.className = "tx-hit";
          mark.textContent = match.nodeValue;
          match.replaceWith(mark);
          hits.push(mark);
          text = rest.nodeValue;
          at = text.toLowerCase().indexOf(q);
        }
      }
    }
    $("find-count").textContent = q
      ? hits.length
        ? t("findCount", 0, hits.length)
        : t("findNone")
      : "";
    if (hits.length) step(1);
  }
  function step(by) {
    if (!hits.length) return;
    hits[current]?.classList.remove("is-current");
    current = (current + by + hits.length) % hits.length;
    hits[current].classList.add("is-current");
    hits[current].scrollIntoView({ block: "center" });
    $("find-count").textContent = t("findCount", current + 1, hits.length);
  }
  function openFind() {
    $("find-bar").hidden = false;
    $("find-input").focus();
    $("find-input").select();
  }
  function closeFind() {
    $("find-bar").hidden = true;
    clearHits();
    $("find-count").textContent = "";
  }
  let typing;
  $("find-input").addEventListener("input", (event) => {
    clearTimeout(typing);
    typing = setTimeout(() => find(event.target.value), 200);
  });
  $("find-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") step(event.shiftKey ? -1 : 1);
    if (event.key === "Escape") closeFind();
  });
  $("find-open").onclick = openFind;
  $("find-close").onclick = closeFind;
  document.addEventListener("keydown", (event) => {
    const mod = event.metaKey || event.ctrlKey;
    if (mod && event.key.toLowerCase() === "f") {
      event.preventDefault();
      openFind();
    } else if (mod && (event.key === "=" || event.key === "+")) {
      event.preventDefault();
      zoomBy(zoom + 0.1);
    } else if (mod && event.key === "-") {
      event.preventDefault();
      zoomBy(zoom - 0.1);
    } else if (mod && event.key === "0") {
      event.preventDefault();
      zoomBy(1);
    }
  });

  api.onMessage(async (message) => {
    if (message.type === "failed") {
      $("status").textContent = t("failed", message.message);
      return;
    }
    if (message.type !== "file") return;
    try {
      await window.docx.renderAsync(
        new Blob([message.bytes]),
        pages,
        undefined,
        {
          inWrapper: true,
          ignoreLastRenderedPageBreak: true,
          experimental: true,
          useBase64URL: true,
        },
      );
      $("status").textContent = "";
      // The widest page and its margin, measured before any zoom.
      const wrapper = pages.querySelector(".docx-wrapper");
      const pad = wrapper
        ? parseFloat(getComputedStyle(wrapper).paddingLeft)
        : 0;
      natural =
        Math.max(0, ...pageList().map((page) => page.offsetWidth)) + 2 * pad;
      setZoom(zoom);
      fitWidth();
      showPage();
    } catch (err) {
      $("status").textContent = t("failed", (err && err.message) || err);
    }
  });
  $("status").textContent = t("loading");
  api.postMessage({ type: "ready" });
})();

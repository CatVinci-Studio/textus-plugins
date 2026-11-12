// A canvas's page: its nodes and edges on a stage to drag and zoom, fitted
// on open; the notes and pictures on it as host.js reads them. An
// Excalidraw drawing shows its exported picture on the same stage.
(function () {
  "use strict";
  const api = acquireTextusApi();
  const t = api.t;
  const jc = window.jsonCanvas;
  const $ = (id) => document.getElementById(id);
  const stage = $("stage");
  const world = $("world");
  const SVG = "http://www.w3.org/2000/svg";

  for (const [id, key] of [
    ["zoom-out", "zoomOut"],
    ["zoom-in", "zoomIn"],
    ["zoom", "fit"],
  ])
    for (const attr of ["aria-label", "title"]) $(id).setAttribute(attr, t(key));

  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  };
  const place = (node, box) => {
    node.style.left = box.x + "px";
    node.style.top = box.y + "px";
    node.style.width = box.width + "px";
    node.style.height = box.height + "px";
  };

  // The view: canvas point p shows at p * scale + (x, y) on the stage.
  let view = { x: 0, y: 0, scale: 1 };
  let box = null;
  let moved = false;
  function apply() {
    world.style.transform = "translate(" + view.x + "px, " + view.y + "px) scale(" + view.scale + ")";
    // The dots behind move and grow with the canvas.
    const step = 24 * view.scale;
    stage.style.backgroundSize = step + "px " + step + "px";
    stage.style.backgroundPosition = view.x + "px " + view.y + "px";
    $("zoom").textContent = Math.round(view.scale * 100) + "%";
  }
  function fitView() {
    const r = stage.getBoundingClientRect();
    view = jc.fit(box, r.width, r.height, 40);
    moved = false;
    apply();
  }
  function zoomBy(factor, px, py) {
    const r = stage.getBoundingClientRect();
    view = jc.zoomAt(view, factor, px == null ? r.width / 2 : px, py == null ? r.height / 2 : py);
    moved = true;
    apply();
  }
  $("zoom-in").onclick = () => zoomBy(1.25);
  $("zoom-out").onclick = () => zoomBy(1 / 1.25);
  $("zoom").onclick = fitView;
  new ResizeObserver(() => {
    if (box && !moved) fitView();
  }).observe(stage);

  // Dragging moves the canvas; two fingers pinch it; a press that doesn't
  // move is a click on what's under it.
  const pointers = new Map();
  let pressed = null;
  let pinch = null;
  const local = (e) => {
    const r = stage.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  stage.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    pointers.set(e.pointerId, local(e));
    pressed = pointers.size === 1 ? { target: e.target, at: local(e), far: false } : null;
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = { distance: Math.hypot(a.x - b.x, a.y - b.y) };
    }
    stage.setPointerCapture?.(e.pointerId);
    stage.classList.add("dragging");
  });
  window.addEventListener("pointermove", (e) => {
    const last = pointers.get(e.pointerId);
    if (!last) return;
    const now = local(e);
    pointers.set(e.pointerId, now);
    if (pointers.size === 2 && pinch) {
      const [a, b] = [...pointers.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch.distance > 0) zoomBy(distance / pinch.distance, (a.x + b.x) / 2, (a.y + b.y) / 2);
      pinch.distance = distance;
      return;
    }
    if (!pressed) return;
    if (!pressed.far && Math.hypot(now.x - pressed.at.x, now.y - pressed.at.y) <= 4) return;
    // Past the threshold: the canvas follows from where the press began.
    const from = pressed.far ? last : pressed.at;
    pressed.far = true;
    panBy(now.x - from.x, now.y - from.y);
  });
  const release = (e) => {
    if (!pointers.delete(e.pointerId)) return;
    if (pointers.size < 2) pinch = null;
    if (pointers.size) return;
    stage.classList.remove("dragging");
    const press = pressed;
    pressed = null;
    if (press && !press.far && e.type === "pointerup") activate(press.target);
  };
  window.addEventListener("pointerup", release);
  window.addEventListener("pointercancel", release);
  stage.addEventListener("lostpointercapture", release);

  /** A click: a link in a card, a link node or a file node opens. */
  function activate(target) {
    if (!(target instanceof Element)) return;
    const href = target.closest("a[data-href]");
    if (href) return api.postMessage({ type: "link", url: href.dataset.href });
    const node = target.closest(".node[data-url], .node[data-file]");
    if (!node) return;
    if (node.dataset.url) api.postMessage({ type: "link", url: node.dataset.url });
    else if (!node.classList.contains("missing"))
      api.postMessage({ type: "open", file: node.dataset.file, subpath: node.dataset.subpath || "" });
  }

  stage.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? stage.clientHeight : 1;
      if (jc.wheelIntent(e) === "zoom") {
        const p = local(e);
        const d = Math.max(-40, Math.min(40, e.deltaY * unit));
        return zoomBy(Math.exp(-d * 0.01), p.x, p.y);
      }
      view = { x: view.x - e.deltaX * unit, y: view.y - e.deltaY * unit, scale: view.scale };
      moved = true;
      apply();
    },
    { passive: false },
  );

  document.addEventListener("keydown", (e) => {
    if (!box) return;
    const mod = e.metaKey || e.ctrlKey;
    const key = e.key.toLowerCase();
    const step = 60;
    const keys = {
      "+": () => zoomBy(1.25),
      "=": () => zoomBy(1.25),
      "-": () => zoomBy(1 / 1.25),
      0: fitView,
      f: mod ? null : fitView,
      arrowleft: () => panBy(step, 0),
      arrowright: () => panBy(-step, 0),
      arrowup: () => panBy(0, step),
      arrowdown: () => panBy(0, -step),
    };
    const run = keys[key];
    if (!run || (mod && key.startsWith("arrow"))) return;
    e.preventDefault();
    run();
  });
  function panBy(dx, dy) {
    view = { x: view.x + dx, y: view.y + dy, scale: view.scale };
    moved = true;
    apply();
  }

  /** What a colour paints on a node or an edge, through CSS variables. */
  function paint(node, color) {
    const c = jc.color(color);
    if (!c) return;
    node.classList.add("colored");
    node.style.setProperty("--line", c.line);
    node.style.setProperty("--fill", c.fill);
    if (c.text) node.style.setProperty("--ink", c.text);
  }

  const hostOf = (url) => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  /** The file nodes showing each file, filled in as the host reads it. */
  const fileNodes = new Map();

  function drawNode(n) {
    const node = el("div", "node " + n.type);
    place(node, n);
    paint(node, n.color);
    if (n.type === "group") {
      if (n.label) node.append(el("div", "group-label", n.label));
    } else if (n.type === "text") {
      const body = el("div", "content markdown");
      body.innerHTML = jc.markdown(n.text);
      node.append(body);
    } else if (n.type === "link") {
      node.dataset.url = n.url;
      node.title = n.url;
      const body = el("div", "content");
      body.append(el("div", "link-host", hostOf(n.url)), el("div", "link-url", n.url));
      node.append(body);
    } else {
      node.dataset.file = n.file;
      if (n.subpath) node.dataset.subpath = n.subpath;
      node.title = n.file + (n.subpath || "");
      node.append(el("div", "file-name", jc.titleOf(n.file) + (n.subpath || "")));
      if (!fileNodes.has(n.file)) fileNodes.set(n.file, []);
      fileNodes.get(n.file).push(node);
    }
    return node;
  }

  function drawEdges(canvas, byId) {
    const svg = document.createElementNS(SVG, "svg");
    svg.classList.add("edges");
    const labels = [];
    for (const edge of canvas.edges) {
      const geo = jc.edgePath(edge, byId);
      if (!geo) continue;
      const g = document.createElementNS(SVG, "g");
      g.classList.add("edge");
      paint(g, edge.color);
      const path = document.createElementNS(SVG, "path");
      path.setAttribute("d", geo.d);
      g.append(path);
      for (const corners of geo.arrows) {
        const head = document.createElementNS(SVG, "polygon");
        head.setAttribute("points", corners);
        g.append(head);
      }
      svg.append(g);
      if (edge.label) {
        const label = el("div", "edge-label", edge.label);
        label.style.left = geo.middle.x + "px";
        label.style.top = geo.middle.y + "px";
        paint(label, edge.color);
        labels.push(label);
      }
    }
    return [svg, ...labels];
  }

  function drawCanvas(canvas) {
    const byId = {};
    for (const n of canvas.nodes) byId[n.id] = n;
    const groups = canvas.nodes.filter((n) => n.type === "group").map(drawNode);
    const others = canvas.nodes.filter((n) => n.type !== "group").map(drawNode);
    world.replaceChildren(...groups, ...others, ...drawEdges(canvas, byId));
    box = jc.bounds(canvas.nodes);
    if (!box) return noContent(t("empty"));
    fitView();
  }

  const pictures = [];
  function picture(bytes, mime, name) {
    const url = URL.createObjectURL(new Blob([bytes], { type: mime }));
    pictures.push(url);
    const img = el("img");
    img.src = url;
    img.alt = name || "";
    img.draggable = false;
    return img;
  }
  window.addEventListener("pagehide", () => pictures.forEach((u) => URL.revokeObjectURL(u)));

  /** A file node's content, as the host read it. */
  function fillFile(m) {
    for (const node of fileNodes.get(m.file) || []) {
      node.classList.add(m.kind);
      if (m.kind === "note") {
        node.querySelector(".file-name").textContent = m.title + (node.dataset.subpath || "");
        const body = el("div", "content markdown");
        body.innerHTML = jc.markdown(m.text);
        node.append(body);
      } else if (m.kind === "image") {
        node.append(picture(m.bytes, m.mime, m.file));
      } else if (m.kind === "missing") {
        node.append(el("div", "content note-missing", t("missing")));
      }
    }
  }

  /** No canvas to show: only the message, without the stage or its bar. */
  function noContent(text, withButton) {
    stage.hidden = true;
    $("bar").hidden = true;
    const status = $("status");
    status.replaceChildren(el("span", "", text));
    if (withButton) {
      const button = el("button", "tx-button", t("openAsText"));
      button.onclick = () => api.postMessage({ type: "text" });
      status.append(button);
    }
    status.hidden = false;
  }

  /** An Excalidraw drawing: its exported picture to look around, or why
   *  there is none. */
  function drawExcalidraw(m) {
    if (!m.picture) return noContent(t("excalidraw"), true);
    const img = picture(m.picture.bytes, m.picture.mime, m.picture.name);
    img.className = "drawing";
    img.onload = () => {
      box = { x: 0, y: 0, width: img.naturalWidth || 800, height: img.naturalHeight || 600 };
      place(img, box);
      fitView();
    };
    img.onerror = () => noContent(t("excalidraw"), true);
    world.replaceChildren(img);
  }

  api.onMessage((m) => {
    if (!m) return;
    if (m.type === "canvas") drawCanvas(m.canvas);
    else if (m.type === "file") fillFile(m);
    else if (m.type === "excalidraw") drawExcalidraw(m);
    else if (m.type === "failed") noContent(t("failed", m.message), true);
  });
  apply();
  api.postMessage({ type: "ready" });
})();

(function () {
  "use strict";
  const api = acquireTextusApi();
  const t = api.t;
  const $ = (id) => document.getElementById(id);
  // The icon buttons' names, in the UI's language.
  for (const [id, key] of [
    ["zoom-out", "zoomOut"],
    ["zoom-in", "zoomIn"],
    ["rotate", "rotate"],
  ])
    for (const attr of ["aria-label", "title"])
      $(id).setAttribute(attr, api.t(key));
  const stage = $("stage");
  const image = $("image");
  let zoom = 1;
  let fit = true;
  // A quarter turn at a time, for a photo taken on its side - the view
  // only, the file stays as it is.
  let turns = 0;

  $("fit").textContent = t("fit");
  $("actual").textContent = t("actual");
  $("source").textContent = t("source");

  const scaleNow = () =>
    image.naturalWidth ? image.width / image.naturalWidth : 1;

  function show() {
    stage.classList.toggle("fit", fit);
    image.style.width = fit ? "" : image.naturalWidth * zoom + "px";
    image.style.transform = turns ? "rotate(" + turns * 90 + "deg)" : "";
    // On its side, fitting means fitting the other way round.
    stage.classList.toggle("sideways", turns % 2 === 1);
    $("zoom").textContent = Math.round((fit ? scaleNow() : zoom) * 100) + "%";
  }
  function setZoom(next) {
    fit = false;
    zoom = Math.min(16, Math.max(0.05, next));
    show();
  }
  const current = () => (fit ? scaleNow() : zoom);
  $("zoom-in").onclick = () => setZoom(current() * 1.25);
  $("zoom-out").onclick = () => setZoom(current() / 1.25);
  $("actual").onclick = () => setZoom(1);
  const toFit = () => {
    fit = true;
    show();
  };
  $("fit").onclick = toFit;
  $("rotate").onclick = () => {
    turns = (turns + 1) % 4;
    show();
  };
  // Double-click: fit, or the picture's own size where it was clicked.
  stage.addEventListener("dblclick", (event) => {
    if (!fit) return toFit();
    const box = image.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    setZoom(1);
    stage.scrollLeft = x * stage.scrollWidth - stage.clientWidth / 2;
    stage.scrollTop = y * stage.scrollHeight - stage.clientHeight / 2;
  });
  // Bigger than the tab: drag it around.
  let drag = null;
  stage.addEventListener("pointerdown", (event) => {
    if (fit || event.button !== 0) return;
    drag = {
      x: event.clientX,
      y: event.clientY,
      left: stage.scrollLeft,
      top: stage.scrollTop,
    };
    stage.setPointerCapture(event.pointerId);
    stage.classList.add("dragging");
  });
  stage.addEventListener("pointermove", (event) => {
    if (!drag) return;
    stage.scrollLeft = drag.left - (event.clientX - drag.x);
    stage.scrollTop = drag.top - (event.clientY - drag.y);
  });
  const endDrag = () => {
    drag = null;
    stage.classList.remove("dragging");
  };
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);
  // + and - zoom, 0 is the picture's own size, F fits it, R turns it.
  document.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const key = event.key.toLowerCase();
    if (key === "+" || key === "=") setZoom(current() * 1.25);
    else if (key === "-") setZoom(current() / 1.25);
    else if (key === "0") setZoom(1);
    else if (key === "f") toFit();
    else if (key === "r") $("rotate").click();
    else return;
    event.preventDefault();
  });
  stage.addEventListener(
    "wheel",
    (event) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      setZoom(current() * (event.deltaY < 0 ? 1.1 : 1 / 1.1));
    },
    { passive: false },
  );
  window.addEventListener("resize", () => fit && show());

  const size = (bytes) =>
    bytes < 1024 * 1024
      ? Math.max(1, Math.round(bytes / 1024)) + " KB"
      : (bytes / 1024 / 1024).toFixed(1) + " MB";

  const failed = () => {
    stage.hidden = true;
    $("info").textContent = t("failed");
  };

  api.onMessage((message) => {
    if (message.type === "failed") return failed();
    if (message.type !== "file") return;
    const svg = /\.svg$/i.test(message.name);
    // Shown as a picture, an SVG's scripts never run.
    image.src = URL.createObjectURL(
      new Blob([message.bytes], { type: svg ? "image/svg+xml" : "" }),
    );
    image.alt = message.name;
    // Not a picture the system can draw, however it is named.
    image.onerror = failed;
    image.onload = () => {
      $("info").textContent =
        image.naturalWidth +
        " × " +
        image.naturalHeight +
        " · " +
        size(message.bytes.length);
      show();
    };
    if (!svg) return;
    const button = $("source");
    const code = $("code");
    button.hidden = false;
    code.textContent = new TextDecoder().decode(message.bytes);
    button.onclick = () => {
      const toSource = code.hidden;
      code.hidden = !toSource;
      stage.hidden = toSource;
      button.textContent = toSource ? t("picture") : t("source");
    };
  });
  api.postMessage({ type: "ready" });
})();

// A ```card block's page: the card host.js sends, opened in the browser on
// a click; a video plays in place. Fetch again sits in its right-click menu.
(function () {
  "use strict";
  const api = acquireTextusApi();
  const root = document.getElementById("card");
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  };
  const domain = (url) => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  let refresh = null;
  root.addEventListener("contextmenu", async (e) => {
    if (!refresh) return;
    e.preventDefault();
    const chosen = await api.menu([{ label: refresh, value: "refresh" }], { x: e.clientX, y: e.clientY });
    if (chosen === "refresh") api.postMessage({ type: "refresh" });
  });

  api.onMessage((m) => {
    if (!m || m.type !== "card") return;
    refresh = m.refresh || null;
    const card = m.card || {};
    if (m.video) {
      const box = el("div", "video");
      const frame = document.createElement("iframe");
      frame.src = m.video;
      frame.allow = "fullscreen; picture-in-picture";
      frame.setAttribute("allowfullscreen", "");
      box.append(frame);
      return root.replaceChildren(box);
    }
    const link = el("button", "tx-card link");
    link.type = "button";
    const text = el("div", "text");
    text.append(el("div", "title", card.title || card.url || ""));
    if (card.description) text.append(el("div", "description", card.description));
    const site = el("div", "site");
    if (card.favicon && /^https?:\/\//.test(card.favicon)) {
      const icon = el("img", "favicon");
      icon.src = card.favicon;
      icon.alt = "";
      icon.onerror = () => icon.remove();
      site.append(icon);
    }
    const where = domain(card.url || "");
    site.append(card.site && card.site !== where ? card.site + " · " + where : where);
    text.append(site);
    link.append(text);
    if (card.image && /^https?:\/\//.test(card.image)) {
      const picture = el("div", "picture");
      picture.style.backgroundImage = "url(" + JSON.stringify(card.image) + ")";
      link.append(picture);
    }
    link.addEventListener("click", () => api.postMessage({ type: "open", url: card.url }));
    root.replaceChildren(link);
  });
  api.postMessage({ type: "ready" });
})();

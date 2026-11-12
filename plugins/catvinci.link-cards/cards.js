// Link Cards: what a ```card block holds - or a ```cardlink (Obsidian's
// Auto Card Link) or ```embed (Link Embed) block - and what a web page
// says about itself (its title, description and picture). Pure, for the
// host and the tests.

(function (root) {
  const FIELDS = ["url", "title", "description", "image", "site"];
  // Read too: what Obsidian's card plugins write besides ours.
  const READ = FIELDS.concat(["host", "favicon"]);

  /** A YAML scalar's text: its quotes taken off, '' and \" unescaped. */
  function unquote(value) {
    const v = value.trim();
    if (v.length > 1 && v[0] === '"' && v[v.length - 1] === '"') {
      try {
        return JSON.parse(v);
      } catch {
        // Quotes inside, not around: as written.
        return v;
      }
    }
    if (v.length > 1 && v[0] === "'" && v[v.length - 1] === "'") return v.slice(1, -1).replace(/''/g, "'");
    return v;
  }

  /** A block's `key: value` lines. Obsidian's `host` is the card's site
   *  when it names none. */
  function parse(source) {
    const card = {};
    for (const line of String(source).split("\n")) {
      const m = /^(\w+)\s*:\s*(.*)$/.exec(line.trim());
      const key = m && m[1].toLowerCase();
      if (key && READ.includes(key)) {
        const value = unquote(m[2]);
        if (value) card[key] = value;
      }
    }
    if (card.host && !card.site) card.site = card.host;
    delete card.host;
    return card;
  }

  /** `card` as a block's source: one line each, no line breaks inside. */
  function write(card) {
    return FIELDS.filter((k) => card[k])
      .map((k) => k + ": " + String(card[k]).replace(/\s+/g, " ").trim())
      .join("\n");
  }

  const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  const decode = (s) =>
    s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (all, e) =>
      e[0] === "#"
        ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : Number(e.slice(1)))
        : ENTITIES[e.toLowerCase()] || all,
    );

  /** A page's card: Open Graph's title, description, picture and site, else
   *  its <title> and description meta. Relative picture addresses are made
   *  whole against `url`. */
  function fromHtml(html, url) {
    const head = String(html).slice(0, 200000);
    const meta = (names) => {
      for (const name of names) {
        const re = new RegExp(
          "<meta[^>]+(?:property|name)=[\"']" + name.replace(/[.:]/g, "\\$&") + "[\"'][^>]*>",
          "i",
        );
        const tag = re.exec(head);
        const content = tag && /content=(?:"([^"]*)"|'([^']*)')/i.exec(tag[0]);
        const value = content ? (content[1] ?? content[2]).trim() : "";
        if (value) return decode(value);
      }
      return null;
    };
    const title = meta(["og:title", "twitter:title"]) || ((/<title[^>]*>([^<]*)<\/title>/i.exec(head) || [])[1] || "").trim();
    let image = meta(["og:image", "og:image:url", "twitter:image"]);
    if (image) {
      try {
        image = new URL(image, url).href;
      } catch {
        image = null;
      }
    }
    return {
      url: url,
      title: decode(title || "") || null,
      description: meta(["og:description", "description", "twitter:description"]),
      image: image,
      site: meta(["og:site_name"]),
    };
  }

  const address = (url) => {
    try {
      return new URL(url);
    } catch {
      return null;
    }
  };

  /** A YouTube video's id, from a watch, youtu.be or Shorts address. */
  function youtubeId(url) {
    const u = address(url);
    if (!u) return null;
    const host = u.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") return u.pathname.slice(1).split("/")[0] || null;
    if (host !== "youtube.com") return null;
    const shorts = /^\/shorts\/([\w-]+)/.exec(u.pathname);
    return shorts ? shorts[1] : u.searchParams.get("v");
  }

  /** The player a video page can be shown in: Bilibili's. YouTube's player
   *  refuses a page with no referrer, as a plugin's is, so it gets a card. */
  function videoEmbed(url) {
    const u = address(url);
    if (!u) return null;
    const host = u.hostname.replace(/^www\.|^m\./, "");
    const bv = /\/video\/(BV[0-9A-Za-z]+)/.exec(u.pathname);
    if (host === "bilibili.com" && bv) return "https://player.bilibili.com/player.html?bvid=" + bv[1] + "&autoplay=0";
    return null;
  }

  /** A YouTube video's still, for its card. */
  function videoPicture(url) {
    const id = youtubeId(url);
    return id ? "https://i.ytimg.com/vi/" + encodeURIComponent(id) + "/hqdefault.jpg" : null;
  }

  const isUrl = (text) => /^https?:\/\/\S+$/.test(String(text).trim());

  root.linkCards = { parse, write, fromHtml, videoEmbed, videoPicture, isUrl };
})(typeof window !== "undefined" ? window : globalThis);

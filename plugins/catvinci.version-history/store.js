// Version History's storage, in the plugin's global place: per document an
// index (key "d:<hash of its path>") of its versions - when, which text,
// its name and pin - and each text once, a file named by its hash
// ("t/<hash>.md"), however many versions or documents share it. Versions
// thin out with age; a deleted document's go a month after.
(function (root) {
  "use strict";
  const HOUR = 3600e3;
  const DAY = 24 * HOUR;
  /** Saves this close together are one version. */
  const EVERY = 15 * 60e3;
  /** A deleted document's versions are kept this long. */
  const DELETED_FOR = 30 * DAY;
  const META = "meta";

  /** 64 bits of FNV-1a (two lanes), hex. */
  function fnv(text) {
    let a = 0x811c9dc5;
    let b = 0x01000193;
    for (let i = 0; i < text.length; i++) {
      const c = text.charCodeAt(i);
      a = Math.imul(a ^ c, 0x01000193) >>> 0;
      b = Math.imul(b ^ c, 0x811c9dc5) >>> 0;
    }
    return a.toString(16).padStart(8, "0") + b.toString(16).padStart(8, "0");
  }
  const indexKey = (path) => "d:" + fnv(path) + path.length.toString(36);
  const textFile = (hash) => "t/" + hash + ".md";
  const idOf = (v) => v.since || v.at;
  /** Words as a writer counts them: each CJK character, each other run. */
  const wordsIn = (text) =>
    (text.match(/[぀-ヿ㐀-鿿가-힯]|[^\s぀-ヿ㐀-鿿가-힯]+/g) || []).length;

  /** Which stretch of time a version of age `age` stands for: each one
   *  for a day, then an hour's, to a week, a day's, to three months, then
   *  a week's (local time). */
  function bucketOf(at, age) {
    const d = new Date(at);
    if (age < 7 * DAY) return "h" + Math.floor(at / HOUR);
    const day = d.getFullYear() * 400 + d.getMonth() * 32 + d.getDate();
    if (age < 90 * DAY) return "d" + day;
    return "w" + Math.floor((at - d.getDay() * DAY) / (7 * DAY));
  }

  /** `versions` (newest first) as kept at `now`: all of the last day, then
   *  the newest of each hour, day or week; a named or pinned one always. */
  function thin(versions, now) {
    const seen = new Set();
    return versions.filter((v) => {
      const age = now - v.at;
      if (v.pinned || v.name || age < DAY) return true;
      const bucket = bucketOf(v.at, age);
      if (seen.has(bucket)) return false;
      seen.add(bucket);
      return true;
    });
  }

  const isFull = (e) => /full/i.test(String((e && e.message) || e));

  function createStore(place) {
    let full = false;
    const index = async (path) => {
      const kept = await place.get(indexKey(path));
      return kept && kept.path === path ? kept : { path: path, versions: [] };
    };
    const saveIndex = (kept) => place.set(indexKey(kept.path), kept);

    /** `text` as a file, once: its hash, another if one of that name
     *  holds other text. */
    async function keepText(text) {
      let hash = fnv(text) + text.length.toString(36);
      for (;;) {
        const there = await place.readText(textFile(hash)).catch(() => null);
        if (there === text) return hash;
        if (there === null) {
          await place.writeText(textFile(hash), text);
          return hash;
        }
        hash += "x";
      }
    }

    /** A write that makes room when the storage is full: older versions
     *  of any document go, oldest first, while there are any. */
    async function roomy(write) {
      for (let tries = 0; tries < 64; tries++) {
        try {
          await write();
          full = false;
          return true;
        } catch (e) {
          if (!isFull(e) || !(await dropOldest())) break;
        }
      }
      full = true;
      return false;
    }

    async function dropOldest() {
      let pick = null;
      for (const key of await place.keys()) {
        if (!key.startsWith("d:")) continue;
        const kept = await place.get(key);
        const list = (kept && kept.versions) || [];
        // The newest stays: it is the document as last saved.
        list.slice(1).forEach((v, i) => {
          if (!v.pinned && !v.name && (!pick || v.at < pick.at))
            pick = { kept: kept, at: v.at, i: i + 1 };
        });
      }
      if (!pick) return false;
      pick.kept.versions.splice(pick.i, 1);
      await saveIndex(pick.kept);
      await collect();
      return true;
    }

    /** Text files no version names any more. */
    async function collect() {
      const named = new Set();
      for (const key of await place.keys()) {
        if (!key.startsWith("d:")) continue;
        const kept = await place.get(key);
        for (const v of (kept && kept.versions) || []) named.add(textFile(v.hash));
      }
      for (const file of await place.files())
        if (file.startsWith("t/") && !named.has(file)) await place.deleteFile(file);
    }

    return {
      idOf: idOf,
      get full() {
        return full;
      },
      /** A document's versions, newest first, without their texts. */
      list: async (path) => (path ? (await index(path)).versions : []),
      text: (hash) => place.readText(textFile(hash)),
      /** Keeps `text` as `path`'s newest version unless it is that already;
       *  saves within EVERY of the newest one (unnamed, of the same kind)
       *  bring it up to date instead. True when something was kept. */
      async record(path, text, options) {
        const o = options || {};
        const now = o.now || Date.now();
        const kept = await index(path);
        const newest = kept.versions[0];
        let hash = null;
        if (!(await roomy(async () => (hash = await keepText(text))))) return false;
        if (newest && newest.hash === hash) return false;
        const version = { at: now, hash: hash, chars: text.length, words: wordsIn(text), source: o.source || "save" };
        const merge =
          o.merge !== false && newest && !newest.name && !newest.pinned &&
          newest.source === version.source && now - idOf(newest) < EVERY;
        if (merge) kept.versions[0] = Object.assign(version, { since: idOf(newest) });
        else kept.versions.unshift(version);
        kept.versions = thin(kept.versions, now);
        delete kept.deletedAt;
        return roomy(() => saveIndex(kept));
      },
      /** Names or pins version `id` of `path` (`name` "" takes it away). */
      async mark(path, id, change) {
        const kept = await index(path);
        const v = kept.versions.find((x) => idOf(x) === id);
        if (!v) return false;
        if ("pinned" in change) v.pinned = !!change.pinned || undefined;
        if ("name" in change) v.name = String(change.name || "").trim() || undefined;
        await saveIndex(kept);
        return true;
      },
      /** A document or folder renamed or moved: its documents' versions
       *  follow, never over versions a document has there. */
      async move(from, to) {
        const moved = (p) =>
          p === from ? to : p.startsWith(from + "/") || p.startsWith(from + "\\") ? to + p.slice(from.length) : null;
        for (const key of await place.keys()) {
          if (!key.startsWith("d:")) continue;
          const kept = await place.get(key);
          const next = kept && moved(kept.path);
          if (!next || (await place.get(indexKey(next)))) continue;
          await place.set(indexKey(next), Object.assign({}, kept, { path: next }));
          await place.delete(key);
        }
      },
      /** A document or folder deleted: its versions go a month later. */
      async forget(path, now) {
        for (const key of await place.keys()) {
          if (!key.startsWith("d:")) continue;
          const kept = await place.get(key);
          if (!kept || (kept.path !== path && !kept.path.startsWith(path + "/") && !kept.path.startsWith(path + "\\"))) continue;
          await saveIndex(Object.assign(kept, { deletedAt: now || Date.now() }));
        }
      },
      /** Deleted documents' versions past their month, versions thinned
       *  by age, and texts nothing names; at most once a day. */
      async clean(now) {
        const at = now || Date.now();
        const meta = (await place.get(META)) || {};
        if (meta.cleaned && at - meta.cleaned < DAY) return;
        for (const key of await place.keys()) {
          if (!key.startsWith("d:")) continue;
          const kept = await place.get(key);
          if (!kept) continue;
          if (kept.deletedAt && at - kept.deletedAt > DELETED_FOR) await place.delete(key);
          else {
            const versions = thin(kept.versions, at);
            if (versions.length !== kept.versions.length) await saveIndex(Object.assign(kept, { versions: versions }));
          }
        }
        await collect();
        await place.set(META, Object.assign(meta, { cleaned: at }));
      },
      /** 0.3's versions (keys "v:…", whole texts) moved into this form. */
      async migrate() {
        for (const key of await place.keys()) {
          if (!key.startsWith("v:") || key.endsWith(":now")) continue;
          const old = await place.get(key);
          const head = await place.get(key + ":now");
          const list = ((old && old.versions) || []).slice();
          const path = (old && old.path) || (head && head.path);
          if (head && head.version && head.path === path)
            list.unshift(head.version);
          if (path && list.length) {
            const kept = await index(path);
            for (const v of list.filter((x) => typeof x.text === "string")) {
              const hash = await keepText(v.text);
              if (kept.versions.some((x) => idOf(x) === idOf(v))) continue;
              kept.versions.push({ at: v.at, since: v.since, hash: hash, chars: v.text.length, words: wordsIn(v.text), source: "save" });
            }
            kept.versions.sort((a, b) => b.at - a.at);
            await saveIndex(kept);
          }
          await place.delete(key);
          await place.delete(key + ":now");
        }
      },
    };
  }

  root.versionStore = { createStore: createStore, thin: thin, wordsIn: wordsIn, EVERY: EVERY };
})(typeof window !== "undefined" ? window : globalThis);

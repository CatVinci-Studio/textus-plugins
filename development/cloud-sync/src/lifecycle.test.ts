import { beforeEach, expect, it } from "vitest";
import { Lifecycle, RETURN_GAP } from "./lifecycle";

let now: number, busy: boolean, automatic: boolean;
let log: string[];
const make = (state = "active") =>
  new Lifecycle(
    {
      automatic: () => automatic,
      busy: () => busy,
      sync: () => log.push("sync"),
      cancel: () => log.push("cancel"),
      pause: (paused) => log.push(paused ? "pause" : "resume"),
    },
    state,
    () => now,
  );
beforeEach(() => {
  now = 1_000_000;
  busy = false;
  automatic = true;
  log = [];
});

it("syncs once a folder opens, and only with automatic sync on", () => {
  make().opened();
  expect(log).toEqual(["sync"]);
  automatic = false;
  log = [];
  make().opened();
  expect(log).toEqual([]);
});
it("starts nothing in the background and holds the timers until Textus is back", () => {
  const life = make();
  life.changed("background");
  life.opened();
  expect(log).toEqual(["pause"]);
  expect(life.away).toBe(true);
  // Launched behind another app: held from the start.
  log = [];
  make("background").opened();
  expect(log).toEqual(["pause"]);
});
it("syncs on coming back only when the last sync is two minutes old", () => {
  const life = make();
  life.finished(true);
  life.changed("background");
  now += RETURN_GAP - 1;
  life.changed("active");
  expect(log).toEqual(["pause", "resume"]);
  life.changed("background");
  now += 1;
  life.changed("active");
  expect(log).toEqual(["pause", "resume", "pause", "resume", "sync"]);
});
it("stops a sync as Textus leaves, and goes on with it when Textus is back", () => {
  const life = make();
  life.finished(true);
  busy = true;
  life.changed("background");
  expect(log).toEqual(["pause", "cancel"]);
  // Back before the stopped one has ended: it runs once that one does.
  life.changed("active");
  expect(log).toEqual(["pause", "cancel", "resume"]);
  busy = false;
  life.finished(false);
  expect(log).toEqual(["pause", "cancel", "resume", "sync"]);
});
it("takes a failed sync as no sync: coming back tries again", () => {
  const life = make();
  life.finished(true);
  now += RETURN_GAP;
  life.finished(false);
  life.changed("background");
  life.changed("active");
  expect(log.at(-1)).toBe("sync");
});

import { expect, it } from "vitest";
import { doneText, fewPerSecond, statusText, type Status } from "./status";

const t = (key: string, ...args: unknown[]) => [key, ...args].join(" ");
const now = Date.parse("2026-11-05T12:00:00Z");
const synced: Status = {
  configured: true,
  busy: false,
  error: false,
  lastRun: "2026-11-05T11:58:00Z",
  result: {
    uploaded: 1,
    downloaded: 0,
    removed: 0,
    moved: 0,
    conflicts: [],
    deferred: [],
    notTrashed: [],
    unchanged: 0,
  },
};

it("says when sync last ran, and shows nothing until sync is set up", () => {
  expect(statusText(synced, now, t, "en")).toBe("statusSynced 2 min. ago");
  expect(
    statusText({ ...synced, lastRun: "2026-11-05T11:59:30Z" }, now, t, "en"),
  ).toBe("statusJustNow");
  expect(
    statusText({ ...synced, lastRun: "2026-11-05T09:00:00Z" }, now, t, "en"),
  ).toBe("statusSynced 3 hr. ago");
  expect(statusText({ ...synced, lastRun: undefined }, now, t, "en")).toBe(
    "statusNever",
  );
  expect(statusText({ ...synced, configured: false }, now, t, "en")).toBe(null);
});
it("puts syncing, errors and conflicts before the time", () => {
  const conflict = { ...synced.result!, conflicts: ["Sync conflicts/a.md"] };
  expect(statusText({ ...synced, busy: true }, now, t, "en")).toBe(
    "statusSyncing",
  );
  expect(statusText({ ...synced, error: true }, now, t, "en")).toBe(
    "statusError",
  );
  expect(statusText({ ...synced, result: conflict }, now, t, "en")).toBe(
    "statusConflict",
  );
});

it("passes a sync's progress on a few times a second, never dropping a new phase or the end", () => {
  let now = 0;
  const heard: string[] = [];
  const report = fewPerSecond(
    (phase, current, total) => heard.push(`${phase} ${current}/${total}`),
    () => now,
  );
  report("transferring", 0, 10);
  report("transferring", 1, 10);
  now = 250;
  report("transferring", 2, 10);
  report("transferring", 10, 10);
  report("publishing", 10, 10);
  expect(heard).toEqual([
    "transferring 0/10",
    "transferring 2/10",
    "transferring 10/10",
    "publishing 10/10",
  ]);
});

it("lists what a sync did, files the Trash refused too, and nothing when nothing happened", () => {
  const result = { ...synced.result!, uploaded: 2, notTrashed: ["a.md"] };
  expect(doneText(result, t)).toBe(
    "doneUploaded 2listSeparatordoneNotTrashed 1",
  );
  expect(doneText({ ...result, uploaded: 0, notTrashed: [] }, t)).toBeNull();
});

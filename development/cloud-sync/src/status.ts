import type { Result } from "./model";

export interface Status {
  configured: boolean;
  busy: boolean;
  error: boolean;
  result?: Result;
  lastRun?: string;
}
const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
];

/** The status bar's words for a sync state; null while sync is not set up. */
export function statusText(
  s: Status,
  now: number,
  t: (key: string, ...args: unknown[]) => string,
  language: string,
): string | null {
  if (!s.configured) return null;
  if (s.busy) return t("statusSyncing");
  if (s.error) return t("statusError");
  if (s.result?.conflicts.length) return t("statusConflict");
  if (!s.lastRun) return t("statusNever");
  const age = now - Date.parse(s.lastRun);
  const unit = units.find(([, ms]) => age >= ms);
  if (!unit) return t("statusJustNow");
  const when = new Intl.RelativeTimeFormat(language, { style: "short" }).format(
    -Math.floor(age / unit[1]),
    unit[0],
  );
  return t("statusSynced", when);
}

/** A sync's progress passed on a few times a second: many transfers end
 *  at once, and each would redraw every panel. A new phase and the last
 *  step always pass. */
export function fewPerSecond(
  report: (phase: string, current: number, total: number) => void,
  now: () => number = Date.now,
) {
  let shown = "",
    at = -Infinity;
  return (phase: string, current: number, total: number) => {
    if (phase === shown && current < total && now() - at < 200) return;
    shown = phase;
    at = now();
    report(phase, current, total);
  };
}

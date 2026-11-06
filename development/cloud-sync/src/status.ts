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

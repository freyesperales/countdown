/**
 * Pure countdown math. No Date.now() — caller passes `now`.
 */

export type Remaining = {
  expired: boolean;
  totalSeconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export const EXPIRED: Remaining = {
  expired: true,
  totalSeconds: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

/**
 * Compute remaining time between `now` and `target`.
 * Both are absolute instants (ms since epoch). Timezone is purely a display concern.
 */
export function computeRemaining(nowMs: number, targetMs: number): Remaining {
  const diffMs = targetMs - nowMs;
  if (diffMs <= 0) return EXPIRED;

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { expired: false, totalSeconds, days, hours, minutes, seconds };
}

/**
 * Human-readable short remaining (e.g. "in 3 days", "in 2 hours", "in 45 seconds").
 * Used for the document <title>.
 */
export function humanRemaining(r: Remaining): string {
  if (r.expired) return "now";
  if (r.days >= 1) return `in ${r.days} day${r.days === 1 ? "" : "s"}`;
  if (r.hours >= 1) return `in ${r.hours} hour${r.hours === 1 ? "" : "s"}`;
  if (r.minutes >= 1) return `in ${r.minutes} minute${r.minutes === 1 ? "" : "s"}`;
  return `in ${r.seconds} second${r.seconds === 1 ? "" : "s"}`;
}

/**
 * Parse an ISO 8601 datetime string (with or without timezone offset) to ms.
 * Returns NaN for invalid input.
 */
export function parseTargetIso(iso: string): number {
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? t : Number.NaN;
}

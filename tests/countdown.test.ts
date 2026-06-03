import { describe, it, expect } from "vitest";
import {
  computeRemaining,
  humanRemaining,
  parseTargetIso,
  EXPIRED,
} from "../src/lib/countdown";

describe("computeRemaining", () => {
  it("returns expired when target is in the past", () => {
    const now = 1_000_000_000_000;
    expect(computeRemaining(now, now - 1)).toEqual(EXPIRED);
    expect(computeRemaining(now, now - 60_000).expired).toBe(true);
  });

  it("returns expired when target equals now", () => {
    expect(computeRemaining(1000, 1000).expired).toBe(true);
  });

  it("computes 1 second remaining", () => {
    const r = computeRemaining(0, 1500);
    expect(r.expired).toBe(false);
    expect(r.days).toBe(0);
    expect(r.hours).toBe(0);
    expect(r.minutes).toBe(0);
    expect(r.seconds).toBe(1);
    expect(r.totalSeconds).toBe(1);
  });

  it("computes 1 day remaining exactly", () => {
    const r = computeRemaining(0, 86_400_000);
    expect(r.days).toBe(1);
    expect(r.hours).toBe(0);
    expect(r.minutes).toBe(0);
    expect(r.seconds).toBe(0);
  });

  it("computes ~1 year remaining (365 days)", () => {
    const oneYearMs = 365 * 86_400_000;
    const r = computeRemaining(0, oneYearMs);
    expect(r.days).toBe(365);
    expect(r.expired).toBe(false);
  });

  it("computes a complex offset correctly", () => {
    // 3 days, 4 hours, 5 minutes, 6 seconds
    const ms =
      3 * 86_400_000 + 4 * 3_600_000 + 5 * 60_000 + 6 * 1000;
    const r = computeRemaining(0, ms);
    expect(r).toMatchObject({
      expired: false,
      days: 3,
      hours: 4,
      minutes: 5,
      seconds: 6,
    });
  });
});

describe("humanRemaining", () => {
  it("returns 'now' when expired", () => {
    expect(humanRemaining(EXPIRED)).toBe("now");
  });

  it("formats days, hours, minutes, seconds", () => {
    expect(
      humanRemaining({
        expired: false,
        totalSeconds: 0,
        days: 3,
        hours: 4,
        minutes: 5,
        seconds: 6,
      }),
    ).toBe("in 3 days");
    expect(
      humanRemaining({
        expired: false,
        totalSeconds: 0,
        days: 0,
        hours: 2,
        minutes: 5,
        seconds: 6,
      }),
    ).toBe("in 2 hours");
    expect(
      humanRemaining({
        expired: false,
        totalSeconds: 0,
        days: 0,
        hours: 0,
        minutes: 1,
        seconds: 6,
      }),
    ).toBe("in 1 minute");
    expect(
      humanRemaining({
        expired: false,
        totalSeconds: 45,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 45,
      }),
    ).toBe("in 45 seconds");
  });
});

describe("parseTargetIso", () => {
  it("parses a valid ISO string", () => {
    expect(parseTargetIso("2026-12-25T00:00:00Z")).toBeGreaterThan(0);
  });
  it("returns NaN for invalid input", () => {
    expect(Number.isNaN(parseTargetIso("not-a-date"))).toBe(true);
  });
});

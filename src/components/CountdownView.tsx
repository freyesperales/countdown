"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  computeRemaining,
  humanRemaining,
  parseTargetIso,
  type Remaining,
} from "@/lib/countdown";
import { pad2, padDays } from "@/lib/format";
import { themeToCssVars, type ThemeName } from "@/lib/themes";

type Props = {
  to: string; // ISO 8601
  label: string;
  tz: string; // empty => use viewer's
  theme: ThemeName;
  /** Tiny footer hidden when used as embedded preview */
  hideFooter?: boolean;
};

function formatInTz(targetMs: number, tz: string): string {
  try {
    const fmt = new Intl.DateTimeFormat(undefined, {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: tz || undefined,
    });
    return fmt.format(new Date(targetMs));
  } catch {
    // Bad IANA string — fall back to viewer's local time.
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date(targetMs));
  }
}

export default function CountdownView({
  to,
  label,
  tz,
  theme,
  hideFooter,
}: Props) {
  const targetMs = useMemo(() => parseTargetIso(to), [to]);
  const valid = Number.isFinite(targetMs);

  const [remaining, setRemaining] = useState<Remaining>(() =>
    valid ? computeRemaining(Date.now(), targetMs) : computeRemaining(0, 0),
  );

  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!valid) return;
    const tick = () => setRemaining(computeRemaining(Date.now(), targetMs));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [valid, targetMs]);

  // Sync document.title client-side
  useEffect(() => {
    if (typeof document === "undefined") return;
    const head = label || "countdown";
    document.title = `${head} — ${humanRemaining(remaining)}`;
  }, [label, remaining]);

  const onClickTime = () => {
    const el = rootRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  if (!valid) {
    return (
      <main
        style={themeToCssVars(theme)}
        className="min-h-screen w-full flex items-center justify-center p-6"
      >
        <div className="text-center">
          <div className="font-mono text-2xl mb-2">Invalid target</div>
          <div className="opacity-70 text-sm">
            Provide a valid ISO date in <code>?to=</code>
          </div>
        </div>
      </main>
    );
  }

  const targetLabel = formatInTz(targetMs, tz);

  return (
    <main
      ref={rootRef}
      style={themeToCssVars(theme)}
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden"
    >
      {remaining.expired && <Confetti />}

      <div className="w-full max-w-5xl mx-auto text-center">
        {remaining.expired ? (
          <div>
            <div
              className="font-mono font-bold tracking-tight leading-none"
              style={{
                fontSize: "clamp(2.5rem, 12vw, 9rem)",
                color: "var(--accent)",
              }}
            >
              Time&apos;s up ✓
            </div>
            {label && (
              <div
                className="mt-6 text-xl sm:text-2xl"
                style={{ color: "var(--muted)" }}
              >
                {label}
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={onClickTime}
              aria-label="Toggle fullscreen"
              className="block w-full font-mono font-bold tracking-tight leading-none select-none cursor-pointer bg-transparent border-0 p-0 m-0 text-inherit"
              style={{
                fontSize: "clamp(2rem, 10vw, 8rem)",
                fontFamily: "var(--font-mono)",
              }}
            >
              <span aria-hidden="true">
                {padDays(remaining.days)}
                <Sep />
                {pad2(remaining.hours)}
                <Sep />
                {pad2(remaining.minutes)}
                <Sep />
                {pad2(remaining.seconds)}
              </span>
            </button>

            <div
              className="mt-2 font-mono text-xs sm:text-sm uppercase tracking-[0.3em] opacity-70"
              aria-hidden="true"
            >
              <span className="inline-block min-w-[4ch]">days</span>
              <span className="inline-block min-w-[4ch]">hrs</span>
              <span className="inline-block min-w-[4ch]">min</span>
              <span className="inline-block min-w-[4ch]">sec</span>
            </div>

            {label && (
              <div className="mt-8 text-2xl sm:text-3xl font-medium">
                {label}
              </div>
            )}

            <div
              className="mt-3 text-sm"
              style={{ color: "var(--muted)" }}
            >
              {targetLabel}
              {tz ? ` (${tz})` : ""}
            </div>
          </>
        )}
      </div>

      {!hideFooter && (
        <footer
          className="absolute bottom-3 left-0 right-0 text-center text-xs opacity-60"
          style={{ color: "var(--muted)" }}
        >
          Made with{" "}
          <a href="/" className="underline" style={{ color: "inherit" }}>
            countdown
          </a>
          {" — make your own"}
        </footer>
      )}
    </main>
  );
}

function Sep() {
  return (
    <span className="opacity-40 px-[0.15em]" aria-hidden="true">
      :
    </span>
  );
}

const CONFETTI_COLORS = [
  "#fbbf24",
  "#0ea5e9",
  "#ec4899",
  "#22c55e",
  "#a855f7",
  "#f97316",
];

function Confetti() {
  const pieces = Array.from({ length: 40 });
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {pieces.map((_, i) => {
        const left = (i * 97) % 100;
        const delay = (i * 173) % 3000;
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        return (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${left}%`,
              background: color,
              animationDelay: `${delay}ms`,
              animationDuration: `${2500 + (i % 7) * 200}ms`,
            }}
          />
        );
      })}
    </div>
  );
}

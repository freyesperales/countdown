"use client";

import { useEffect, useMemo, useState } from "react";
import ThemePicker from "./ThemePicker";
import EmbedSnippet from "./EmbedSnippet";
import { DEFAULT_THEME, buildEmbedSnippet, buildShareUrl } from "@/lib/url";
import type { ThemeName } from "@/lib/themes";

/** Default for the datetime input: next New Year, viewer's local zone. */
function defaultDateTimeLocal(): string {
  const now = new Date();
  const yearOfTarget = now.getFullYear() + 1;
  const d = new Date(yearOfTarget, 0, 1, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function viewerTz(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "";
  }
}

export default function GeneratorForm() {
  const [to, setTo] = useState<string>("");
  const [label, setLabel] = useState<string>("New Year");
  const [tz, setTz] = useState<string>("");
  const [theme, setTheme] = useState<ThemeName>(DEFAULT_THEME);
  const [generated, setGenerated] = useState(false);
  const [origin, setOrigin] = useState<string>("");

  // Hydrate defaults on the client (avoid SSR mismatch).
  useEffect(() => {
    setTo(defaultDateTimeLocal());
    setTz(viewerTz());
    setOrigin(window.location.origin);
  }, []);

  const isoTarget = useMemo(() => {
    if (!to) return "";
    // datetime-local has no timezone — interpret as the value the user typed.
    // We persist exactly what they typed; CountdownView reads it as local time.
    return to.length === 16 ? `${to}:00` : to;
  }, [to]);

  const shareUrl = useMemo(() => {
    if (!origin || !isoTarget) return "";
    return buildShareUrl(origin, { to: isoTarget, label, tz, theme });
  }, [origin, isoTarget, label, tz, theme]);

  const embedSnippet = useMemo(
    () => (shareUrl ? buildEmbedSnippet(shareUrl) : ""),
    [shareUrl],
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg ring-1 ring-neutral-200 p-6 sm:p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setGenerated(true);
        }}
        className="space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-neutral-500">
              Target date & time
            </span>
            <input
              type="datetime-local"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-wider text-neutral-500">
              Label (optional, ≤ 60 chars)
            </span>
            <input
              type="text"
              maxLength={60}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Christmas"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-xs uppercase tracking-wider text-neutral-500">
            Timezone (IANA)
          </span>
          <input
            type="text"
            value={tz}
            onChange={(e) => setTz(e.target.value)}
            placeholder="America/Santiago"
            className="mt-1 w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white font-mono text-sm"
          />
          <span className="text-xs text-neutral-500 mt-1 block">
            Default: viewer&apos;s timezone. Override only if you want the
            countdown displayed in a specific zone.
          </span>
        </label>

        <div>
          <span className="text-xs uppercase tracking-wider text-neutral-500 block mb-2">
            Theme
          </span>
          <ThemePicker value={theme} onChange={setTheme} />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-neutral-900 text-white font-semibold hover:bg-neutral-700"
          >
            Generate URL
          </button>
        </div>
      </form>

      {generated && shareUrl && (
        <div className="mt-8 pt-8 border-t border-neutral-200">
          <EmbedSnippet shareUrl={shareUrl} embedSnippet={embedSnippet} />
        </div>
      )}
    </div>
  );
}

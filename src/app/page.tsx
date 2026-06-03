"use client";

import { useEffect, useMemo, useState } from "react";
import CountdownView from "@/components/CountdownView";
import GeneratorForm from "@/components/GeneratorForm";

export const dynamic = "force-static";

function nextNewYearIso(): string {
  // Stable string so SSR/CSR match: "<currentYear+1>-01-01T00:00:00".
  // We compute on the client to use the actual current year.
  const y = new Date().getFullYear() + 1;
  return `${y}-01-01T00:00:00`;
}

export default function Home() {
  const [target, setTarget] = useState<string>("");

  useEffect(() => {
    setTarget(nextNewYearIso());
  }, []);

  const demoLabel = useMemo(() => "New Year", []);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Hero with live demo countdown */}
      <section className="border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-6 sm:pt-16">
          <div className="flex items-center justify-between mb-8">
            <div className="font-mono text-lg font-bold tracking-tight">
              countdown
            </div>
            <a
              href="https://github.com"
              className="text-sm underline text-neutral-600"
            >
              GitHub
            </a>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl">
            Beautiful countdowns. Share by URL. Embed anywhere.
          </h1>
          <p className="mt-3 text-neutral-600 max-w-2xl">
            All state lives in the URL. No signup. No ads.{" "}
            <span className="font-medium">No analytics, no cookies</span> —
            verify in DevTools.
          </p>
        </div>

        {/* Live demo */}
        <div className="max-w-6xl mx-auto px-6 pb-10">
          <div className="rounded-2xl overflow-hidden ring-1 ring-neutral-200 shadow-sm">
            <div className="h-[340px] sm:h-[420px]">
              {target ? (
                <CountdownView
                  to={target}
                  label={demoLabel}
                  tz=""
                  theme="sunset"
                  hideFooter
                />
              ) : (
                <div className="h-full bg-neutral-200" />
              )}
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            ↑ Live demo. Click the numbers for fullscreen.
          </p>
        </div>
      </section>

      {/* Generator */}
      <section className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
        <h2 className="text-2xl font-bold mb-6">Make your own</h2>
        <GeneratorForm />
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-neutral-500 flex flex-wrap gap-x-6 gap-y-2 justify-between">
          <div>
            countdown — MIT licensed. No tracking. No backend.
          </div>
          <div className="font-mono">
            ?to=ISO&label=…&tz=IANA&theme=dark|light|sunset|ocean|forest
          </div>
        </div>
      </footer>
    </div>
  );
}

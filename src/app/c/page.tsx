"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CountdownView from "@/components/CountdownView";
import { parseParams } from "@/lib/url";

export const dynamic = "force-static";

function CountdownRoute() {
  const sp = useSearchParams();
  const params = parseParams(sp.toString());

  if (!params.to) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-white p-6">
        <div className="text-center">
          <div className="font-mono text-2xl mb-2">Missing target</div>
          <div className="opacity-70 text-sm">
            Add <code>?to=2026-12-25T00:00:00</code> to the URL.
          </div>
          <a className="underline mt-4 inline-block" href="/">
            Make one →
          </a>
        </div>
      </main>
    );
  }

  return (
    <CountdownView
      to={params.to}
      label={params.label}
      tz={params.tz}
      theme={params.theme}
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CountdownRoute />
    </Suspense>
  );
}

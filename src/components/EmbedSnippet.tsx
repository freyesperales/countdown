"use client";

import { useState } from "react";

type Props = {
  shareUrl: string;
  embedSnippet: string;
};

function CopyButton({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false);
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch {
      // Fallback: select the input if any. Best-effort.
    }
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-2 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700"
    >
      {done ? "Copied ✓" : label}
    </button>
  );
}

export default function EmbedSnippet({ shareUrl, embedSnippet }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">
          Shareable URL
        </label>
        <div className="flex gap-2">
          <input
            readOnly
            value={shareUrl}
            className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50 font-mono text-sm"
            onFocus={(e) => e.currentTarget.select()}
          />
          <CopyButton value={shareUrl} label="Copy URL" />
        </div>
        <a
          href={shareUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-2 text-sm text-sky-700 underline"
        >
          Open countdown in new tab →
        </a>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">
          Embed snippet
        </label>
        <div className="flex gap-2">
          <textarea
            readOnly
            value={embedSnippet}
            rows={3}
            className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50 font-mono text-xs"
            onFocus={(e) => e.currentTarget.select()}
          />
          <CopyButton value={embedSnippet} label="Copy embed" />
        </div>
      </div>
    </div>
  );
}
